const pool = require("../config/db");
const xpService = require("./xp.service");

const checkAndUpdateStreak = async (userId) => {
  const result = await pool.query(
    "SELECT current_streak, last_login FROM users WHERE id = $1", 
    [userId]
  );
  if (result.rowCount === 0) return null;

  const { current_streak, last_login } = result.rows[0];
  const now = new Date();
  
  // Normalizar a fechas locales (o UTC según el proyecto, aquí asumimos Date local)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let newStreak = current_streak || 0;
  let gaveDailyReward = false;

  if (last_login) {
    const last = new Date(last_login);
    const lastLoginDate = new Date(last.getFullYear(), last.getMonth(), last.getDate());

    const diffTime = today - lastLoginDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Entró al día siguiente consecutivo
      newStreak += 1;
      gaveDailyReward = true;
    } else if (diffDays > 1) {
      // Perdió la racha
      newStreak = 1;
      gaveDailyReward = true;
    } else if (diffDays === 0 && newStreak === 0) {
      // Primer login real del sistema (tenía 0 pero last_login existía hoy)
      newStreak = 1;
      gaveDailyReward = true;
    }
  } else {
    // Primer login en toda la historia de la cuenta
    newStreak = 1;
    gaveDailyReward = true;
  }

  // Si hubo cambio de día o es el primer login
  if (gaveDailyReward) {
    await pool.query(
      "UPDATE users SET current_streak = $1, last_login = NOW() WHERE id = $2",
      [newStreak, userId]
    );
    // Otorgar 100 XP por inicio de sesión diario
    await xpService.grantXp(userId, xpService.XP_ACTIONS.daily_study);
  } else {
    // Mismo día, solo actualizar la última vez visto
    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1",
      [userId]
    );
  }

  return { current_streak: newStreak, gaveDailyReward };
};

module.exports = {
  checkAndUpdateStreak
};

