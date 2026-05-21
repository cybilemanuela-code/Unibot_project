/**
 * Role-Based Authorization Middleware
 * 
 * WHY THIS FILE EXISTS:
 * Role-based access control (RBAC) is essential for multi-user systems.
 * This middleware restricts access to routes based on user roles.
 * 
 * ARCHITECTURE:
 * - Role stored as custom claim in Firebase token
 * - Custom claims are set during registration or via admin SDK
 * - Claims persist until token is refreshed or revoked
 * 
 * USAGE:
 * router.get("/admin", requireRole("administrator"), controller.adminOnly)
 * 
 * SECURITY CONSIDERATIONS:
 * - Role should be validated against whitelist
 * - Consider implementing permission strings instead of roles for fine-grained control
 * - Log unauthorized access attempts for security auditing
 */

/**
 * Require Specific Role Middleware
 * 
 * @param {string} requiredRole - The role required to access the route
 * @returns {Function} Express middleware function
 */
module.exports = (requiredRole) => {
  return (req, res, next) => {
    // Check if user is authenticated (populated by verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    // Check if user has required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Insufficient permissions."
      });
    }

    next();
  };
};