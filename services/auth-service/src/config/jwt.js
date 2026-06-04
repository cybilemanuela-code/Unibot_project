module.exports = {
  secret: process.env.JWT_SECRET || "mySuperSecretKey123",
  expiresIn: "1d",
  algorithm: "HS256"
};