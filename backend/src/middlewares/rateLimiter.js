const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

/**
 * Rate limiting por ruta.
 * Evita ataques de fuerza bruta limitando intentos por IP.
 *
 * ⚠️ IMPORTANTE: los preflight OPTIONS se excluyen con `skip`.
 * Sin esto, cada intento de login cross-origin (Vercel → Railway)
 * consume 2 requests (OPTIONS + POST), duplicando el consumo
 * y bloqueando al usuario después de la mitad de intentos.
 */

// Excluye preflight OPTIONS de todos los contadores
const skipOptions = (req) => req.method === "OPTIONS";

// Clave por IP normalizada (maneja IPv4 e IPv6 correctamente)
const ipKey = (req) => (req.ip ? ipKeyGenerator(req.ip) : "ip:none");

// Clave por usuario autenticado cuando existe; si no, por IP.
const userOrIpKeyGenerator = (req) => {
  if (req.user && req.user.id) return `u:${req.user.id}`;
  return ipKey(req);
};

// Clave por email (normalizado) enviado en el body.
const emailKeyGenerator = (req) => {
  const email = req.body && typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  if (email) return `e:${email}`;
  return ipKey(req);
};

// Login: máximo 5 intentos cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: ipKey, // ← explícito para evitar problemas con trust proxy
  message: {
    error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.",
  },
});

// Register: máximo 5 cuentas por IP cada hora
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: ipKey,
  message: {
    error: "Demasiados registros desde esta IP. Intenta de nuevo en 1 hora.",
  },
});

// Register por email: máximo 3 intentos por email cada hora (anti-enumeración)
const registerEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: emailKeyGenerator,
  message: {
    error: "Demasiados intentos para este correo. Intenta de nuevo en 1 hora.",
  },
});

// Forgot password: máximo 3 solicitudes cada 15 minutos
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: ipKey,
  message: {
    error: "Demasiadas solicitudes de recuperación. Intenta de nuevo en 15 minutos.",
  },
});

// Forgot password por email: máximo 2 solicitudes por email cada 15 minutos
const forgotPasswordEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: emailKeyGenerator,
  message: {
    error: "Demasiadas solicitudes para este correo. Intenta de nuevo en 15 minutos.",
  },
});

// Verify email: máximo 10 intentos cada 15 minutos
const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: ipKey,
  message: {
    error: "Demasiados intentos de verificación. Intenta de nuevo en 15 minutos.",
  },
});

// Resend verification: máximo 3 reenvíos cada 15 minutos
const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: ipKey,
  message: {
    error: "Demasiadas solicitudes de reenvío. Intenta de nuevo en 15 minutos.",
  },
});

// Resend verification por email: máximo 2 reenvíos por email cada 15 minutos
const resendVerificationEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: emailKeyGenerator,
  message: {
    error: "Demasiados reenvíos para este correo. Intenta de nuevo en 15 minutos.",
  },
});

// AI Generation & Analysis: máximo 10 peticiones cada 5 minutos.
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: userOrIpKeyGenerator,
  message: {
    error: "Demasiadas consultas de Inteligencia Artificial. Por favor espera unos minutos.",
  },
});

// Recomendaciones: máximo 15 peticiones cada 5 minutos
const recommendationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: userOrIpKeyGenerator,
  message: {
    error: "Has alcanzado el límite de recomendaciones por ahora. Intenta de nuevo en 5 minutos.",
  },
});

// Acciones de XP: máximo 10 por 5 minutos
const xpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: userOrIpKeyGenerator,
  message: {
    error: "Demasiadas solicitudes de experiencia. Por favor espera unos minutos.",
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
  registerEmailLimiter,
  forgotPasswordLimiter,
  forgotPasswordEmailLimiter,
  verifyEmailLimiter,
  resendVerificationLimiter,
  resendVerificationEmailLimiter,
  aiLimiter,
  recommendationLimiter,
  xpLimiter,
};