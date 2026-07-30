const crypto = require("crypto");

/**
 * Utilidades para generar y verificar tokens de un solo uso
 * (verificación de correo, magic links, etc.).
 *
 * Estrategia de seguridad:
 * - El token "crudo" (raw) es el que se envía por correo dentro del enlace.
 *   Nunca se guarda en la base de datos.
 * - En la base de datos solo se guarda el HASH (SHA-256) del token.
 *   Así, si la base de datos se filtra, los enlaces no se pueden reconstruir.
 * - Al validar, se hashea el token recibido y se compara contra el hash
 *   guardado.
 */

/**
 * Genera un token aleatorio criptográficamente seguro.
 * 32 bytes -> 64 caracteres en hexadecimal (suficiente entropía, 256 bits).
 */
const generarTokenSeguro = () => crypto.randomBytes(32).toString("hex");

/**
 * Genera el hash SHA-256 de un token (para guardar/comparar en BD).
 */
const hashearToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Calcula una fecha de expiración a partir de ahora + horas indicadas.
 */
const calcularExpiracion = (horas) =>
  new Date(Date.now() + horas * 60 * 60 * 1000);

module.exports = { generarTokenSeguro, hashearToken, calcularExpiracion };
