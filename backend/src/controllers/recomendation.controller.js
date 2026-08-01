const recomendationService = require("../services/recomendation.service");
const jwt = require("jsonwebtoken"); // 👈 1. Asegúrate de importar jsonwebtoken

const generarTest = async (req, res) => {
  const profesion_title = req.body?.profesion_title || "Ingeniería de Software";
  const profesion_area = req.body?.profesion_area || "Tecnología";

  try {
    const testGenerado = await recomendationService.generarTestConGroq(profesion_title, profesion_area);
    res.json({
      exito: true,
      data: testGenerado
    });
  } catch (error) {
    console.error("Error al generar el test con Groq:", error);
    res.status(error.status || 500).json({ error: error.message || "Error interno al generar el test" });
  }
};

const evaluar = async (req, res) => {
  // 👈 2. Ya no destructuramos user_id del body, sino que leemos el token
  const { profesion_title, level, respuestas } = req.body;

  try {
    // 🔑 Extraemos el token del header Authorization (Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ exito: false, error: "No hay token de autenticación proporcionado." });
    }

    // Decodificamos el token para obtener el ID real del usuario firmado
    const SECRET = process.env.SECRET || 'mevocatio_secret'; // Usa la misma variable secreta de tu login
    const decoded = jwt.verify(token, SECRET);
    const user_id = decoded.id; // ¡Este es el ID real del usuario logueado!

    // Guarda la evaluación en la base de datos de Neon y devuelve el ID
    const resultadoEval = await recomendationService.guardarEvaluacion(user_id, profesion_title, level);
    
    res.status(201).json({
      exito: true,
      evaluation_id: resultadoEval.id,
      resultado: {
        usuario_id: resultadoEval.user_id,
        profesion_title: resultadoEval.profession_title,
        nivel: resultadoEval.level,
        puntaje: respuestas?.length || 0
      }
    });
  } catch (error) {
    console.error("Error al evaluar el test:", error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: "Token inválido o expirado." });
    }
    res.status(500).json({ error: "Error interno al evaluar el test" });
  }
};

const recomendar = async (req, res) => {
  const { evaluation_id, vocation, nivel, evitarUrls } = req.body;

  try {
    const aiResponse = await recomendationService.generarYGuardarBloque(evaluation_id, vocation, nivel, evitarUrls);
    res.json(aiResponse);
  } catch (error) {
    console.error("Error en recomendación:", error);
    res.status(500).json({ error: "Error interno al generar recomendaciones" });
  }
};

module.exports = {
  generarTest,
  evaluar,
  recomendar
};