const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { xpLimiter } = require("../middlewares/rateLimiter");

// Añadir XP al usuario autenticado (protegido con rate limit)
router.post("/add-xp", authenticateToken, xpLimiter, userController.addXp);

module.exports = router;

