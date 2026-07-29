const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationLimiter,
} = require("../middlewares/rateLimiter");
const {
  reglasRegister,
  reglasLogin,
  reglasForgotPassword,
  reglasResetPassword,
  reglasVerifyEmail,
  reglasResendVerification,
} = require("../middlewares/ValidarInput");

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
 *       201: { description: Usuario creado. Se envía un correo con un magic link para verificar la cuenta }
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
 *       403: { description: El correo aún no ha sido verificado }
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

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verifica el correo electrónico a partir del magic link enviado al registrarse
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema: { type: string }
 *         description: Token recibido en el enlace del correo (64 caracteres hexadecimales)
 *     responses:
 *       200: { description: Correo verificado exitosamente }
 *       400: { description: Token inválido, expirado, ya usado o correo ya verificado }
 *       429: { description: Demasiados intentos, intenta en 15 minutos }
 */
router.get("/verify-email", verifyEmailLimiter, reglasVerifyEmail, authController.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Reenvía el magic link de verificación de correo (invalida el anterior)
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
 *       200: { description: Correo de verificación reenviado }
 *       400: { description: Email inválido o el correo ya está verificado }
 *       404: { description: El correo no está registrado }
 *       429: { description: Demasiadas solicitudes }
 */
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  reglasResendVerification,
  authController.resendVerification
);

module.exports = router;