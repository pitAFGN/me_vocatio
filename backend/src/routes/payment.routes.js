const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { reglasCrearPago } = require("../middlewares/validarInputs");

/* Nota: la ruta de eventos (/api/wompi/eventos) NO va acá,
   se registra directo en server.js porque Wompi la llama
   sin el token de un usuario. */

router.post("/crear", authenticateToken, reglasCrearPago, paymentController.crearPago);
router.get("/mios", authenticateToken, paymentController.misPagos);
router.get("/:id", authenticateToken, paymentController.obtenerPorId);
router.get("/:id/reconsultar", authenticateToken, paymentController.reconsultarEstado);
router.delete("/:id", authenticateToken, paymentController.cancelar);

module.exports = router;
