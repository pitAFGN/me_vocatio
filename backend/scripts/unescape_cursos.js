/**
 * Script único de saneamiento (M8).
 *
 * Los cursos creados mientras validarInputs usaba .escape() guardaron en BD
 * entidades HTML (&amp;, &lt;, &quot;, &#39;, etc.). Este script decodifica esos
 * valores y registra cuántas filas fueron corregidas.
 *
 * Uso (desde backend/):
 *   node scripts/unescape_cursos.js
 *
 * Es idempotente: solo toca las filas que efectivamente contienen entidades.
 */
const pool = require("../src/config/db");

const DECODE_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const decodificar = (valor) => {
  if (typeof valor !== "string") return valor;
  const entrada = String(valor);
  const salida = entrada.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+);/g, (entidad) => {
    if (DECODE_MAP[entidad]) return DECODE_MAP[entidad];
    const m = entidad.match(/^&#(\d+);$/);
    if (m) {
      const code = parseInt(m[1], 10);
      if (code >= 32) return String.fromCodePoint(code);
    }
    return entidad;
  });
  return salida === entrada ? { igual: true, valor: salida } : { igual: false, valor: salida };
};

const CAMPOS = ["title", "description", "category"];

const correr = async () => {
  const cursos = await pool.query("SELECT id, title, description, category FROM courses");
  let corregidos = 0;

  for (const curso of cursos.rows) {
    const updates = {};
    for (const campo of CAMPOS) {
      const r = decodificar(curso[campo]);
      if (!r.igual) updates[campo] = r.valor;
    }

    const claves = Object.keys(updates);
    if (claves.length === 0) continue;

    const setSql = claves.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const parametros = claves.map((c) => updates[c]);

    await pool.query(
      `UPDATE courses SET ${setSql}, updated_at = NOW() WHERE id = $${claves.length + 1}`,
      [...parametros, curso.id]
    );
    corregidos += 1;
    console.log(`→ Curso ${curso.id}: ${claves.join(", ")}`);
  }

  console.log(corregidos === 0
    ? "No se encontraron cursos con entidades HTML que corregir."
    : `Cursos corregidos: ${corregidos}.`);
};

correr()
  .catch((error) => {
    console.error("Error durante el saneamiento:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());