const pool = require("../config/db");
const { enviarCursoAprobado, enviarCursoRechazado } = require("../services/email.service");

const estadoLegible = (status) => {
  if (status === "activo" || status === "published") return "Activo";
  if (status === "revision") return "En revisión";
  if (status === "rechazado") return "Rechazado";
  if (status === "inactivo") return "Inactivo";
  return "Borrador";
};

const getStats = async (req, res) => {
  try {
    const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users");
    const premiumUsersResult = await pool.query("SELECT COUNT(*) FROM users WHERE plan = 'premium'");
    const verifiedUsersResult = await pool.query("SELECT COUNT(*) FROM users WHERE email_verified = true");
    
    // Obtener el total de peticiones de IA hechas hoy sumando los contadores diarios
    const aiRequestsResult = await pool.query(
      "SELECT SUM(daily_ai_requests) FROM users WHERE last_ai_request_date = CURRENT_DATE"
    );

    const stats = {
      totalUsers: parseInt(totalUsersResult.rows[0].count, 10) || 0,
      premiumUsers: parseInt(premiumUsersResult.rows[0].count, 10) || 0,
      verifiedUsers: parseInt(verifiedUsersResult.rows[0].count, 10) || 0,
      aiRequestsToday: parseInt(aiRequestsResult.rows[0].sum, 10) || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getResources = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      WHERE c.status <> 'rechazado'
      ORDER BY c.created_at DESC
    `);
    // Mapear los nombres de columnas para que encajen con la tabla del frontend
    const mappedData = result.rows.map(course => ({
      id: course.id,
      titulo: course.title,
      vocacion: course.category,
      estado: estadoLegible(course.status),
      status: course.status,
      rejection_reason: course.rejection_reason || null,
      instructor_name: course.instructor_name || 'Desconocido'
    }));

    res.json({ success: true, data: mappedData });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error interno al obtener recursos" });
  }
};

const updateResource = async (req, res) => {
  const { id } = req.params;
  const { title, category, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses 
       SET title = COALESCE($1, title),
           category = COALESCE($2, category),
           status = COALESCE($3, status),
           updated_at = NOW()
       WHERE id = $4 
       RETURNING *`,
      [title, category, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    res.json({ success: true, message: "Recurso actualizado correctamente", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(500).json({ error: "Error interno al actualizar el recurso" });
  }
};

const deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM courses WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }
    res.json({ success: true, message: "Recurso eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Error interno al eliminar el recurso" });
  }
};

const aprobarCurso = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  if (!Number.isInteger(courseId) || courseId <= 0 || courseId > 2147483647) {
    return res.status(400).json({ error: "Identificador de curso inválido" });
  }

  try {
    const result = await pool.query(
      `UPDATE courses SET status = 'activo', rejection_reason = NULL, approved_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }

    const curso = result.rows[0];
    const instructorRes = await pool.query("SELECT name, email FROM users WHERE id = $1", [curso.instructor_id]);
    const instructor = instructorRes.rows[0];

    if (instructor) {
      await enviarCursoAprobado({
        to: instructor.email,
        name: instructor.name,
        courseTitle: curso.title,
        courseId: curso.id,
      });
    }

    res.json({ success: true, message: "Curso aprobado y publicado correctamente", data: curso });
  } catch (error) {
    console.error("Error approving course:", error);
    res.status(500).json({ error: "Error interno al aprobar el curso" });
  }
};

const rechazarCurso = async (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  if (!Number.isInteger(courseId) || courseId <= 0 || courseId > 2147483647) {
    return res.status(400).json({ error: "Identificador de curso inválido" });
  }

  const { motivo } = req.body;
  if (motivo !== undefined && (typeof motivo !== "string" || motivo.trim().length > 1000)) {
    return res.status(400).json({ error: "El motivo debe ser un texto de máximo 1000 caracteres" });
  }
  const motivoFinal = typeof motivo === "string" && motivo.trim() ? motivo.trim() : null;

  try {
    const result = await pool.query(
      `UPDATE courses SET status = 'rechazado', rejection_reason = $2, approved_at = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [courseId, motivoFinal]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recurso no encontrado" });
    }

    const curso = result.rows[0];
    const instructorRes = await pool.query("SELECT name, email FROM users WHERE id = $1", [curso.instructor_id]);
    const instructor = instructorRes.rows[0];

    if (instructor) {
      await enviarCursoRechazado({
        to: instructor.email,
        name: instructor.name,
        courseTitle: curso.title,
        courseId: curso.id,
        motivo: motivoFinal || "El curso no cumplió con los requisitos de la revisión editorial.",
      });
    }

    res.json({ success: true, message: "Curso rechazado. Se notificó al autor por correo.", data: curso });
  } catch (error) {
    console.error("Error rejecting course:", error);
    res.status(500).json({ error: "Error interno al rechazar el curso" });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, plan, role, email_verified, xp, level, current_streak, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error interno al obtener usuarios" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { plan, level, role } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users 
       SET plan = COALESCE($1, plan),
           level = COALESCE($2, level),
           role = COALESCE($3, role)
       WHERE id = $4 
       RETURNING id, name, email, plan, role, level`,
      [plan, level, role, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ success: true, message: "Usuario actualizado correctamente", data: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error interno al actualizar usuario" });
  }
};

const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Usuarios registrados en los últimos 7 días
    const usersByDayResult = await pool.query(`
      SELECT TO_CHAR(DATE(created_at), 'Mon DD') as date, COUNT(*)::int as count 
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '7 days' 
      GROUP BY DATE(created_at) 
      ORDER BY DATE(created_at) ASC
    `);

    // 2. Distribución de Cursos por Categoría
    const coursesByCategoryResult = await pool.query(`
      SELECT category as name, COUNT(*)::int as value 
      FROM courses 
      GROUP BY category
    `);

    // 3. Distribución de Planes
    const plansResult = await pool.query(`
      SELECT plan as name, COUNT(*)::int as value 
      FROM users 
      GROUP BY plan
    `);

    res.json({
      success: true,
      data: {
        usersByDay: usersByDayResult.rows,
        coursesByCategory: coursesByCategoryResult.rows,
        plansDistribution: plansResult.rows
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Error interno al obtener métricas del dashboard" });
  }
};

const getPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.reference, p.wompi_transaction_id, p.amount, p.currency, p.status, p.created_at, p.concept,
             u.email, u.name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Error interno al obtener pagos" });
  }
};

module.exports = {
  getStats,
  getResources,
  updateResource,
  deleteResource,
  aprobarCurso,
  rechazarCurso,
  getUsers,
  updateUser,
  getDashboardMetrics,
  getPayments
};
