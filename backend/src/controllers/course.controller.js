const courseService = require("../services/course.service");
const achievementService = require("../services/achievement.service");

/* ─────────────────────────────────────────
   CREAR CURSO
───────────────────────────────────────── */
const crear = async (req, res) => {
  try {
    const curso = await courseService.crearCurso(req.user.id, req.body);
    await achievementService.incrementarProgreso(req.user.id, "resources_created");
    await achievementService.evaluarLogros(req.user.id);
    res.status(201).json(curso);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno al crear el curso" });
  }
};

/* ─────────────────────────────────────────
   LISTAR CURSOS (catálogo público)
───────────────────────────────────────── */
const listar = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const cursos = await courseService.listarCursos({ search, category, level });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Error interno al listar los cursos" });
  }
};

/* ─────────────────────────────────────────
   MIS CURSOS (del instructor autenticado)
───────────────────────────────────────── */
const misCursos = async (req, res) => {
  try {
    const cursos = await courseService.listarCursosPorInstructor(req.user.id);
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Error interno al listar tus cursos" });
  }
};

/* ─────────────────────────────────────────
   OBTENER UN CURSO
───────────────────────────────────────── */
const obtenerPorId = async (req, res) => {
  try {
    const curso = await courseService.obtenerCursoPorId(req.params.id);
    res.json(curso);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno al obtener el curso" });
  }
};

/* ─────────────────────────────────────────
   ACTUALIZAR CURSO
───────────────────────────────────────── */
const actualizar = async (req, res) => {
  try {
    const curso = await courseService.actualizarCurso(req.params.id, req.user.id, req.body);
    res.json(curso);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno al actualizar el curso" });
  }
};

/* ─────────────────────────────────────────
   ELIMINAR CURSO
───────────────────────────────────────── */
const eliminar = async (req, res) => {
  try {
    const resultado = await courseService.eliminarCurso(req.params.id, req.user.id);
    res.json(resultado);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error interno al eliminar el curso" });
  }
};

module.exports = {
  crear,
  listar,
  misCursos,
  obtenerPorId,
  actualizar,
  eliminar,
};
