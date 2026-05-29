"use strict";

const { Router } = require("express");
const { Pool } = require("pg");
const config = require("../config");
const { authenticate } = require("../middleware/auth");

const router = Router();

// Lazy-initialised connection pool — created on first request, not at import
let _pool = null;
function getPool() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: config.database.url,
      ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
      min: config.database.poolMin,
      max: config.database.poolMax,
    });
  }
  return _pool;
}

// GET /items — list all items (auth required)
router.get("/", authenticate, async (req, res) => {
  try {
    const { rows } = await getPool().query(
      "SELECT id, name, description, created_at FROM items ORDER BY created_at DESC LIMIT 50"
    );
    res.json({ items: rows });
  } catch (err) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// GET /items/:id
router.get("/:id", authenticate, async (req, res) => {
  const { rows } = await getPool().query("SELECT * FROM items WHERE id = $1", [
    req.params.id,
  ]);
  if (!rows.length) return res.status(404).json({ error: "Item not found" });
  res.json(rows[0]);
});

// POST /items
router.post("/", authenticate, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(422).json({ error: "name is required" });

  const { rows } = await getPool().query(
    "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
    [name, description || null]
  );
  res.status(201).json(rows[0]);
});

module.exports = router;
