/**
 * Simula un evento (webhook) de Wompi para probar tu endpoint
 * /api/wompi/eventos SIN depender de una tarjeta real ni de ngrok.
 *
 * Uso (desde la carpeta backend/, con el servidor corriendo):
 *   node sql/../scripts/simulate-wompi-webhook.js <reference> APPROVED
 *   node sql/../scripts/simulate-wompi-webhook.js <reference> DECLINED
 *
 * El <reference> es el que te devolvió POST /api/pagos/crear
 * (dentro de widget.reference).
 */
require("dotenv").config();
const crypto = require("crypto");

const reference = process.argv[2];
const status = process.argv[3] || "APPROVED"; // APPROVED | DECLINED | VOIDED | ERROR
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

if (!reference) {
  console.error("❌ Debes pasar la referencia. Ejemplo:");
  console.error("   node scripts/simulate-wompi-webhook.js MEVOCATIO-CURSO-1-... APPROVED");
  process.exit(1);
}

const transactionId = `test-${crypto.randomBytes(6).toString("hex")}`;
const amountInCents = 5000000; // no necesita ser exacto para esta prueba
const timestamp = Math.floor(Date.now() / 1000);

const body = {
  event: "transaction.updated",
  data: {
    transaction: {
      id: transactionId,
      amount_in_cents: amountInCents,
      reference,
      currency: "COP",
      status,
    },
  },
  environment: "test",
  signature: {
    properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
    checksum: "", // se calcula abajo
  },
  timestamp,
  sent_at: new Date().toISOString(),
};

// Misma fórmula que usa tu servicio para validar:
// SHA256( valores_de_properties + timestamp + WOMPI_EVENTS_SECRET )
const valores = `${transactionId}${status}${amountInCents}`;
const cadena = `${valores}${timestamp}${process.env.WOMPI_EVENTS_SECRET}`;
body.signature.checksum = crypto.createHash("sha256").update(cadena).digest("hex");

(async () => {
  console.log(`→ Enviando evento simulado (${status}) para reference: ${reference}`);

  const respuesta = await fetch(`${BACKEND_URL}/api/wompi/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await respuesta.json();
  console.log(`← Respuesta (${respuesta.status}):`, data);
})();
