const crypto = require("crypto");
const pool = require("../config/db");
const wompi = require("../config/wompi");

const MONEDA = "COP";

/* ─────────────────────────────────────────
   GENERAR UNA REFERENCIA ÚNICA DE PAGO
   Wompi la usa para identificar la transacción,
   nosotros la usamos para saber a qué curso
   y a qué usuario corresponde.
───────────────────────────────────────── */
const generarReferencia = (courseId) =>
  `MEVOCATIO-CURSO-${courseId}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

/* ─────────────────────────────────────────
   FIRMA DE INTEGRIDAD (para el Widget de Wompi)
   Fórmula exacta que exige Wompi:
     SHA256( referencia + montoEnCentavos + moneda + secretoDeIntegridad )
   Sin separadores entre los valores.
───────────────────────────────────────── */
const generarFirmaIntegridad = (reference, amountInCents, currency) => {
  const cadena = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
  return crypto.createHash("sha256").update(cadena).digest("hex");
};

/* ─────────────────────────────────────────
   CREAR UN PAGO PARA PUBLICAR UN CURSO DE PAGO
   1. Crea el curso en estado "borrador" / payment_status "pendiente"
   2. Genera la referencia única y la firma de integridad
   3. Guarda el registro del intento de pago
   4. Devuelve todo lo que el FRONTEND necesita para abrir
      el Widget de Wompi (nosotros no generamos una URL de
      pago como en otras pasarelas; el widget se abre en el
      navegador del usuario con estos datos).
───────────────────────────────────────── */
const crearPagoParaCurso = async (userId, datosCurso) => {
  const { title, description, category, level, duration_hours, modality, price } = datosCurso;

  if (!price || Number(price) <= 0) {
    throw { status: 400, message: "El precio debe ser mayor a 0 para un curso de pago." };
  }

  // 1) Creamos el curso ya marcado como "de pago" y pendiente de publicar
  const cursoResultado = await pool.query(
    `INSERT INTO courses
       (instructor_id, title, description, category, level, duration_hours, modality,
        is_paid, price, payment_status, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, 'pendiente', 'borrador')
     RETURNING *`,
    [
      userId,
      title,
      description,
      category,
      level || "Principiante",
      duration_hours || null,
      modality || "Virtual",
      price,
    ]
  );
  const curso = cursoResultado.rows[0];

  // 2) Generamos referencia única y el monto en centavos que pide Wompi
  //    (si el curso cuesta $50.000 COP, a Wompi le mandamos 5000000)
  const reference = generarReferencia(curso.id);
  const amountInCents = Math.round(Number(price) * 100);
  const signature = generarFirmaIntegridad(reference, amountInCents, MONEDA);

  // 3) Guardamos el intento de pago en nuestra base de datos
  await pool.query(
    `INSERT INTO payments (user_id, course_id, reference, amount, currency, status)
     VALUES ($1, $2, $3, $4, $5, 'pendiente')`,
    [userId, curso.id, reference, price, MONEDA]
  );

  // 4) Devolvemos lo que el frontend necesita para abrir el Widget de Wompi
  return {
    curso,
    widget: {
      publicKey: process.env.WOMPI_PUBLIC_KEY,
      currency: MONEDA,
      amountInCents,
      reference,
      signature,
      redirectUrl: `${process.env.FRONTEND_URL}/pago-resultado?course_id=${curso.id}`,
    },
  };
};

/* ─────────────────────────────────────────
   LISTAR MIS PAGOS
───────────────────────────────────────── */
const listarPagosPorUsuario = async (userId) => {
  const resultado = await pool.query(
    `SELECT p.*, c.title AS curso_titulo
     FROM payments p
     LEFT JOIN courses c ON c.id = p.course_id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return resultado.rows;
};

/* ─────────────────────────────────────────
   OBTENER UN PAGO (solo el dueño puede verlo)
───────────────────────────────────────── */
const obtenerPagoPorId = async (id, userId) => {
  const resultado = await pool.query("SELECT * FROM payments WHERE id = $1", [id]);

  if (resultado.rows.length === 0) {
    throw { status: 404, message: "El pago no existe" };
  }
  if (resultado.rows[0].user_id !== userId) {
    throw { status: 403, message: "No tienes permiso para ver este pago" };
  }
  return resultado.rows[0];
};

