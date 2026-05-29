"use strict";

// Set required env vars before loading app modules
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb";
process.env.JWT_SECRET = "test-jwt-secret-min-32-chars-long-enough";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-min-32-chars-ok";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.EXTERNAL_API_BASE_URL = "https://api.example.com";
process.env.EXTERNAL_API_KEY = "test-api-key";
process.env.SMTP_HOST = "smtp.example.com";
process.env.SMTP_USER = "test@example.com";
process.env.SMTP_PASSWORD = "test-password";
process.env.CORS_ALLOWED_ORIGINS = "http://localhost:3000";

const request = require("supertest");
const app = require("../app");

describe("GET /health", () => {
  it("returns 200 and status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /auth/token", () => {
  it("issues JWT tokens", async () => {
    const res = await request(app)
      .post("/auth/token")
      .send({ sub: "test-user", role: "user" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("access");
    expect(res.body).toHaveProperty("refresh");
  });
});

describe("GET /items", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(401);
  });
});
