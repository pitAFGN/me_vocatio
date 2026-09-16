const pool = require("../config/db");
const achievementService = require("./achievement.service");

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

// Tabla de recompensas de XP controladas por el servidor
const XP_ACTIONS = {
  daily_study: 100,
  resource_completed: 150,
  quiz_completed: 250,
  course_started: 100,
  course_completed: 500,
  simulation_test: 250,
};

const grantXp = async (userId, calculatedXp) => {
  // 1. Obtener usuario actual
  const userResult = await pool.query("SELECT xp, level FROM users WHERE id = $1", [userId]);
  if (userResult.rows.length === 0) return null;

  const { xp, level } = userResult.rows[0];
  
  // 2. Sumar XP
  const newXp = (xp || 0) + calculatedXp;
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
  const unlockedAchievements = leveledUp ? await achievementService.evaluarLogrosDeNivel(userId, newLevel) : [];

  return {
    leveledUp,
    xp: newXp,
    level: newLevel,
    xpAdded: calculatedXp,
    nextLevelXp: getCumulativeXpForLevel(newLevel + 1),
    xpNeededForCurrentLevel: getXpNeededForLevel(newLevel),
    unlockedAchievements
  };
};

module.exports = {
  XP_ACTIONS,
  grantXp,
  getCumulativeXpForLevel,
  getXpNeededForLevel
};

