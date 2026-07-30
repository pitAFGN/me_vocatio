const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/test/generar:
 *   post:
 *     summary: Genera el test dinámico de 10 preguntas usando Groq Cloud
 */
router.post("/generar", async (req, res) => {
  try {
    console.log("Body recibido en /api/test/generar:", req.body);

    const profesion_title = req.body?.profesion_title || "Ingeniería de Software";
    const profesion_area = req.body?.profesion_area || "Tecnología";

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("ERROR: GROQ_API_KEY no definida en el .env");
      return res.status(500).json({ error: "Falta configurar GROQ_API_KEY en el servidor" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Eres un evaluador técnico experto. Responde ÚNICA Y EXCLUSIVAMENTE con un objeto JSON válido."
          },
          {
            role: "user",
            content: `Genera un test de 10 preguntas de opción múltiple para evaluar el nivel en: "${profesion_title}" (Área: "${profesion_area}").

Estructura JSON requerida:
{
  "profesion": "${profesion_title}",
  "preguntas": [
    {
      "id": 1,
      "enunciado": "Pregunta...",
      "dificultad": "Principiante",
      "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "opcion_correcta_idx": 0,
      "puntos": 1
    }
  ]
}

Requisitos obligatorios: Genera exactamente 10 preguntas compuestas por 3 de nivel 'Principiante', 4 de nivel 'Intermedio' y 3 de nivel 'Avanzado'. Cada pregunta debe tener exactamente 4 opciones de respuesta.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error desde la API de Groq:", response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    let rawContent = data.choices[0]?.message?.content || "";

    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }

    const testGenerado = JSON.parse(rawContent);

    return res.json({
      exito: true,
      data: testGenerado
    });

  } catch (error) {
    console.error("Error interno al generar el test:", error);
    return res.status(500).json({ error: "Error interno en el servidor" });
  }
});

/**
 * @swagger
 * /api/test/evaluar:
 *   post:
 *     summary: Recibe las respuestas y procesa la evaluación del usuario
 */
router.post("/evaluar", async (req, res) => {
  try {
    const { usuario_id, profesion_id, respuestas } = req.body;

    console.log("Evaluación recibida:", { usuario_id, profesion_id, respuestas });

    const totalRespuestas = respuestas?.length || 0;

    return res.json({
      exito: true,
      resultado: {
        usuario_id,
        profesion_id,
        puntaje: totalRespuestas,
        nivel: "Intermedio"
      }
    });

  } catch (error) {
    console.error("Error al evaluar el test:", error);
    return res.status(500).json({ error: "Error interno al evaluar el test" });
  }
});

module.exports = router;