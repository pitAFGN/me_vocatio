const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/authMiddleware");
const achievementController = require("../controllers/achievement.controller");

router.get("/", authenticateToken, achievementController.listar);

module.exports = router;