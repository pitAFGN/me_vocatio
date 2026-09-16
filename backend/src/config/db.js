const { Pool } = require("pg");
require("dotenv").config();

/**
 * Deriva la configuración SSL de la connection string.
 * - URL local o con sslmode=disable  -> sin SSL.
 * - sslmode=require/verify-ca/full   -> SSL con validación de certificado.
 * - Overrides explícitos via env:    DB_SSL, DB_SSL_REJECT_UNAUTHORIZED.
 */
const resolverSSL = (connectionString) => {
  if (process.env.DB_SSL !== undefined && process.env.DB_SSL !== "") {
    return process.env.DB_SSL === "true"
      ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" }
      : false;
  }

  const sslMode = (connectionString || "").match(/sslmode=([a-z-]+)/i);
  const mode = sslMode ? sslMode[1].toLowerCase() : "";

  if (mode && mode !== "disable" && mode !== "prefer") {
    return { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" };
  }
  return false;
};

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: resolverSSL(connectionString),

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
