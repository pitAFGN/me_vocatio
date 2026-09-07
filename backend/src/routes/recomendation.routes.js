const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recomendation.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { aiLimiter, recommendationLimiter } = require("../middlewares/rateLimiter");
const optionalAuth = authenticateToken.optionalAuth || authenticateToken;
const requirePremium = authenticateToken.requirePremium;

router.post("/generar", authenticateToken, aiLimiter, recommendationController.generarTest);
router.post("/evaluar", authenticateToken, recommendationController.evaluar);
router.post("/recomendar", optionalAuth, recommendationLimiter, recommendationController.recomendar);
router.post("/analizar", authenticateToken, requirePremium, aiLimiter, recommendationController.analizarRecurso);

module.exports = router;