/* ─────────────────────────────────────────
   RE-CONSULTAR EL ESTADO DE UN PAGO DIRECTO EN WOMPI
   Útil para la pantalla de "resultado del pago" en el
   frontend, sin tener que esperar al webhook.
───────────────────────────────────────── */
const reconsultarEstado = async (id, userId) => {
  const pago = await obtenerPagoPorId(id, userId);

  if (!pago.wompi_transaction_id) {
    return pago; // Wompi todavía no nos ha dado un id de transacción
  }

  const transaccion = await wompi.consultarTransaccion(pago.wompi_transaction_id);
  await aplicarEstadoTransaccion(transaccion);

  return obtenerPagoPorId(id, userId);
};

/* ─────────────────────────────────────────
   CANCELAR UN PAGO PENDIENTE
   (no se "elimina" el registro por temas contables/
    trazabilidad, se marca como cancelado)
───────────────────────────────────────── */
const cancelarPago = async (id, userId) => {
  const pago = await obtenerPagoPorId(id, userId);

  if (pago.status !== "pendiente") {
    throw { status: 400, message: "Solo se pueden cancelar pagos pendientes" };
  }

  await pool.query(
    `UPDATE payments SET status = 'cancelado', updated_at = NOW() WHERE id = $1`,
    [id]
  );

  if (pago.course_id) {
    await pool.query(`UPDATE courses SET payment_status = 'fallido' WHERE id = $1`, [
      pago.course_id,
    ]);
  }

  return { message: "Pago cancelado correctamente" };
};

/* ─────────────────────────────────────────
   WEBHOOKS DE WOMPI ("Eventos")
───────────────────────────────────────── */

// Wompi no manda un "id de evento" como tal; armamos una llave única
// combinando el id de la transacción con el timestamp del evento.
const yaFueProcesado = async (eventKey, type) => {
  const resultado = await pool.query(
    `INSERT INTO webhook_events (event_key, type)
     VALUES ($1, $2)
     ON CONFLICT (event_key) DO NOTHING
     RETURNING id`,
    [eventKey, type]
  );
  return resultado.rows.length === 0; // si no insertó nada, ya existía
};

/**
 * Valida que el evento realmente venga de Wompi, siguiendo su fórmula oficial:
 *   SHA256( valores_de_signature.properties_concatenados + timestamp + secretoDeEventos )
 */
const validarChecksumEvento = (body) => {
  const { signature, timestamp, data } = body;
  if (!signature?.properties || !signature?.checksum || !timestamp || !data) {
    return false;
  }

  const valoresConcatenados = signature.properties
    .map((ruta) => {
      // ruta viene como "transaction.id", "transaction.status", etc.
      return ruta.split(".").reduce((obj, key) => obj?.[key], data);
    })
    .join("");

  const cadena = `${valoresConcatenados}${timestamp}${process.env.WOMPI_EVENTS_SECRET}`;
  const checksumCalculado = crypto.createHash("sha256").update(cadena).digest("hex").toUpperCase();

  return checksumCalculado === signature.checksum.toUpperCase();
};

/**
 * Aplica el estado de una transacción de Wompi a nuestro pago y curso.
 * status puede ser: APPROVED, DECLINED, VOIDED, ERROR, PENDING
 */
const aplicarEstadoTransaccion = async (transaction) => {
  const { id, status, reference } = transaction;

  const mapaEstados = {
    APPROVED: "pagado",
    DECLINED: "fallido",
    ERROR: "fallido",
    VOIDED: "cancelado",
    PENDING: "pendiente",
  };
  const nuevoEstado = mapaEstados[status] || "pendiente";

  const pagoResultado = await pool.query(
    `UPDATE payments
     SET status = $1, wompi_transaction_id = $2, updated_at = NOW()
     WHERE reference = $3
     RETURNING *`,
    [nuevoEstado, id, reference]
  );

  const pago = pagoResultado.rows[0];
  if (!pago || !pago.course_id) return;

  if (nuevoEstado === "pagado") {
    await pool.query(
      `UPDATE courses SET payment_status = 'pagado', status = 'activo', updated_at = NOW() WHERE id = $1`,
      [pago.course_id]
    );
  } else if (nuevoEstado === "fallido" || nuevoEstado === "cancelado") {
    await pool.query(`UPDATE courses SET payment_status = 'fallido' WHERE id = $1`, [
      pago.course_id,
    ]);
  }
};

module.exports = {
  crearPagoParaCurso,
  listarPagosPorUsuario,
  obtenerPagoPorId,
  reconsultarEstado,
  cancelarPago,
  yaFueProcesado,
  validarChecksumEvento,
  aplicarEstadoTransaccion,
};
