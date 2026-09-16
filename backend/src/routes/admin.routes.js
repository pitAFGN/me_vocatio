const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/stats", authenticateToken, authorizeRoles("admin"), adminController.getStats);
router.get("/metrics-dashboard", authenticateToken, authorizeRoles("admin"), adminController.getDashboardMetrics);
router.get("/payments", authenticateToken, authorizeRoles("admin"), adminController.getPayments);

// Recursos
router.get("/resources", authenticateToken, authorizeRoles("admin"), adminController.getResources);
router.put("/resources/:id", authenticateToken, authorizeRoles("admin"), adminController.updateResource);
router.delete("/resources/:id", authenticateToken, authorizeRoles("admin"), adminController.deleteResource);

// Usuarios
router.get("/users", authenticateToken, authorizeRoles("admin"), adminController.getUsers);
router.put("/users/:id", authenticateToken, authorizeRoles("admin"), adminController.updateUser);

module.exports = router;
