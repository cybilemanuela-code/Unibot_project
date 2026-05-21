/**
 * Authentication Routes
 * 
 * WHY THIS FILE EXISTS:
 * Routes define the API endpoints and map them to controllers.
 * Each route specifies:
 * - HTTP method (GET, POST, PUT, DELETE)
 * - Path (relative to /auth prefix)
 * - Middleware chain (validation, authentication)
 * - Controller handler
 * 
 * MIDDLEWARE EXECUTION ORDER:
 * 1. Request enters route
 * 2. Validate middleware runs (if present)
 * 3. verifyToken middleware runs (if protected route)
 * 4. Controller handler executes
 * 5. Response sent back
 * 
 * ROUTE CATEGORIES:
 * - Public: No authentication required (register, verify-token)
 * - Protected: Requires valid Firebase token
 */

const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/roleMiddleware");
const { validate, registerSchema } = require("../utils/validator");

// Login schema for validation
const { loginSchema } = require("../utils/validator");

// PUBLIC ROUTES
// These endpoints don't require authentication

/**
 * POST /auth/register
 * Register a new user
 * - Validates request body
 * - Creates Firebase Auth user
 * - Creates Firestore profile document
 */
router.post("/register", validate(registerSchema), ctrl.register.bind(ctrl));

/**
 * POST /auth/login
 * Authenticate user and return token
 * - Validates request body
 * - Returns user info with custom token
 */
router.post("/login", validate(loginSchema), ctrl.login.bind(ctrl));

/**
 * POST /auth/verify-token
 * Verify a Firebase ID token
 * - Public endpoint for token verification
 * - Used by frontend/API gateway to check token validity
 */
router.post("/verify-token", ctrl.verifyToken.bind(ctrl));

// PROTECTED ROUTES
// These require valid Firebase ID token in Authorization header

/**
 * GET /auth/profile
 * Get authenticated user's profile
 * - Requires valid token
 * - Returns user data from Firestore
 */
router.get("/profile", verifyToken, ctrl.getProfile.bind(ctrl));

/**
 * PUT /auth/profile
 * Update authenticated user's profile
 * - Requires valid token
 * - Only updates whitelisted fields
 */
router.put("/profile", verifyToken, ctrl.updateProfile.bind(ctrl));

/**
 * POST /auth/logout
 * Revoke user's refresh tokens
 * - Requires valid token
 * - Invalidates all user sessions
 */
router.post("/logout", verifyToken, ctrl.logout.bind(ctrl));

/**
 * GET /auth/admin
 * Admin-only endpoint
 * - Requires valid token and admin role
 */
router.get("/admin", verifyToken, requireRole("administrator"), (req, res) => {
  res.json({ 
    success: true, 
    message: "Admin access granted",
    user: req.user 
  });
});

module.exports = router;