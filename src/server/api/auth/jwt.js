/** @file Exports JWT sign and verify functions */

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is set in .env
if (!JWT_SECRET) {
  console.error("JWT_SECRET not set in .env");
  process.exit(1);
}

/** @returns token from payload */
const sign = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

/** @returns payload from token */
const verify = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { sign, verify };
