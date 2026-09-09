const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Rutas protegidas para administradores
router.get("/stats", authenticateToken, authorizeRoles("admin"), adminController.getStats);

module.exports = router;
