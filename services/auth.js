const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "supersecret";

function createTokenForUser(user) {
  const payload = { _id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function validateToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

module.exports = { createTokenForUser, validateToken };
