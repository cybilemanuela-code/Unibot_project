/**
 * Express Application Configuration
 * 
 * WHY THIS FILE EXISTS:
 * This is the main Express application setup. It configures:
 * - Security middleware (helmet, cors)
 * - Rate limiting to prevent abuse
 * - Body parsing
 * - Routes
 * - Error handling
 * 
 * ARCHITECTURE DECISION:
 * - Separated from server.js for testing (can import app without starting server)
 * - Serverless deployments import this for lambda.handler
 * - Local development can start server directly
 * 
 * SECURITY MIDDLEWARE STACK:
 * 1. Helmet: Sets secure HTTP headers (XSS protection, no-sniff, etc.)
 * 2. CORS: Restricts cross-origin requests to allowed origins
 * 3. Rate limiting: Prevents brute force and DoS attacks
 * 4. Body parser: Limits payload size to prevent memory attacks
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./src/routes/auth.routes");
const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();

// SECURITY MIDDLEWARE
// Helmet sets various HTTP headers for security
// CSP, XSS Protection, HSTS, No-Sniff, etc.
app.use(helmet());

// CORS configuration
// Restricts API access to specified origins
// In production, set ALLOWED_ORIGINS environment variable
app.use(cors({ 
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" 
}));

// Body parser with size limit
// Prevents large payloads that could exhaust server memory
app.use(express.json({ limit: "10kb" }));

// RATE LIMITING
// Critical for authentication endpoints to prevent:
// - Brute force password attacks
// - Token enumeration
// - Account enumeration
app.use(rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: "Too many requests, please try again later." } 
}));

// ROUTES
// All authentication routes under /auth prefix
app.use("/auth", authRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: "Route not found" 
  });
});

// GLOBAL ERROR HANDLER
// Catches all errors from previous middleware
app.use(errorMiddleware);

module.exports = app;

/**
 * AWS LAMBDA DEPLOYMENT:
 * This app is wrapped by serverless-http in lambda.js
 * serverless-http converts Express app to Lambda-compatible handler
 * 
 * API GATEWAY INTEGRATION:
 * - Lambda URL: https://your-api.execute-api.region.amazonaws.com/prod
 * - API Gateway maps /auth/* to Lambda
 * - Lambda returns response to API Gateway
 * - API Gateway returns HTTP response to client
 */