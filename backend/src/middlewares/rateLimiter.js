const rateLimit = require("express-rate-limit");

/**
 * Rate limiting por ruta.
 * Evita ataques de fuerza bruta limitando intentos por IP.
 */

// Login: máximo 5 intentos cada 15 minutos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
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
  message: {
    error: "Demasiados registros desde esta IP. Intenta de nuevo en 1 hora.",
  },
});

// Forgot password: máximo 3 solicitudes cada 15 minutos
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes de recuperación. Intenta de nuevo en 15 minutos.",
  },
});

// Verify email: máximo 10 intentos cada 15 minutos (clics legítimos + algún reintento)
const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos de verificación. Intenta de nuevo en 15 minutos.",
  },
});

// Resend verification: máximo 3 reenvíos cada 15 minutos (mismo criterio que forgot-password)
const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes de reenvío. Intenta de nuevo en 15 minutos.",
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationLimiter,
};
