/**
 * Error Handling Middleware
 * 
 * WHY THIS FILE EXISTS:
 * Centralized error handling ensures consistent error responses and prevents
 * sensitive information from leaking to clients. This middleware catches
 * all errors passed through next() or thrown in async functions.
 * 
 * EXPRESS ERROR HANDLING:
 * - Must have 4 parameters (err, req, res, next)
 * - Catches errors from previous middleware/controllers
 * - Should be the last middleware added to the app
 * 
 * SECURITY CONSIDERATIONS:
 * - Never expose stack traces to clients in production
 * - Log all errors for debugging
 * - Handle specific error types differently (validation vs database)
 */

module.exports = (err, req, res, next) => {
  // Log error for debugging (in production, use proper logging service)
  console.error(err);

  // Determine status code (default 500 for unexpected errors)
  const status = err.status || 500;
  
  // Don't expose internal error details in production
  const message = status === 500 
    ? "Internal server error" 
    : err.message;

  res.status(status).json({
    success: false,
    error: message
  });
};