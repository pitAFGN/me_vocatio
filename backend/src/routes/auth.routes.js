const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { loginLimiter, registerLimiter, forgotPasswordLimiter } = require("../middlewares/rateLimiter");
const {
  reglasRegister,
  reglasLogin,
  reglasForgotPassword,
  reglasResetPassword,
} = require("../middlewares/validarInputs");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Juan Pérez" }
 *               email: { type: string, example: "juan@email.com" }
 *               password: { type: string, example: "segura12" }
 *     responses:
 *       201: { description: Usuario creado exitosamente }
 *       400: { description: Datos inválidos o contraseña débil }
 *       409: { description: El correo ya está registrado }
 *       429: { description: Demasiados registros, intenta más tarde }
 */
router.post("/register", registerLimiter, reglasRegister, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "juan@email.com" }
 *               password: { type: string, example: "segura12" }
 *     responses:
 *       200: { description: Login exitoso, retorna token JWT }
 *       400: { description: Datos inválidos }
 *       401: { description: Credenciales inválidas }
 *       429: { description: Demasiados intentos, intenta en 15 minutos }
 */
router.post("/login", loginLimiter, reglasLogin, authController.login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Envía correo de recuperación de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "juan@email.com" }
 *     responses:
 *       200: { description: Correo de recuperación enviado }
 *       400: { description: Email inválido }
 *       404: { description: El correo no está registrado }
 *       429: { description: Demasiadas solicitudes }
 */
router.post("/forgot-password", forgotPasswordLimiter, reglasForgotPassword, authController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Cambia la contraseña usando el token enviado por correo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string, example: "nueva12" }
 *     responses:
 *       200: { description: Contraseña actualizada }
 *       400: { description: Token inválido, expirado o contraseña débil }
 */
router.post("/reset-password", reglasResetPassword, authController.resetPassword);

module.exports = router;