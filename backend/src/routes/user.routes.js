const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/authMiddleware");

// Añadir XP al usuario autenticado
router.post("/add-xp", authenticateToken, userController.addXp);

module.exports = router;

