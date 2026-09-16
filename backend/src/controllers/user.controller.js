const pool = require("../config/db");
const xpService = require("../services/xp.service");

const addXp = async (req, res) => {
  const userId = req.user.id;
  const { xpToAdd, action } = req.body;

  let calculatedXp = 0;

  if (action && xpService.XP_ACTIONS[action]) {
    calculatedXp = xpService.XP_ACTIONS[action];
  } else if (typeof xpToAdd === 'number' && xpToAdd > 0) {
    calculatedXp = Math.min(Math.round(xpToAdd), 500);
  } else {
    return res.status(400).json({ 
      error: "Acción o cantidad de XP inválida. Debe ser un número positivo (máximo 500) o una acción válida.",
      validActions: Object.keys(xpService.XP_ACTIONS)
    });
  }

  try {
    const result = await xpService.grantXp(userId, calculatedXp);
    if (!result) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("Error adding XP:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getEvaluations = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (profession_title) id, profession_title, level, created_at 
         FROM evaluations 
         WHERE user_id = $1 
         ORDER BY profession_title, created_at DESC
       ) AS unique_evals
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    res.status(500).json({ error: "Error interno al obtener evaluaciones" });
  }
};

module.exports = {
  addXp,
  getEvaluations
};

