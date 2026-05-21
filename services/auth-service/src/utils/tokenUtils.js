const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(
    { uid: payload.uid, email: payload.email, role: payload.role, name: payload.name },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }  // algorithm defaults to HS256 — correct
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, "HS256");
};

module.exports = {
  generateToken,
  verifyToken
};