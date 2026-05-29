"use strict";

// Load and validate config first — exits immediately if required vars are missing
const config = require("./config");
const app = require("./app");

const port = config.port;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(
    JSON.stringify({
      level: "info",
      msg: "server started",
      port,
      env: config.nodeEnv,
      maintenance: config.features.maintenanceMode,
    })
  );
});

// Graceful shutdown — ECS sends SIGTERM before killing the container
process.on("SIGTERM", () => {
  console.log(JSON.stringify({ level: "info", msg: "SIGTERM received, shutting down" }));
  server.close(() => process.exit(0));
});
