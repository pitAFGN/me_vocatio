const pool = require("../config/db");

/* ─────────────────────────────────────────
   CREAR CURSO
───────────────────────────────────────── */
const crearCurso = async (instructorId, datos) => {
  const { title, description, category, level, duration_hours, modality, background_style, badges, lessons_list } = datos;

  // Iniciar transacción
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insertar curso
    const resultCurso = await client.query(
      `INSERT INTO courses (instructor_id, title, description, category, level, duration_hours, modality, background_style, badges)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        instructorId,
        title,
        description,
        category,
        level || "Principiante",
        duration_hours || null,
        modality || "Virtual",
        background_style || "bg-slate-950",
        JSON.stringify(badges || [])
      ]
    );

    const nuevoCurso = resultCurso.rows[0];

    // Insertar lecciones si existen
    if (lessons_list && Array.isArray(lessons_list) && lessons_list.length > 0) {
      for (let i = 0; i < lessons_list.length; i++) {
        const lesson = lessons_list[i];
        await client.query(
          `INSERT INTO lessons (course_id, title, content, video_url, duration_minutes, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            nuevoCurso.id,
            lesson.title || `Lección ${i + 1}`,
            lesson.content || "",
            lesson.video_url || null,
            lesson.duration_minutes || null,
            i
          ]
        );
      }
    }

    await client.query("COMMIT");
    return nuevoCurso;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/* ─────────────────────────────────────────
   LISTAR CURSOS (público, catálogo)
   Filtros opcionales: búsqueda por texto, categoría, nivel
───────────────────────────────────────── */
const listarCursos = async ({ search, category, level } = {}) => {
  const condiciones = ["c.status = 'activo' OR c.status = 'published'"];
  const valores = [];

  if (search) {
    valores.push(`%${search}%`);
    condiciones.push(`(c.title ILIKE $${valores.length} OR c.description ILIKE $${valores.length})`);
  }

  if (category) {
    valores.push(category);
    condiciones.push(`c.category = $${valores.length}`);
  }

  if (level) {
    valores.push(level);
    condiciones.push(`c.level = $${valores.length}`);
  }

  const query = `
    SELECT c.*, u.name AS instructor_name,
    (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as lessons_count
    FROM courses c
    JOIN users u ON u.id = c.instructor_id
    WHERE ${condiciones.join(" AND ")}
    ORDER BY c.created_at DESC
  `;

  const resultado = await pool.query(query, valores);
  return resultado.rows;
};

/* ─────────────────────────────────────────
   OBTENER UN CURSO POR ID (público)
───────────────────────────────────────── */
const obtenerCursoPorId = async (id) => {
  const resultado = await pool.query(
    `SELECT c.*, u.name AS instructor_name, u.email AS instructor_email
     FROM courses c
     JOIN users u ON u.id = c.instructor_id
     WHERE c.id = $1`,
    [id]
  );

  if (resultado.rows.length === 0) {
    throw { status: 404, message: "El curso no existe" };
  }

  const curso = resultado.rows[0];

  // Fetch the lessons for this course
  const lessonsResult = await pool.query(
    `SELECT * FROM lessons WHERE course_id = $1 ORDER BY order_index ASC`,
    [id]
  );

  curso.lessons = lessonsResult.rows;

  return curso;
};

/* ─────────────────────────────────────────
   LISTAR MIS CURSOS (del instructor autenticado)
───────────────────────────────────────── */
const listarCursosPorInstructor = async (instructorId) => {
  const resultado = await pool.query(
    `SELECT * FROM courses WHERE instructor_id = $1 ORDER BY created_at DESC`,
    [instructorId]
  );
  return resultado.rows;
};

