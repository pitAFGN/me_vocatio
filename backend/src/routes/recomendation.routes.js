const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recomendation.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const optionalAuth = authenticateToken.optionalAuth || authenticateToken;

router.post("/generar", authenticateToken, recommendationController.generarTest);
router.post("/evaluar", authenticateToken, recommendationController.evaluar);
router.post("/recomendar", optionalAuth, recommendationController.recomendar);
router.post("/analizar", optionalAuth, recommendationController.analizarRecurso);

module.exports = router;