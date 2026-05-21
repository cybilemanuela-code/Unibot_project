/**
 * JWT Configuration
 *
 * WHY THIS FILE EXISTS:
 * While Firebase provides its own JWT tokens, we also support custom JWTs for:
 * 1. Stateless authentication between microservices
 * 2. API-to-API communication without Firebase round-trips
 * 3. Session management with custom expiration times
 *
 * HOW JWT WORKS INTERNALLY:
 * - Header: Algorithm (HS256) and token type (JWT)
 * - Payload: User data (uid, role, email) + standard claims (iat, exp)
 * - Signature: Encrypted hash proving authenticity using secret key
 *
 * JWT vs Firebase ID Tokens:
 * - Firebase ID tokens: 1 hour expiration, managed by Firebase
 * - Custom JWTs: Configurable expiration, useful for longer sessions
 *
 * SECURITY CONSIDERATIONS:
 * - JWT_SECRET must be a long, random string (32+ characters)
 * - In production, use environment-specific secrets
 * - Tokens should be stored securely (httpOnly cookies preferred over localStorage)
 */

module.exports = {
  secret: process.env.JWT_SECRET || "mySuperSecretKey123",
  expiresIn: "1d",
  algorithm: "HS256"
};