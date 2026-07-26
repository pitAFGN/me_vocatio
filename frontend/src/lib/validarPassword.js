/**
 * Valida que la contraseña cumpla los requisitos:
 * mínimo 7 caracteres y al menos 2 números.
 */
export const validarPassword = (password) => {
  const regex = /^(?=(?:.*\d){2,}).{7,}$/;
  return regex.test(password);
};
