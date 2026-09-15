const pool = require("../config/db");

const checkDailyLimit = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT daily_ai_requests, last_ai_request_date, plan 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let { daily_ai_requests, last_ai_request_date, plan } = rows[0];

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastRequest = last_ai_request_date
      ? new Date(last_ai_request_date).toISOString().split("T")[0]
      : null;

    // Reiniciar si es un nuevo día
    if (lastRequest !== today) {
      daily_ai_requests = 0;
      await pool.query(
        `UPDATE users SET daily_ai_requests = 0, last_ai_request_date = CURRENT_DATE WHERE id = $1`,
        [userId]
      );
    }

    // Definir límite según el plan (Premium sin límite o con límite muy alto)
    const limit = plan === "premium" ? 100 : 5;

    if (daily_ai_requests >= limit) {
      return res.status(429).json({
        error: `Has alcanzado el límite diario de ${limit} generaciones por hoy. ¡Vuelve mañana o actualiza tu plan!`
      });
    }

    // Pasamos el control al controlador. 
    // El controlador es responsable de llamar a incrementDailyLimit si la petición a la IA es exitosa.
    next();
  } catch (error) {
    console.error("Error validando límite diario:", error);
    return res.status(500).json({ error: "Error validando los límites de uso." });
  }
};

const incrementDailyLimit = async (userId) => {
  try {
    await pool.query(
      `UPDATE users 
       SET daily_ai_requests = daily_ai_requests + 1, last_ai_request_date = CURRENT_DATE 
       WHERE id = $1`,
      [userId]
    );
  } catch (error) {
    console.error("Error al incrementar límite diario:", error);
  }
};

module.exports = {
  checkDailyLimit,
  incrementDailyLimit,
};

