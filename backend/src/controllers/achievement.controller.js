const achievementService = require("../services/achievement.service");

const listar = async (req, res) => {
  try {
    const logros = await achievementService.listarLogrosDelUsuario(req.user.id);
    res.json(logros);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar las insignias" });
  }
};

module.exports = { listar };