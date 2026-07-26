const { body, validationResult } = require("express-validator");

/**
 * Ejecuta los resultados de validación.
 * Si hay errores los retorna como 400 con detalle por campo.
 */
const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

/* ─────────────────────────────────────────
   REGLAS POR RUTA
───────────────────────────────────────── */

/* Solo letras (con tildes/ñ) y espacios. Nada de números ni símbolos. */
const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü\s]+$/;

/* 8+ caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial. */
const PASSWORD_FUERTE_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

const reglasNombre = body("name")
  .exists().withMessage("El nombre es obligatorio.")
  .bail()
  .isString().withMessage("El nombre debe ser texto.")
  .bail()
  .trim()
  .notEmpty().withMessage("El nombre es obligatorio.")
  .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres.")
  .isLength({ max: 100 }).withMessage("El nombre no puede superar 100 caracteres.")
  .matches(NOMBRE_REGEX).withMessage("El nombre solo puede contener letras y espacios (sin números ni símbolos).")
  .escape();

const reglasPasswordFuerte = (campo, mensajeRequerido) =>
  body(campo)
    .exists().withMessage(mensajeRequerido)
    .bail()
    .isString().withMessage("La contraseña debe ser texto.")
    .bail()
    .notEmpty().withMessage(mensajeRequerido)
    .isLength({ max: 72 }).withMessage("La contraseña no puede superar 72 caracteres.")
    .matches(PASSWORD_FUERTE_REGEX)
    .withMessage(
      "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
    );

const reglasRegister = [
  reglasNombre,

  body("email")
    .exists().withMessage("El email es obligatorio.")
    .bail()
    .isString().withMessage("El email debe ser texto.")
    .bail()
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage("El email es obligatorio.")
    .isEmail().withMessage("Ingresa un email válido.")
    .isLength({ max: 254 }).withMessage("El email no puede superar 254 caracteres."),

  reglasPasswordFuerte("password", "La contraseña es obligatoria."),

  validar,
];

const reglasLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage("El email es obligatorio.")
    .isEmail().withMessage("Ingresa un email válido."),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria."),

  validar,
];

const reglasForgotPassword = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage("El email es obligatorio.")
    .isEmail().withMessage("Ingresa un email válido."),

  validar,
];

const reglasResetPassword = [
  body("token")
    .exists().withMessage("El token es obligatorio.")
    .bail()
    .isString().withMessage("El token debe ser texto.")
    .bail()
    .trim()
    .notEmpty().withMessage("El token es obligatorio."),

  reglasPasswordFuerte("newPassword", "La nueva contraseña es obligatoria."),

  validar,
];

module.exports = {
  reglasRegister,
  reglasLogin,
  reglasForgotPassword,
  reglasResetPassword,
};