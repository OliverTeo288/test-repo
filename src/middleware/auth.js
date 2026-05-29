"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * JWT authentication middleware.
 * Validates the Bearer token in Authorization header.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, config.auth.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Issue a new JWT access + refresh token pair.
 */
function issueTokens(payload) {
  const access = jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  });
  const refresh = jwt.sign(payload, config.auth.jwtRefreshSecret, {
    expiresIn: config.auth.jwtRefreshExpiresIn,
  });
  return { access, refresh };
}

module.exports = { authenticate, issueTokens };
