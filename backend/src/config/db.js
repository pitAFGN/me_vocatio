const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("⚠️ Error inesperado en un cliente inactivo del pool de PostgreSQL:", err.message);
});

module.exports = pool;
