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

  return resultado.rows[0];
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

module.exports = {
  crearCurso,
  listarCursos,
  obtenerCursoPorId,
  listarCursosPorInstructor,
  actualizarCurso,
  eliminarCurso,
};
