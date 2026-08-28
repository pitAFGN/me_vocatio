const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recomendation.controller");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/generar", authenticateToken, recommendationController.generarTest);
router.post("/evaluar", authenticateToken, recommendationController.evaluar);
router.post("/recomendar", authenticateToken, recommendationController.recomendar);

module.exports = router;