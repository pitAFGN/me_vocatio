const pool = require("../config/db");

const registrarLogro = async (userId, code) => {
  const result = await pool.query(
    `INSERT INTO user_achievements (user_id, achievement_id, progress)
     SELECT $1, id, COALESCE(requirement_value, 1)
     FROM achievements
     WHERE code = $2 AND active = true
     ON CONFLICT (user_id, achievement_id) DO NOTHING
     RETURNING id`,
    [userId, code]
  );
  return result.rowCount > 0;
};

const incrementarProgreso = async (userId, field, amount = 1) => {
  const allowedFields = new Set([
    "resources_created",
    "diagnostics_completed",
    "professions_viewed",
    "resources_viewed",
    "saved_professions",
  ]);
  if (!allowedFields.has(field)) throw new Error("Tipo de progreso no permitido");

  await pool.query(
    `INSERT INTO user_progress (user_id, ${field}) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET ${field} = user_progress.${field} + $2, updated_at = NOW()`,
    [userId, amount]
  );
};

const evaluarLogros = async (userId) => {
  const progressResult = await pool.query(
    `SELECT resources_created, diagnostics_completed, professions_viewed
     FROM user_progress WHERE user_id = $1`,
    [userId]
  );
  const progress = progressResult.rows[0];
  if (!progress) return [];

  const unlocked = [];
  const rules = [
    ["first_resource", progress.resources_created >= 1],
    ["first_diagnostic", progress.diagnostics_completed >= 1],
    ["explorer", progress.professions_viewed >= 3],
  ];
  for (const [code, condition] of rules) {
    if (condition && await registrarLogro(userId, code)) unlocked.push(code);
  }
  return unlocked;
};

const listarLogrosDelUsuario = async (userId) => {
  const result = await pool.query(
    `SELECT a.code, a.name, a.description, a.icon, a.category,
            a.requirement_type, a.requirement_value,
            ua.earned_at, COALESCE(ua.progress, 0) AS earned_progress,
            CASE WHEN ua.id IS NULL THEN false ELSE true END AS earned
     FROM achievements a
     LEFT JOIN user_achievements ua
       ON ua.achievement_id = a.id AND ua.user_id = $1
     WHERE a.active = true
     ORDER BY earned DESC, a.id`,
    [userId]
  );
  return result.rows;
};

const registrarVerificacionCorreo = async (userId) => registrarLogro(userId, "email_verified");
const registrarCompraPremium = async (userId) => registrarLogro(userId, "premium_member");

const evaluarLogrosDeNivel = async (userId, level) => {
  const unlocked = [];
  const levelRules = [
    ["level_5", level >= 5],
    ["level_10", level >= 10],
    ["level_25", level >= 25],
    ["level_50", level >= 50],
  ];

  for (const [code, condition] of levelRules) {
    if (condition && (await registrarLogro(userId, code))) {
      unlocked.push(code);
    }
  }
  return unlocked;
};

module.exports = {
  registrarLogro,
  incrementarProgreso,
  evaluarLogros,
  evaluarLogrosDeNivel,
  listarLogrosDelUsuario,
  registrarVerificacionCorreo,
  registrarCompraPremium,
};
