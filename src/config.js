/**
 * Application configuration.
 *
 * All runtime config is read from environment variables here and nowhere else.
 * This is the single source of truth — the APD-Deploy scanner reads this file
 * to extract the env var names used by the app.
 *
 * Missing required vars throw at startup so the container exits immediately
 * rather than failing silently at the first request.
 */

"use strict";

require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optional(name, fallback = undefined) {
  return process.env[name] || fallback;
}

// ---------------------------------------------------------------------------
// Runtime environment variables
// ---------------------------------------------------------------------------

module.exports = {
  // Server
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Database — PostgreSQL
  database: {
    url: required("DATABASE_URL"),
    poolMin: parseInt(optional("DB_POOL_MIN", "2"), 10),
    poolMax: parseInt(optional("DB_POOL_MAX", "10"), 10),
    ssl: process.env.DB_SSL_ENABLED === "true",
  },

  // Authentication — JWT
  auth: {
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: optional("JWT_EXPIRES_IN", "1h"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
    jwtRefreshExpiresIn: optional("JWT_REFRESH_EXPIRES_IN", "7d"),
  },

  // CORS
  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  },

  // Redis — caching and session store
  redis: {
    url: required("REDIS_URL"),
    ttlSeconds: parseInt(optional("REDIS_CACHE_TTL_SECONDS", "300"), 10),
  },

  // External API integration
  externalApi: {
    baseUrl: required("EXTERNAL_API_BASE_URL"),
    apiKey: required("EXTERNAL_API_KEY"),
    timeoutMs: parseInt(optional("EXTERNAL_API_TIMEOUT_MS", "5000"), 10),
  },

  // Email (SMTP)
  email: {
    host: required("SMTP_HOST"),
    port: parseInt(optional("SMTP_PORT", "587"), 10),
    user: required("SMTP_USER"),
    password: required("SMTP_PASSWORD"),
    fromAddress: optional("EMAIL_FROM_ADDRESS", "noreply@example.com"),
  },

  // Feature flags
  features: {
    enableRegistration: process.env.FEATURE_ENABLE_REGISTRATION === "true",
    maintenanceMode: process.env.FEATURE_MAINTENANCE_MODE === "true",
  },

  // Observability
  observability: {
    sentryDsn: optional("SENTRY_DSN"),
    logLevel: optional("APP_LOG_LEVEL", "info"),
  },
};
