require("dotenv").config();

/*
  Wompi tiene dos ambientes con URLs distintas:
    - Sandbox (pruebas):    https://api-sandbox.co.uat.wompi.dev/v1
    - Producción (real):    https://production.wompi.co/v1
  Cuál usar depende de la variable WOMPI_ENV en el .env ('sandbox' o 'production').
*/
const BASE_URL =
  process.env.WOMPI_ENV === "production"
    ? "https://production.wompi.co/v1"
    : "https://sandbox.wompi.co/v1";

if (!process.env.WOMPI_PRIVATE_KEY || !process.env.WOMPI_INTEGRITY_SECRET) {
  console.warn(
    "⚠️  Faltan variables de Wompi en el .env (WOMPI_PRIVATE_KEY / WOMPI_INTEGRITY_SECRET). Los pagos no van a funcionar hasta que las agregues."
  );
}

/**
 * Llama a la API de Wompi usando la llave privada (Bearer token).
 * Se usa, por ejemplo, para consultar el estado real de una transacción.
 */
const wompiFetch = async (path, options = {}) => {
  const respuesta = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
      ...(options.headers || {}),
    },
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw {
      status: respuesta.status,
      message: datos?.error?.reason || datos?.error?.type || "Error al comunicarse con Wompi",
    };
  }

  return datos;
};

/**
 * Consulta el estado real de una transacción directamente en Wompi.
 * Sirve como respaldo por si el webhook aún no ha llegado.
 */
const consultarTransaccion = async (wompiTransactionId) => {
  const datos = await wompiFetch(`/transactions/${wompiTransactionId}`);
  return datos.data; // { id, status, reference, amount_in_cents, ... }
};

module.exports = {
  BASE_URL,
  consultarTransaccion,
};
