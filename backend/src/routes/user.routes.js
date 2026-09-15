const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { xpLimiter } = require("../middlewares/rateLimiter");

// Añadir XP (solo administradores): evitar el farmeo de XP por usuarios normales (M2).
router.post("/add-xp", authenticateToken, authenticateToken.authorizeRoles("admin"), xpLimiter, userController.addXp);

module.exports = router;

