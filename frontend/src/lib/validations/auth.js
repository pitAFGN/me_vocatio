export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü\s]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/;

export const validarCamposLogin = ({ email, password }) => {
  const errores = {};
  if (!email?.trim()) errores.email = "El email es obligatorio.";
  else if (!EMAIL_REGEX.test(email)) errores.email = "Ingresa un email válido.";
  
  if (!password) errores.password = "La contraseña es obligatoria.";
  return errores;
};

export const validarCamposRegistro = ({ nombre, email, password }) => {
  const errores = {};
  if (!nombre?.trim()) errores.nombre = "El nombre es obligatorio.";
  else if (nombre.trim().length < 3) errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  else if (!NOMBRE_REGEX.test(nombre.trim())) errores.nombre = "El nombre solo puede contener letras y espacios.";

  if (!email?.trim()) errores.email = "El email es obligatorio.";
  else if (!EMAIL_REGEX.test(email)) errores.email = "Ingresa un email válido.";

  if (!password) errores.password = "La contraseña es obligatoria.";
  else if (!PASSWORD_REGEX.test(password)) errores.password = "Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.";

  return errores;
};