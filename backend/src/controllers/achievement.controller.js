const pool = require("../config/db");
const achievementService = require("../services/achievement.service");

const listar = async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT plan FROM users WHERE id = $1",
      [req.user.id]
    );
    if (userResult.rows.length > 0 && userResult.rows[0].plan === "premium") {
      await achievementService.registrarCompraPremium(req.user.id);
    }

    const logros = await achievementService.listarLogrosDelUsuario(req.user.id);
    res.json(logros);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar las insignias" });
  }
};

module.exports = { listar };