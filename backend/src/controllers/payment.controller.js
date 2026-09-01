const paymentService = require("../services/payment.service");

/* ─────────────────────────────────────────
   CREAR PAGO (crear un curso DE PAGO)
   Devuelve los datos que el FRONTEND necesita
   para abrir el Widget de Wompi.
───────────────────────────────────────── */
const crearPago = async (req, res) => {
  try {
    const { curso, widget } = await paymentService.crearPagoParaCurso(req.user.id, req.body);
    res.status(201).json({ curso, widget });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error al iniciar el pago" });
  }
};

/* ─────────────────────────────────────────
   MIS PAGOS
───────────────────────────────────────── */
const misPagos = async (req, res) => {
  try {
    const pagos = await paymentService.listarPagosPorUsuario(req.user.id);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: "Error al listar tus pagos" });
  }
};

/* ─────────────────────────────────────────
   OBTENER UN PAGO
───────────────────────────────────────── */
const obtenerPorId = async (req, res) => {
  try {
    const pago = await paymentService.obtenerPagoPorId(req.params.id, req.user.id);
    res.json(pago);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error al obtener el pago" });
  }
};

/* ─────────────────────────────────────────
   RE-CONSULTAR ESTADO (consulta directa a Wompi,
   útil para la pantalla de "resultado del pago")
───────────────────────────────────────── */
const reconsultarEstado = async (req, res) => {
  try {
    const pago = await paymentService.reconsultarEstado(req.params.id, req.user.id);
    res.json(pago);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error al consultar el pago" });
  }
};

/* ─────────────────────────────────────────
   CANCELAR UN PAGO PENDIENTE
───────────────────────────────────────── */
const cancelar = async (req, res) => {
  try {
    const resultado = await paymentService.cancelarPago(req.params.id, req.user.id);
    res.json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error al cancelar el pago" });
  }
};

/* ─────────────────────────────────────────
   WEBHOOK (EVENTOS) DE WOMPI
   A diferencia de Stripe, Wompi valida su firma con
   los VALORES del JSON (no con el body crudo), así que
   aquí sí podemos usar el body ya parseado por express.json().
───────────────────────────────────────── */
const evento = async (req, res) => {
  const body = req.body;

  const esValido = paymentService.validarChecksumEvento(body);
  if (!esValido) {
    console.warn("Evento de Wompi con firma inválida, se ignora.");
    return res.status(400).json({ error: "Firma inválida" });
  }

  try {
    const transaction = body.data.transaction;
    const eventKey = `${transaction.id}-${body.timestamp}`;

    const yaProcesado = await paymentService.yaFueProcesado(eventKey, body.event);
    if (yaProcesado) {
      return res.status(200).json({ recibido: true, duplicado: true });
    }

    await paymentService.aplicarEstadoTransaccion(transaction);

    res.status(200).json({ recibido: true });
  } catch (error) {
    console.error("Error procesando evento de Wompi:", error);
    // Respondemos 200 igual para que Wompi no reintente infinitamente
    // un evento que ya identificamos pero falló al procesar internamente.
    res.status(200).json({ recibido: true, error: "Error interno al procesar" });
  }
};

module.exports = {
  crearPago,
  misPagos,
  obtenerPorId,
  reconsultarEstado,
  cancelar,
  evento,
};
