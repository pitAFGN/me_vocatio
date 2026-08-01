/**
 * Ejecuta la migración de verificación de correo directamente desde Node,
 * usando la misma conexión (pool) que ya tiene configurado el backend.
 *
 * Uso (desde la carpeta backend/):
 *   node sql/run-migration.js
 *
 * No requiere instalar psql ni ninguna herramienta adicional: reutiliza
 * el paquete "pg" que ya está en package.json.
 */
const fs = require("fs");
const path = require("path");
const pool = require("../src/config/db");

const run = async () => {
  const sqlPath = path.join(__dirname, "001_add_email_verification.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Ejecutando migración: 001_add_email_verification.sql ...");

  try {
    await pool.query(sql);
    console.log("✅ Migración aplicada correctamente.");
  } catch (error) {
    console.error("❌ Error ejecutando la migración:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
