/**
 * Authentication Controller
 * 
 * WHY THIS FILE EXISTS:
 * Controllers handle HTTP request/response logic. They receive validated requests
 * from routes, delegate business logic to services, and format responses.
 * 
 * CONTROLLER VS SERVICE RESPONSIBILITIES:
 * - Controller: HTTP concerns (status codes, response format, error handling)
 * - Service: Business logic (database operations, Firebase interactions)
 * 
 * WHY USE .bind(ctrl)?
 * - Ensures 'this' context refers to the AuthController instance
 * - Required when passing methods as middleware/callbacks
 * - Alternative: Use arrow functions or class properties
 */

const authService = require("../service/auth.service");
const { success, error } = require("../utils/validators");
const logger = require("../utils/logger");

class AuthController {
  /**
   * User Registration Endpoint
   * 
   * HTTP: POST /auth/register
   * Body: { email, password, name, role? }
   * 
   * FLOW:
   * 1. Request validated by validation middleware
   * 2. AuthService.createUser() creates Firebase Auth user
   * 3. Firestore profile document created
   * 4. 201 response with user data (without password)
   * 
   * ERROR HANDLING:
   * - Firebase auth/email-already-exists: 409 Conflict
   * - Validation errors: 400 Bad Request (from middleware)
   * - Other errors: 500 Internal Server Error
   */
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return success(res, result, 201);
    } catch (err) {
      logger.error("Register failed", { msg: err.message });
      
      // Firebase-specific error codes for better error messages
      if (err.code === "auth/email-already-exists") {
        return error(res, "Email already registered", 409);
      }
      return error(res, "Registration failed", 500, err.message);
    }
  }

  /**
   * Get User Profile Endpoint
   * 
   * HTTP: GET /auth/profile
   * Headers: Authorization: Bearer <token>
   * 
   * SECURITY:
   * - Protected by verifyToken middleware
   * - Only returns profile for authenticated user (req.user.uid)
   */
  async getProfile(req, res) {
    try {
      const profile = await authService.getProfile(req.user.uid);
      return success(res, profile);
    } catch (err) {
      return error(res, "Profile not found", 404);
    }
  }

  /**
   * Update User Profile Endpoint
   * 
   * HTTP: PUT /auth/profile
   * Headers: Authorization: Bearer <token>
   * Body: { name?, phone? }
   */
  async updateProfile(req, res) {
    try {
      const updated = await authService.updateProfile(req.user.uid, req.body);
      return success(res, updated);
    } catch (err) {
      return error(res, "Update failed", 500, err.message);
    }
  }

  /**
   * Logout Endpoint
   * 
   * HTTP: POST /auth/logout
   * 
   * HOW LOGOUT WORKS:
   * - Firebase uses refresh tokens for session persistence
   * - revokeRefreshTokens() invalidates all sessions for the user
   * - Current ID tokens remain valid until they expire (1 hour)
   * - User must re-authenticate to get new tokens
   */
  async logout(req, res) {
    try {
      const result = await authService.logout(req.user.uid);
      return success(res, result);
    } catch (err) {
      return error(res, "Logout failed", 500);
    }
  }

  /**
   * Verify Token Endpoint
   * 
   * HTTP: POST /auth/verify-token
   * Body: { token in Authorization header }
   * 
   * USE CASE:
   * - Frontend can verify token validity before making API calls
   * - API Gateway can use this to validate tokens
   */
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = await authService.verifyToken(token);
      return success(res, { uid: decoded.uid, role: decoded.role });
    } catch (err) {
      return error(res, "Invalid token", 401);
    }
  }

  /**
   * User Login Endpoint
   * 
   * HTTP: POST /auth/login
   * Body: { email, password }
   * 
   * FLOW:
   * 1. Find user by email
   * 2. Generate custom token
   * 3. Return user info with token
   */
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return success(res, result);
    } catch (err) {
      logger.error("Login failed", { msg: err.message });
      
      if (err.code === "auth/user-not-found") {
        return error(res, "Invalid email or password", 401);
      }
      return error(res, "Login failed", 500, err.message);
    }
  }
}

module.exports = new AuthController();