require("dotenv").config();

/*
  Wompi tiene dos ambientes con URLs distintas:
    - Sandbox (pruebas):    https://sandbox.wompi.co/v1
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

// ── Validación de consistencia entre WOMPI_ENV y los prefijos de las llaves ──
(function validarConsistenciaWompi() {
  const env = (process.env.WOMPI_ENV || "").toLowerCase();
  const publicKey = process.env.WOMPI_PUBLIC_KEY || "";
  const privateKey = process.env.WOMPI_PRIVATE_KEY || "";
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET || "";
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET || "";

  const esSandbox = env === "sandbox";

  const check = (valor, prefijoTest, prefijoProd, nombre) => {
    if (!valor) return;
    const esTest = valor.startsWith(prefijoTest);
    const esProd = valor.startsWith(prefijoProd);
    if (esSandbox && esProd) {
      console.error(
        `❌  WOMPI CONFIG ERROR: ${nombre} usa prefijo de producción (${prefijoProd}…), pero WOMPI_ENV="${env}". ` +
        `Cambia ${nombre} a un valor sandbox (${prefijoTest}…) o cambia WOMPI_ENV a "production".`
      );
    } else if (!esSandbox && esTest) {
      console.error(
        `❌  WOMPI CONFIG ERROR: ${nombre} usa prefijo de sandbox (${prefijoTest}…), pero WOMPI_ENV="${env}". ` +
        `Cambia ${nombre} a un valor de producción (${prefijoProd}…) o cambia WOMPI_ENV a "sandbox".`
      );
    }
  };

  check(publicKey, "pub_test_", "pub_prod_", "WOMPI_PUBLIC_KEY");
  check(privateKey, "prv_test_", "prv_prod_", "WOMPI_PRIVATE_KEY");
  check(integritySecret, "test_integrity_", "prod_integrity_", "WOMPI_INTEGRITY_SECRET");
  check(eventsSecret, "test_events_", "prod_events_", "WOMPI_EVENTS_SECRET");

  console.log(
    `✅  Wompi configurado para ambiente: ${env.toUpperCase()} — URL base: ${BASE_URL}`
  );
})();

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

const consultarTransaccionPorReferencia = async (reference) => {
  const datos = await wompiFetch(`/transactions?reference=${encodeURIComponent(reference)}`);
  return datos.data?.[0] || null;
};

module.exports = {
  BASE_URL,
  consultarTransaccion,
  consultarTransaccionPorReferencia,
};
