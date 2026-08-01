const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recomendation.controller");

router.post("/generar", recommendationController.generarTest);
router.post("/evaluar", recommendationController.evaluar);
router.post("/recomendar", recommendationController.recomendar);

module.exports = router;