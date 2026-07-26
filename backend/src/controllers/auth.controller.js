const authService = require("../services/auth.service");

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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios: email, password" });
  }

  try {
    const resultado = await authService.login(email, password);
    res.json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno" });
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

module.exports = { register, login, forgotPassword, resetPassword };