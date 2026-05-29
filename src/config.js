/**
 * Application configuration.
 *
 * All runtime config is read from environment variables here and nowhere else.
 * Using direct references (not a wrapper function) so that static analysis
 * tools and the APD-Deploy scanner can see every variable name.
 *
 * Missing required vars are validated at the bottom — the process exits
 * immediately rather than failing silently at the first request.
 */

"use strict";

require("dotenv").config();

const config = {
  // ── Server ────────────────────────────────────────────────────────────────
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // ── Database — PostgreSQL ─────────────────────────────────────────────────
  database: {
    url: process.env.DATABASE_URL,
    poolMin: parseInt(process.env.DB_POOL_MIN || "2", 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || "10", 10),
    ssl: process.env.DB_SSL_ENABLED === "true",
  },

  // ── Authentication — JWT ──────────────────────────────────────────────────
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // ── CORS ──────────────────────────────────────────────────────────────────
  cors: {
    // Comma-separated list of allowed origins
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  },

  // ── Redis — caching and session store ─────────────────────────────────────
  redis: {
    url: process.env.REDIS_URL,
    ttlSeconds: parseInt(process.env.REDIS_CACHE_TTL_SECONDS || "300", 10),
  },

  // ── External API integration ──────────────────────────────────────────────
  externalApi: {
    baseUrl: process.env.EXTERNAL_API_BASE_URL,
    apiKey: process.env.EXTERNAL_API_KEY,
    timeoutMs: parseInt(process.env.EXTERNAL_API_TIMEOUT_MS || "5000", 10),
  },

  // ── SMTP / Email ──────────────────────────────────────────────────────────
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromAddress: process.env.EMAIL_FROM_ADDRESS || "noreply@example.com",
  },

  // ── Feature flags ─────────────────────────────────────────────────────────
  features: {
    enableRegistration: process.env.FEATURE_ENABLE_REGISTRATION === "true",
    maintenanceMode: process.env.FEATURE_MAINTENANCE_MODE === "true",
  },

  // ── Observability ─────────────────────────────────────────────────────────
  observability: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.APP_LOG_LEVEL || "info",
  },
};

// ── Startup validation ────────────────────────────────────────────────────────
// Fail fast: exit immediately if required variables are missing.
// This surfaces misconfiguration at container start, not at the first request.

const REQUIRED = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "REDIS_URL",
  "EXTERNAL_API_BASE_URL",
  "EXTERNAL_API_KEY",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(
    JSON.stringify({
      level: "fatal",
      msg: "Missing required environment variables",
      missing,
    })
  );
  process.exit(1);
}

module.exports = config;
