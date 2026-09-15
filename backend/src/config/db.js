const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },

  // Evitan que una conexión "zombi" (socket muerto tras una desconexión
  // previa con Neon) deje una consulta esperando para siempre sin error.
  connectionTimeoutMillis: 10000, // máximo para establecer una conexión nueva
  query_timeout: 15000,           // máximo para que una consulta responda
  statement_timeout: 15000,       // límite del lado de Postgres para la misma consulta
  idleTimeoutMillis: 30000,       // recicla conexiones inactivas en vez de dejarlas envejecer
  keepAlive: true,                // detecta más rápido si el socket TCP murió
});

pool.on("error", (err) => {
  console.error("⚠️ Error inesperado en un cliente inactivo del pool de PostgreSQL:", err.message);
});

module.exports = pool;
