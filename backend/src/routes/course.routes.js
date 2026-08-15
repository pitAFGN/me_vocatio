const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const authenticateToken = require("../middlewares/authMiddleware");
const { reglasCrearCurso, reglasActualizarCurso } = require("../middlewares/validarInputs");

/* ─── Rutas públicas: cualquiera puede ver el catálogo ─── */
router.get("/", courseController.listar);

/* ─── Rutas privadas: requieren estar logueado ───
   OJO: "/mios" debe ir ANTES de "/:id" para que no lo confunda con un id */
router.get("/mios", authenticateToken, courseController.misCursos);

router.post("/", authenticateToken, reglasCrearCurso, courseController.crear);
router.put("/:id", authenticateToken, reglasActualizarCurso, courseController.actualizar);
router.delete("/:id", authenticateToken, courseController.eliminar);

/* ─── Ruta pública: detalle de un curso (va al final por el ":id") ─── */
router.get("/:id", courseController.obtenerPorId);

module.exports = router;
