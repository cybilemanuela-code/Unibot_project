/**
 * Token Verification Middleware
 * 
 * WHY THIS FILE EXISTS:
 * This middleware verifies JWT tokens on protected routes. It extracts the token
 * from the Authorization header, validates it with Firebase, and attaches the
 * decoded user data to the request object.
 * 
 * AUTHENTICATION FLOW:
 * 1. Client sends request with Authorization: Bearer <token>
 * 2. Middleware extracts token from header
 * 3. Verifies token with Firebase Admin SDK
 * 4. Attaches decoded token to req.user
 * 5. Calls next() to proceed to controller
 * 
 * WHY USE FIREBASE ADMIN FOR VERIFICATION?
 * - Verifies token signature (prevents tampering)
 * - Checks expiration automatically
 * - Decodes claims including custom claims (role, etc.)
 * - Much faster than database lookups (1-2ms vs 50ms)
 */

const { auth } = require("../config/firebase");

/**
 * Verify Token Middleware
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Format: "Bearer <token>"
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: "No token provided" 
      });
    }

    // Verify token with Firebase Admin SDK
    // This validates signature, expiration, and issuer
    const decoded = await auth.verifyIdToken(token);
    
    // Attach decoded token to request for use in controllers
    // decoded.uid, decoded.email, decoded.role are available
    req.user = decoded;
    
    next();
  } catch (err) {
    // Token verification failed (invalid, expired, tampered)
    res.status(401).json({ 
      success: false, 
      error: "Invalid or expired token" 
    });
  }
};