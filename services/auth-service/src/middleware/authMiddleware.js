/**
 * Authentication Middleware
 * 
 * WHY THIS FILE EXISTS:
 * This middleware handles general authentication concerns beyond simple token verification.
 * It can be extended to include rate limiting, IP whitelisting, or other security measures.
 * 
 * ARCHITECTURE DECISION:
 * - Separate from verifyToken.js for single responsibility
 * - verifyToken.js: Only validates tokens
 * - authMiddleware.js: Additional auth-related checks
 */

/**
 * Base Authentication Middleware
 * Currently passes through, can be extended with additional checks
 */
module.exports = (req, res, next) => {
  // Placeholder for additional authentication logic
  // Could include: session tracking, device fingerprinting, etc.
  next();
};

/**
 * Require Role Middleware Factory
 * Creates middleware that checks for specific role requirement
 * 
 * @param {string} role - Required role (e.g., "administrator")
 * @returns {Function} Express middleware
 */
module.exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ 
      success: false, 
      error: "Insufficient permissions" 
    });
  }
  next();
};