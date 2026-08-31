const { body, query, validationResult } = require("express-validator");

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

const reglasVerifyEmail = [
  query("token")
    .exists().withMessage("El token es obligatorio.")
    .bail()
    .isString().withMessage("El token debe ser texto.")
    .bail()
    .trim()
    .notEmpty().withMessage("El token es obligatorio.")
    .isHexadecimal().withMessage("El token no tiene un formato válido.")
    .isLength({ min: 64, max: 64 }).withMessage("El token no tiene un formato válido."),

  validar,
];

const reglasResendVerification = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage("El email es obligatorio.")
    .isEmail().withMessage("Ingresa un email válido."),

  validar,
];

const NIVELES_VALIDOS = ["Principiante", "Intermedio", "Avanzado"];
const MODALIDADES_VALIDAS = ["Virtual", "Presencial"];

const reglasCrearCurso = [
  body("title")
    .exists().withMessage("El título es obligatorio.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("El título es obligatorio.")
    .isLength({ min: 5, max: 150 }).withMessage("El título debe tener entre 5 y 150 caracteres.")
    .escape(),

  body("description")
    .exists().withMessage("La descripción es obligatoria.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("La descripción es obligatoria.")
    .isLength({ min: 20, max: 2000 }).withMessage("La descripción debe tener entre 20 y 2000 caracteres.")
    .escape(),

  body("category")
    .exists().withMessage("La categoría es obligatoria.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("La categoría es obligatoria.")
    .isLength({ max: 100 }).withMessage("La categoría no puede superar 100 caracteres.")
    .escape(),

  body("level")
    .optional()
    .isIn(NIVELES_VALIDOS).withMessage(`El nivel debe ser uno de: ${NIVELES_VALIDOS.join(", ")}.`),

  body("modality")
    .optional()
    .isIn(MODALIDADES_VALIDAS).withMessage(`La modalidad debe ser una de: ${MODALIDADES_VALIDAS.join(", ")}.`),

  body("duration_hours")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 1000 }).withMessage("La duración debe ser un número de horas entre 1 y 1000."),

  validar,
];

const reglasActualizarCurso = [
  body("title")
    .optional()
    .isString().trim()
    .isLength({ min: 5, max: 150 }).withMessage("El título debe tener entre 5 y 150 caracteres.")
    .escape(),

  body("description")
    .optional()
    .isString().trim()
    .isLength({ min: 20, max: 2000 }).withMessage("La descripción debe tener entre 20 y 2000 caracteres.")
    .escape(),

  body("category")
    .optional()
    .isString().trim()
    .isLength({ max: 100 }).withMessage("La categoría no puede superar 100 caracteres.")
    .escape(),

  body("level")
    .optional()
    .isIn(NIVELES_VALIDOS).withMessage(`El nivel debe ser uno de: ${NIVELES_VALIDOS.join(", ")}.`),

  body("modality")
    .optional()
    .isIn(MODALIDADES_VALIDAS).withMessage(`La modalidad debe ser una de: ${MODALIDADES_VALIDAS.join(", ")}.`),

  body("duration_hours")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 1000 }).withMessage("La duración debe ser un número de horas entre 1 y 1000."),

  body("status")
    .optional()
    .isIn(["activo", "inactivo"]).withMessage("El estado debe ser 'activo' o 'inactivo'."),

  validar,
];

const reglasCrearPago = [
  body("title")
    .exists().withMessage("El título es obligatorio.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("El título es obligatorio.")
    .isLength({ min: 5, max: 150 }).withMessage("El título debe tener entre 5 y 150 caracteres.")
    .escape(),

  body("description")
    .exists().withMessage("La descripción es obligatoria.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("La descripción es obligatoria.")
    .isLength({ min: 20, max: 2000 }).withMessage("La descripción debe tener entre 20 y 2000 caracteres.")
    .escape(),

  body("category")
    .exists().withMessage("La categoría es obligatoria.")
    .bail()
    .isString().trim()
    .notEmpty().withMessage("La categoría es obligatoria.")
    .isLength({ max: 100 }).withMessage("La categoría no puede superar 100 caracteres.")
    .escape(),

  body("level")
    .optional()
    .isIn(NIVELES_VALIDOS).withMessage(`El nivel debe ser uno de: ${NIVELES_VALIDOS.join(", ")}.`),

  body("modality")
    .optional()
    .isIn(MODALIDADES_VALIDAS).withMessage(`La modalidad debe ser una de: ${MODALIDADES_VALIDAS.join(", ")}.`),

  body("duration_hours")
    .optional({ nullable: true })
    .isInt({ min: 1, max: 1000 }).withMessage("La duración debe ser un número de horas entre 1 y 1000."),

  body("price")
    .exists().withMessage("El precio es obligatorio para un curso de pago.")
    .bail()
    .isFloat({ min: 0.5, max: 10000 }).withMessage("El precio debe ser un número entre 0.5 y 10000."),

  validar,
];

module.exports = {
  reglasRegister,
  reglasLogin,
  reglasForgotPassword,
  reglasResetPassword,
  reglasVerifyEmail,
  reglasResendVerification,
  reglasCrearCurso,
  reglasActualizarCurso,
  reglasCrearPago,
};