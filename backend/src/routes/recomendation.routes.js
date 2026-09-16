const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recomendation.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { aiLimiter, recommendationLimiter } = require("../middlewares/rateLimiter");
const { checkDailyLimit } = require("../middlewares/dailyLimitMiddleware");
const optionalAuth = authenticateToken.optionalAuth || authenticateToken;
const requirePremium = authenticateToken.requirePremium;

router.post("/generar", authenticateToken, aiLimiter, checkDailyLimit, recommendationController.generarTest);
router.post("/evaluar", authenticateToken, aiLimiter, recommendationController.evaluar); // evaluar doesn't use AI (it's DB only)
router.post("/recomendar", authenticateToken, recommendationLimiter, checkDailyLimit, recommendationController.recomendar); // Note: require Auth now if we limit by user
router.post("/analizar", authenticateToken, requirePremium, aiLimiter, checkDailyLimit, recommendationController.analizarRecurso);

module.exports = router;