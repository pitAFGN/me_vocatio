const pool = require("../config/db");
const achievementService = require("../services/achievement.service");

// Helpers de progresión progresiva (+200 XP por cada nivel adicional)
const BASE_XP = 1000;
const INCREMENT_PER_LEVEL = 200;

const getXpNeededForLevel = (lvl) => BASE_XP + (lvl - 1) * INCREMENT_PER_LEVEL;

const getCumulativeXpForLevel = (lvl) => {
  let total = 0;
  for (let i = 1; i < lvl; i++) {
    total += getXpNeededForLevel(i);
  }
  return total;
};

const addXp = async (req, res) => {
  const userId = req.user.id;
  const { xpToAdd } = req.body;

  if (!xpToAdd || typeof xpToAdd !== 'number' || xpToAdd <= 0) {
    return res.status(400).json({ error: "Cantidad de XP inválida" });
  }

  try {
    // 1. Obtener usuario actual
    const userResult = await pool.query("SELECT xp, level FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const { xp, level } = userResult.rows[0];
    
    // 2. Sumar XP
    const newXp = (xp || 0) + xpToAdd;
    let newLevel = level || 1;
    let leveledUp = false;

    // 3. Calcular si subió de nivel de forma progresiva
    while (newXp >= getCumulativeXpForLevel(newLevel + 1)) {
      newLevel += 1;
      leveledUp = true;
    }

    // 4. Actualizar BD
    await pool.query(
      "UPDATE users SET xp = $1, level = $2 WHERE id = $3",
      [newXp, newLevel, userId]
    );

    // 5. Evaluar si desbloqueó insignias de nivel
    const unlockedAchievements = await achievementService.evaluarLogrosDeNivel(userId, newLevel);

    res.json({
      success: true,
      leveledUp,
      xp: newXp,
      level: newLevel,
      xpAdded: xpToAdd,
      nextLevelXp: getCumulativeXpForLevel(newLevel + 1),
      xpNeededForCurrentLevel: getXpNeededForLevel(newLevel),
      unlockedAchievements
    });

  } catch (error) {
    console.error("Error adding XP:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  addXp
};