/* ─────────────────────────────────────────
   ACTUALIZAR CURSO (solo el dueño)
───────────────────────────────────────── */
const actualizarCurso = async (id, instructorId, datos) => {
  const cursoExistente = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);

  if (cursoExistente.rows.length === 0) {
    throw { status: 404, message: "El curso no existe" };
  }

  if (cursoExistente.rows[0].instructor_id !== instructorId) {
    throw { status: 403, message: "No tienes permiso para editar este curso" };
  }

  const { title, description, category, level, duration_hours, modality, status } = datos;
  const actual = cursoExistente.rows[0];

  const resultado = await pool.query(
    `UPDATE courses
     SET title = $1, description = $2, category = $3, level = $4,
         duration_hours = $5, modality = $6, status = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [
      title ?? actual.title,
      description ?? actual.description,
      category ?? actual.category,
      level ?? actual.level,
      duration_hours ?? actual.duration_hours,
      modality ?? actual.modality,
      status ?? actual.status,
      id,
    ]
  );

  return resultado.rows[0];
};

/* ─────────────────────────────────────────
   ELIMINAR CURSO (solo el dueño)
───────────────────────────────────────── */
const eliminarCurso = async (id, instructorId) => {
  const cursoExistente = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);

  if (cursoExistente.rows.length === 0) {
    throw { status: 404, message: "El curso no existe" };
  }

  if (cursoExistente.rows[0].instructor_id !== instructorId) {
    throw { status: 403, message: "No tienes permiso para eliminar este curso" };
  }

  await pool.query("DELETE FROM courses WHERE id = $1", [id]);
  return { message: "Curso eliminado correctamente" };
};

/* ─────────────────────────────────────────
   ANALÍTICAS DEL INSTRUCTOR
───────────────────────────────────────── */
const obtenerAnaliticasInstructor = async (instructorId) => {
  const coursesRes = await pool.query(
    `SELECT id, title FROM courses WHERE instructor_id = $1`,
    [instructorId]
  );
  const courseIds = coursesRes.rows.map((c) => c.id);

  if (courseIds.length === 0) {
    return {
      hasCourses: false,
      totalStudents: 0,
      completionRate: "0%",
      totalStudyHours: "0h",
      courses: [],
      recentStudents: [],
    };
  }

  // Estudiantes totales
  const studentsRes = await pool.query(
    `SELECT COUNT(DISTINCT user_id) as total_students 
     FROM enrollments 
     WHERE course_id = ANY($1::int[])`,
    [courseIds]
  );
  const totalStudents = parseInt(studentsRes.rows[0]?.total_students || 0, 10);

  // Total inscripciones
  const totalEnrollmentsRes = await pool.query(
    `SELECT COUNT(*) as total_count 
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE c.instructor_id = $1`,
    [instructorId]
  );
  const totalEnrollments = parseInt(totalEnrollmentsRes.rows[0]?.total_count || 0, 10);

  // Completados
  const completedEnrollmentsRes = await pool.query(
    `SELECT COUNT(*) as completed_count 
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE c.instructor_id = $1 AND e.status = 'completed'`,
    [instructorId]
  );
  const completedCount = parseInt(completedEnrollmentsRes.rows[0]?.completed_count || 0, 10);
  const completionRate = totalEnrollments > 0 ? Math.round((completedCount / totalEnrollments) * 100) : 0;

  // Estudiantes y progreso reciente
  const recentStudentsRes = await pool.query(
    `SELECT u.name, c.title as course, e.status, e.enrolled_at,
            (SELECT COUNT(*) FROM course_progress cp WHERE cp.enrollment_id = e.id) as completed_lessons,
            (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id) as total_lessons
     FROM enrollments e
     JOIN users u ON u.id = e.user_id
     JOIN courses c ON c.id = e.course_id
     WHERE c.instructor_id = $1
     ORDER BY e.enrolled_at DESC
     LIMIT 6`,
    [instructorId]
  );

  const recentStudents = recentStudentsRes.rows.map((r) => {
    const total = parseInt(r.total_lessons, 10) || 1;
    const completed = parseInt(r.completed_lessons, 10) || 0;
    const progressPct = Math.min(100, Math.round((completed / total) * 100));
    return {
      name: r.name || "Estudiante",
      course: r.course || "Curso",
      progress: `${progressPct}%`,
      status: r.status === "completed" || progressPct === 100 ? "Completado" : progressPct > 0 ? "Activo" : "En curso",
    };
  });

  // Calificación promedio y reseñas
  const reviewsStats = await pool.query(
    `SELECT AVG(rating)::numeric(10,1) as avg_rating, COUNT(*) as total_reviews 
     FROM reviews 
     WHERE course_id = ANY($1::int[])`,
    [courseIds]
  );
  const avgSatisfaction = reviewsStats.rows[0]?.avg_rating ? parseFloat(reviewsStats.rows[0].avg_rating) : 4.9;
  const totalReviews = parseInt(reviewsStats.rows[0]?.total_reviews || 0, 10);

  return {
    hasCourses: true,
    totalStudents,
    completionRate: `${completionRate}%`,
    totalStudyHours: `${Math.max(1, Math.round(totalStudents * 2.8))}h`,
    satisfactionRating: avgSatisfaction,
    totalReviews,
    courses: coursesRes.rows,
    recentStudents,
  };
};

/* ─────────────────────────────────────────
   GESTIÓN DE RESEÑAS / REVIEWS
───────────────────────────────────────── */
const crearOActualizarReview = async (courseId, userId, { rating, comment }) => {
  if (!rating || rating < 1 || rating > 5) {
    throw { status: 400, message: "La calificación debe estar entre 1 y 5 estrellas" };
  }

  // Verificar si ya existe una review previa de este usuario para este curso
  const checkExisting = await pool.query(
    `SELECT id FROM reviews WHERE course_id = $1 AND user_id = $2`,
    [courseId, userId]
  );

  if (checkExisting.rows.length > 0) {
    const updated = await pool.query(
      `UPDATE reviews 
       SET rating = $1, comment = $2, created_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [rating, comment || null, checkExisting.rows[0].id]
    );
    return updated.rows[0];
  } else {
    const inserted = await pool.query(
      `INSERT INTO reviews (course_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [courseId, userId, rating, comment || null]
    );
    return inserted.rows[0];
  }
};

const obtenerReviewsCurso = async (courseId) => {
  const res = await pool.query(
    `SELECT r.*, u.name as user_name 
     FROM reviews r 
     JOIN users u ON u.id = r.user_id 
     WHERE r.course_id = $1 
     ORDER BY r.created_at DESC`,
    [courseId]
  );
  const stats = await pool.query(
    `SELECT AVG(rating)::numeric(10,1) as avg_rating, COUNT(*) as total_reviews 
     FROM reviews 
     WHERE course_id = $1`,
    [courseId]
  );
  return {
    reviews: res.rows,
    averageRating: stats.rows[0]?.avg_rating ? parseFloat(stats.rows[0].avg_rating) : 5.0,
    totalReviews: parseInt(stats.rows[0]?.total_reviews || 0, 10),
  };
};

module.exports = {
  crearCurso,
  listarCursos,
  obtenerCursoPorId,
  listarCursosPorInstructor,
  actualizarCurso,
  eliminarCurso,
  obtenerAnaliticasInstructor,
  crearOActualizarReview,
  obtenerReviewsCurso,
};
