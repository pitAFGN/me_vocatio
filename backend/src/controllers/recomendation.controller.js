const recomendationService = require("../services/recomendation.service");
const generarTest = async (req, res) => {
  const profesion_title = req.body?.profesion_title;
  const profesion_area = req.body?.profesion_area;

  if (!profesion_title || !profesion_area) {
    return res.status(400).json({ error: "La profesión y el área son obligatorias" });
  }

  try {
    const testGenerado = await recomendationService.generarTestConGroq(profesion_title, profesion_area, req.user.id);
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
  const { test_id, respuestas } = req.body;

  if (!test_id || !Array.isArray(respuestas)) {
    return res.status(400).json({ exito: false, error: "test_id y respuestas son obligatorios" });
  }

  try {
    const resultadoEval = await recomendationService.evaluarTest(test_id, req.user.id, respuestas);
    res.status(201).json({
      exito: true,
      ...resultadoEval
    });
  } catch (error) {
    console.error("Error al evaluar el test:", error);
    res.status(error.status || 500).json({ error: error.message || "Error interno al evaluar el test" });
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

const analizarRecurso = async (req, res) => {
  const { titulo, tipo, plataforma, url, descripcion, vocation, nivel, pregunta_usuario } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: "El título del recurso es obligatorio" });
  }

  try {
    const analisis = await recomendationService.analizarRecursoConIA({
      titulo,
      tipo,
      plataforma,
      url,
      descripcion,
      vocation,
      nivel,
      pregunta_usuario
    });
    res.json({
      exito: true,
      data: analisis
    });
  } catch (error) {
    console.error("Error al analizar recurso con IA:", error);
    res.status(500).json({ error: "Error al generar análisis con IA" });
  }
};

module.exports = {
  generarTest,
  evaluar,
  recomendar,
  analizarRecurso
};