const authService = require("../services/auth.service");
const { verifyRefreshToken, generateAccessToken } = require("../utils/jwt");
const achievementService = require("../services/achievement.service");
const { setAuthCookies, clearAuthCookies, getAuthCookies, REFRESH_COOKIE } = require("../utils/authCookies");

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
    setAuthCookies(res, resultado.accessToken, resultado.refreshToken);
    res.json({ user: resultado.user });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
  }
};

/* ─────────────────────────────────────────
   REFRESH TOKEN
───────────────────────────────────────── */
const refreshToken = async (req, res) => {
  const { [REFRESH_COOKIE]: refreshToken } = getAuthCookies(req);

  if (!refreshToken) {
    return res.status(400).json({ error: "El campo refreshToken es obligatorio" });
  }

  try {
    // 1. Verificamos la firma y expiración del Refresh Token
    const decoded = verifyRefreshToken(refreshToken);

    // 2. Opcional: Podrías validar en el servicio que el usuario siga existiendo o esté activo
    // await authService.validateUserActive(decoded.id);

    // 3. Generamos un nuevo Access Token fresco de 15 min
    const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email, role: decoded.role });

    setAuthCookies(res, newAccessToken, refreshToken);
    res.json({ message: "Sesión renovada" });
  } catch (error) {
    res.status(403).json({ error: "Refresh Token inválido o expirado" });
  }
};

const me = (req, res) => {
  res.json({ user: req.user });
};

const logout = (req, res) => {
  clearAuthCookies(res);
  res.json({ message: "Sesión cerrada" });
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
    await achievementService.registrarVerificacionCorreo(resultado.userId);
    res.json({
      message: "Correo verificado exitosamente. Ya puedes iniciar sesión.",
      email: resultado.email,
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
  logout,
};