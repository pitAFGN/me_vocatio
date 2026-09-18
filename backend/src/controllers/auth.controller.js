const authService = require("../services/auth.service");
const { verifyRefreshToken, generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const achievementService = require("../services/achievement.service");
const { setAuthCookies, clearAuthCookies, getAuthCookies, SESSION_COOKIE } = require("../utils/authCookies");
const { getRefreshToken, storeRefreshToken, deleteRefreshToken } = require("../utils/sessionStore");

/* ─────────────────────────────────────────
   REGISTER
───────────────────────────────────────── */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const usuario = await authService.register(name, email, password);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
const login = async (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios: email, password" });
  }

  try {
    const resultado = await authService.login(email, password);
    const sessionId = setAuthCookies(res, resultado.accessToken);
    await storeRefreshToken(sessionId, resultado.refreshToken, resultado.user.id);
    res.json({ user: resultado.user });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   REFRESH TOKEN
───────────────────────────────────────── */
const refreshToken = async (req, res) => {
  const { [SESSION_COOKIE]: sessionId } = getAuthCookies(req);

  try {
    const refreshToken = sessionId ? await getRefreshToken(sessionId) : null;

    if (!refreshToken || !sessionId) {
      return res.status(400).json({ error: "La sesión no tiene refresh token válido" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    // Rotación del refresh token: cada renovación emite un refresh token nuevo
    // y desecha el anterior (el que quedó guardado en BD deja de servir).
    const newRefreshToken = generateRefreshToken({ id: decoded.id, role: decoded.role });
    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });

    await storeRefreshToken(sessionId, newRefreshToken, decoded.id);
    setAuthCookies(res, newAccessToken, sessionId);
    res.json({ message: "Sesión renovada" });
  } catch (error) {
    if (sessionId) {
      try {
        await deleteRefreshToken(sessionId);
      } catch (dbErr) {
        console.error("Error al borrar el refresh token:", dbErr);
      }
    }
    res.status(403).json({ error: "Refresh Token inválido, expirado o error interno" });
  }
};

const me = async (req, res) => {
  try {
    const pool = require("../config/db");
    const streakService = require("../services/streak.service");
    
    // Check and update streak + daily login XP
    await streakService.checkAndUpdateStreak(req.user.id);

    const result = await pool.query("SELECT id, name, email, plan, xp, level, current_streak, role, created_at FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};

const actualizarNombre = async (req, res) => {
  try {
    const usuario = await authService.actualizarNombre(req.user.id, req.body.name);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ user: usuario });
  } catch (error) {
    console.error("Error actualizando nombre:", error);
    res.status(500).json({ error: "No se pudo actualizar el nombre" });
  }
};

const logout = async (req, res) => {
  const { [SESSION_COOKIE]: sessionId } = getAuthCookies(req);

  try {
    if (sessionId) {
      await deleteRefreshToken(sessionId);
    }
  } catch (error) {
    console.error("Error al borrar sesión durante logout:", error);
  } finally {
    clearAuthCookies(res);
    res.json({ message: "Sesión cerrada" });
  }
};

/* ─────────────────────────────────────────
   FORGOT PASSWORD
───────────────────────────────────────── */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El campo email es obligatorio" });
  }

  try {
    await authService.forgotPassword(email);
    res.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   RESET PASSWORD
───────────────────────────────────────── */
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Faltan campos obligatorios: token, newPassword" });
  }

  try {
    await authService.resetPassword(token, newPassword);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   VERIFY EMAIL (Magic Link)
───────────────────────────────────────── */
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Falta el parámetro obligatorio: token" });
  }

  try {
    const resultado = await authService.verifyEmail(token);
    const isNew = await achievementService.registrarVerificacionCorreo(resultado.userId);
    
    res.json({
      message: "Correo verificado exitosamente. Ya puedes iniciar sesión.",
      email: resultado.email,
      newAchievements: isNew ? ["email_verified"] : []
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   RESEND VERIFICATION
───────────────────────────────────────── */
const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El campo email es obligatorio" });
  }

  try {
    await authService.resendVerification(email);
    res.json({ message: "Correo de verificación reenviado" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  me,
  actualizarNombre,
  logout,
};