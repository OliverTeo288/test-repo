"use strict";

const express = require("express");
const cors = require("cors");
const config = require("./config");
const itemsRouter = require("./routes/items");
const { issueTokens } = require("./middleware/auth");

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

app.use(express.json());
app.use(
  cors({
    origin: config.cors.allowedOrigins.length
      ? config.cors.allowedOrigins
      : "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check — no auth, used by ALB health checks
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    env: config.nodeEnv,
    maintenance: config.features.maintenanceMode,
  });
});

// Auth — issue demo token (real apps would verify credentials here)
app.post("/auth/token", (req, res) => {
  const { sub = "demo-user", role = "user" } = req.body;
  const tokens = issueTokens({ sub, role });
  res.json(tokens);
});

// Resource routes
app.use("/items", itemsRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, _next) => {
  const level = config.observability.logLevel;
  if (level === "debug" || level === "info") {
    console.error(err);
  }
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
