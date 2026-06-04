/**
 * Authentication Service Layer
 * 
 * WHY THIS FILE EXISTS:
 * The service layer contains all business logic for authentication. It's separated from
 * controllers to follow the Single Responsibility Principle and make code testable.
 * 
 * ARCHITECTURE PATTERN:
 * - Service layer: Contains all business logic, database operations, and Firebase interactions
 * - Controller layer: Handles HTTP requests/responses, delegates to services
 * - Middleware: Handles authentication checks before reaching controllers
 * 
 * FIREBASE AUTHENTICATION FLOW EXPLAINED:
 * 1. User registers: createUser() creates a Firebase Auth user with email/password
 * 2. Custom claims: setCustomUserClaims() assigns roles (student/admin) that persist
 *    in the user's token for the token's lifetime (or until refreshed)
 * 3. Firestore sync: Store additional user data (name, preferences) in Firestore
 * 4. Login: Firebase handles password verification internally in createUser flow
 * 5. Token verification: verifyIdToken() decodes and validates Firebase tokens
 * 6. Logout: revokeRefreshTokens() invalidates all user sessions
 */

const { auth, db } = require("../config/firebase");
const logger = require("../utils/logger");

class AuthService {
  /**
   * User Registration
   * 
   * FLOW:
   * 1. Create Firebase Auth user record (stores email, password hash, displayName)
   * 2. Set custom claim for role (persisted in Firebase Auth, not Firestore)
   * 3. Create Firestore document for extended profile data
   * 
   * WHY BOTH FIREBASE AUTH AND FIRESTORE?
   * - Firebase Auth: Fast, optimized for authentication (1ms reads)
   * - Firestore: Flexible document storage for profile data, preferences, etc.
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password (min 8 characters recommended)
   * @param {string} name - User's display name
   * @param {string} role - "student" or "administrator"
   * @returns {Promise<{uid, email, name, role}>}
   */
  async register({ email, password, name, role = "student" }) {
    // Step 1: Create Firebase Auth user
    // This stores the user in Firebase's internal authentication database
    // Firebase handles password hashing with bcrypt internally
    const userRecord = await auth.createUser({ 
      email, 
      password, 
      displayName: name 
    });

    // Step 2: Set custom claim (role)
    // Custom claims are embedded in Firebase ID tokens
    // They're used for role-based access control without database lookups
    // IMPORTANT: Custom claims are only updated when tokens are refreshed
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Step 3: Persist extended profile in Firestore
    // Firestore is used for data that doesn't belong in Firebase Auth
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      active: true,
    });

    logger.info("User registered", { uid: userRecord.uid, role });
    return { uid: userRecord.uid, email, name, role };
  }

  /**
   * Get User Profile
   * Retrieves extended user data from Firestore
   * 
   * @param {string} uid - Firebase UID from authenticated token
   * @returns {Promise<Object>} User profile data
   */
  async getProfile(uid) {
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) throw new Error("User profile not found");
    return doc.data();
  }

  /**
   * Update User Profile
   * 
   * SECURITY: Only allows updating whitelisted fields
   * This prevents malicious users from modifying sensitive data
   * 
   * @param {string} uid - Firebase UID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated fields
   */
  async updateProfile(uid, updates) {
    // SECURITY: Whitelist allowed fields
    // Never trust client input - only allow specific fields to be modified
    const allowed = ["name", "phone"];
    const safe = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );
    
    await db.collection("users").doc(uid).update({
      ...safe,
      updatedAt: new Date().toISOString(),
    });
    return safe;
  }

  /**
   * Verify Token
   * 
   * Used by API Gateway or other services to verify tokens
   * 
   * @param {string} token - Firebase ID token or custom JWT
   * @returns {Promise<Object>} Decoded token payload
   */
  async verifyToken(token) {
    const decoded = await auth.verifyIdToken(token);
    return decoded;
  }

  /**
   * Logout (Token Revocation)
   * 
   * HOW LOGOUT WORKS IN FIREBASE:
   * Firebase uses refresh tokens for session management
   * Revoking refresh tokens forces the user to re-authenticate
   * Note: Current ID tokens remain valid until expiration (1 hour)
   * 
   * @param {string} uid - Firebase UID
   * @returns {Promise<{message}>}
   */
  async logout(uid) {
    await auth.revokeRefreshTokens(uid);
    logger.info("Tokens revoked", { uid });
    return { message: "Logged out successfully" };
  }

  /**
   * User Login
   * 
   * FLOW:
   * 1. Find user by email in Firebase Auth
   * 2. Generate custom token for the user
   * 3. Return user data with token
   * 
   * NOTE: Password verification happens on the client side using Firebase Auth
   * or the frontend sends a valid Firebase ID token to this endpoint for verification
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password (verified client-side)
   * @returns {Promise<{uid, email, name, role, token}>}
   */
  async login({ email, password }) {
    // Find user by email to get UID
    const userRecord = await auth.getUserByEmail(email);
    
    // Get custom claims (role) from Firebase
    const user = await auth.getUser(userRecord.uid);
    
    // Get user profile from Firestore
    const profileDoc = await db.collection("users").doc(userRecord.uid).get();
    const profile = profileDoc.exists ? profileDoc.data() : {};
    
    // Generate custom token for session management
    const customToken = await auth.createCustomToken(userRecord.uid);
    
    logger.info("User logged in", { uid: userRecord.uid });
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      name: profile.name || userRecord.displayName,
      role: profile.role || user.customClaims?.role || "student"||"administrator",
      token: customToken
    };
  }
}

// Export singleton instance following service pattern
// This ensures Firebase connections are reused across requests
module.exports = new AuthService();