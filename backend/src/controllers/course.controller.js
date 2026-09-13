const courseService = require("../services/course.service");
const pool = require("../config/db");
const achievementService = require("../services/achievement.service");

/* ─────────────────────────────────────────
   CREAR CURSO
───────────────────────────────────────── */
const crear = async (req, res) => {
  try {
    const curso = await courseService.crearCurso(req.user.id, req.body);
    await achievementService.incrementarProgreso(req.user.id, "resources_created");
    const unlocked = await achievementService.evaluarLogros(req.user.id);
    res.status(201).json({ ...curso, unlocked });
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

/* ─────────────────────────────────────────
   ANALÍTICAS DEL INSTRUCTOR
───────────────────────────────────────── */
const analiticasInstructor = async (req, res) => {
  try {
    const courseId = req.query.courseId ? parseInt(req.query.courseId, 10) : null;
    const analiticas = await courseService.obtenerAnaliticasInstructor(req.user.id, courseId);
    res.json(analiticas);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error interno al obtener analíticas" });
  }
};

/* ─────────────────────────────────────────
   RESEÑAS DEL CURSO
───────────────────────────────────────── */
const agregarReview = async (req, res) => {
  try {
    const review = await courseService.crearOActualizarReview(req.params.id, req.user.id, req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Error al agregar reseña" });
  }
};

const obtenerReviews = async (req, res) => {
  try {
    const data = await courseService.obtenerReviewsCurso(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reseñas del curso" });
  }
};

/* ─────────────────────────────────────────
   INSCRIPCIÓN Y PROGRESO DEL ESTUDIANTE
───────────────────────────────────────── */
const enrollInCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    
    // Check if already enrolled
    const checkRes = await pool.query(
      `SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    
    if (checkRes.rows.length === 0) {
      // Create enrollment
      await pool.query(
        `INSERT INTO enrollments (user_id, course_id, status) VALUES ($1, $2, 'active')`,
        [userId, courseId]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const { lessonId } = req.body;
    const userId = req.user.id;

    // Get enrollment
    const enrollmentRes = await pool.query(
      `SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [userId, courseId]
    );

    let enrollmentId;
    if (enrollmentRes.rows.length === 0) {
      // Create enrollment if it somehow didn't exist
      const newEnroll = await pool.query(
        `INSERT INTO enrollments (user_id, course_id, status) VALUES ($1, $2, 'active') RETURNING id`,
        [userId, courseId]
      );
      enrollmentId = newEnroll.rows[0].id;
    } else {
      enrollmentId = enrollmentRes.rows[0].id;
    }

    // Check if lesson is already marked as complete
    const progressCheck = await pool.query(
      `SELECT id FROM course_progress WHERE enrollment_id = $1 AND lesson_id = $2`,
      [enrollmentId, lessonId]
    );

    if (progressCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO course_progress (enrollment_id, lesson_id) VALUES ($1, $2)`,
        [enrollmentId, lessonId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crear,
  listar,
  misCursos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  analiticasInstructor,
  agregarReview,
  obtenerReviews,
  enrollInCourse,
  updateProgress,
};
