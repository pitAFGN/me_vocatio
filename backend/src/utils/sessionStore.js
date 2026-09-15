const pool = require("../config/db");

const STORE_TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Guarda el refresh token de una sesión en PostgreSQL.
 *
 * @param {string} sessionId UUID de la cookie de sesión.
 * @param {string} refreshToken Token JWT de refresco.
 * @param {string} [userId] Id del usuario al que pertenece la sesión.
 */
const storeRefreshToken = async (sessionId, refreshToken, userId = null) => {
  if (!sessionId || !refreshToken) {
    return null;
  }

  await pool.query(
    `INSERT INTO sessions (id, user_id, refresh_token, expires_at)
     VALUES ($1, $2, $3, NOW() + make_interval(secs => $4))
     ON CONFLICT (id) DO UPDATE
       SET refresh_token = EXCLUDED.refresh_token,
           expires_at = EXCLUDED.expires_at`,
    [sessionId, userId, refreshToken, STORE_TTL_SECONDS]
  );

  return sessionId;
};

/**
 * Recupera el refresh token de una sesión. Si la sesión expiró,
 * la limpia de la BD y devuelve null.
 */
const getRefreshToken = async (sessionId) => {
  if (!sessionId) {
    return null;
  }

  const resultado = await pool.query(
    `SELECT refresh_token, expires_at FROM sessions WHERE id = $1`,
    [sessionId]
  );

  if (resultado.rows.length === 0) {
    return null;
  }

  const entry = resultado.rows[0];

  if (new Date(entry.expires_at) <= new Date()) {
    await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
    return null;
  }

  return entry.refresh_token;
};

const deleteRefreshToken = async (sessionId) => {
  if (!sessionId) return;

  await pool.query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
};

const clearExpiredSessions = async () => {
  const resultado = await pool.query(`DELETE FROM sessions WHERE expires_at <= NOW()`);
  return resultado.rowCount;
};

// Barrido periódico (no bloquea la salida del proceso) para no acumular
// sesiones vencidas en la tabla.
const interval = setInterval(() => {
  clearExpiredSessions().catch((err) => {
    console.error("Error limpiando sesiones expiradas:", err.message);
  });
}, 60 * 60 * 1000);
interval.unref();

module.exports = {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  clearExpiredSessions,
};