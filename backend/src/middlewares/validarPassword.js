/**
 * Valida que la contraseña tenga mínimo 8 caracteres, una mayúscula,
 * una minúscula, un número y un carácter especial.
 * Se usa como middleware en las rutas de register y reset-password.
 */
const validarPassword = (req, res, next) => {
  const password = req.body.password || req.body.newPassword;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

  if (!password || !regex.test(password)) {
    return res.status(400).json({
      error:
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    });
  }

  next();
};

module.exports = { validarPassword };