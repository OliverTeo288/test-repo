"use strict";

const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// ── Build-time variables ─────────────────────────────────────────────────────
// Written into /app/build-info.json by the Dockerfile during `docker build`.
// These are baked into the image — they do NOT change when the container restarts.
let buildInfo = { version: "dev", buildDate: "unknown", gitCommit: "unknown" };
try {
  buildInfo = JSON.parse(fs.readFileSync("/app/build-info.json", "utf8"));
} catch {
  // Running locally without a Docker build — fall back to defaults above.
}

// ── Runtime variables ────────────────────────────────────────────────────────
// Injected by the platform at container start time (APD-Deploy Config tab).
// These can be changed between deploys without rebuilding the image.
const runtime = {
  APP_GREETING: process.env.APP_GREETING || "(not set)",
  APP_NAME: process.env.APP_NAME || "(not set)",
  APP_COLOR: process.env.APP_COLOR || "(not set)",
};

// ── Routes ───────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.json({
    message: `${runtime.APP_GREETING}, ${runtime.APP_NAME}!`,
    buildTime: {
      description: "Baked into the image at docker build time — fixed until next build",
      vars: buildInfo,
    },
    runtime: {
      description: "Injected by the platform at container start — change in Config tab, then redeploy",
      vars: runtime,
    },
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ msg: "started", port, buildInfo }));

  // Emit a heartbeat log every 60 seconds — useful for testing log streaming.
  setInterval(() => {
    console.log(JSON.stringify({ msg: "heartbeat", timestamp: new Date().toISOString() }));
  }, 60_000);
});
