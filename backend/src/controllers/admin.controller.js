const pool = require("../config/db");

const getStats = async (req, res) => {
  try {
    const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users");
    const premiumUsersResult = await pool.query("SELECT COUNT(*) FROM users WHERE plan = 'premium'");
    const verifiedUsersResult = await pool.query("SELECT COUNT(*) FROM users WHERE email_verified = true");

    const stats = {
      totalUsers: parseInt(totalUsersResult.rows[0].count, 10),
      premiumUsers: parseInt(premiumUsersResult.rows[0].count, 10),
      verifiedUsers: parseInt(verifiedUsersResult.rows[0].count, 10),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getStats,
};
