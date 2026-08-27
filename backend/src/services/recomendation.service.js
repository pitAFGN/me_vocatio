const { OpenAI } = require("openai");
const { randomUUID } = require("crypto");
const pool = require("../config/db");
const achievementService = require("./achievement.service");

// 1. Guardar la evaluación inicial del usuario en Neon
const guardarEvaluacion = async (userId, professionTitle, level) => {
  const query = `
    INSERT INTO evaluations (user_id, profession_title, level) 
    VALUES ($1, $2, $3) 
    RETURNING id, user_id, profession_title, level, created_at;
  `;
  const values = [userId || 1, professionTitle, level || 'Intermedio'];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// 2. Generar test dinámico usando Groq Cloud
const generarTestConGroq = async (professionTitle, professionArea, userId) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: "Falta configurar GROQ_API_KEY en el servidor" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Eres un evaluador técnico experto. Responde ÚNICA Y EXCLUSIVAMENTE con un objeto JSON válido."
        },
        {
          role: "user",
          content: `Genera un test de 10 preguntas de opción múltiple para evaluar el nivel en: "${professionTitle}" (Área: "${professionArea || 'Tecnología'}").

Estructura JSON requerida:
{
  "profesion": "${professionTitle}",
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
    throw { status: response.status, message: errorText };
  }

  const data = await response.json();
  let rawContent = data.choices[0]?.message?.content || "";

  if (rawContent.startsWith("```")) {
    rawContent = rawContent.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
  }

  const test = JSON.parse(rawContent);
  const preguntas = Array.isArray(test.preguntas) ? test.preguntas : [];

  if (preguntas.length !== 10 || preguntas.some((pregunta) => (
    !pregunta.id || !pregunta.enunciado || !Array.isArray(pregunta.opciones) ||
    pregunta.opciones.length !== 4 || !Number.isInteger(pregunta.opcion_correcta_idx) ||
    pregunta.opcion_correcta_idx < 0 || pregunta.opcion_correcta_idx > 3
  ))) {
    throw { status: 502, message: "La IA devolvió un test con formato inválido" };
  }

  const testId = randomUUID();
  await pool.query(
    `INSERT INTO diagnostic_tests (id, user_id, profession_title, questions, answer_key, expires_at)
     VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, NOW() + INTERVAL '30 minutes')`,
    [
      testId,
      userId,
      professionTitle,
      JSON.stringify(preguntas.map(({ opcion_correcta_idx, ...pregunta }) => pregunta)),
      JSON.stringify(preguntas.map(({ id, dificultad, opcion_correcta_idx, puntos = 1 }) => ({
        id, dificultad, opcion_correcta_idx, puntos
      })))
    ]
  );

  return {
    test_id: testId,
    profesion: professionTitle,
    preguntas: preguntas.map(({ opcion_correcta_idx, ...pregunta }) => pregunta)
  };
};

const evaluarTest = async (testId, userId, respuestas = []) => {
  const result = await pool.query(
    `SELECT profession_title, questions, answer_key
     FROM diagnostic_tests
     WHERE id = $1 AND user_id = $2 AND completed_at IS NULL AND expires_at > NOW()` ,
    [testId, userId]
  );

  if (result.rowCount === 0) {
    throw { status: 404, message: "El test no existe, expiró o ya fue completado" };
  }

  const { profession_title: professionTitle, questions, answer_key: answerKey } = result.rows[0];
  const respuestasMap = new Map(
    respuestas.map(({ pregunta_id, opcion_idx }) => [String(pregunta_id), Number(opcion_idx)])
  );
  let aciertos = 0;
  const porDificultad = { Principiante: { aciertos: 0, total: 0 }, Intermedio: { aciertos: 0, total: 0 }, Avanzado: { aciertos: 0, total: 0 } };

  for (const clave of answerKey) {
    const dificultad = porDificultad[clave.dificultad] || porDificultad.Intermedio;
    dificultad.total += 1;
    if (respuestasMap.get(String(clave.id)) === clave.opcion_correcta_idx) {
      aciertos += clave.puntos || 1;
      dificultad.aciertos += 1;
    }
  }

  const nivel = porDificultad.Avanzado.aciertos >= 2 &&
    porDificultad.Intermedio.aciertos >= 3 ? "Avanzado" :
    porDificultad.Intermedio.aciertos >= 3 ? "Intermedio" : "Principiante";
  const totalPuntos = answerKey.reduce((total, clave) => total + (clave.puntos || 1), 0);
  const puntaje = Math.round((aciertos / totalPuntos) * 100);
  const evaluation = await pool.query(
    `INSERT INTO evaluations (user_id, profession_title, level)
     VALUES ($1, $2, $3) RETURNING id, user_id, profession_title, level`,
    [userId, professionTitle, nivel]
  );
  await pool.query(
    `UPDATE diagnostic_tests SET completed_at = NOW(), evaluation_id = $1 WHERE id = $2`,
    [evaluation.rows[0].id, testId]
  );
  await achievementService.incrementarProgreso(userId, "diagnostics_completed");
  await achievementService.evaluarLogros(userId);

  return { evaluation_id: evaluation.rows[0].id, nivel, puntaje, total_preguntas: answerKey.length };
};

// 3. Generar y guardar bloques de recursos (IA)
const generarYGuardarBloque = async (evaluationId, vocation, nivel, evitarUrls = []) => {
  // 1. El prompt estricto exigiendo los 5 recursos
  const prompt = `
    Eres un experto en orientación profesional y educación tecnológica. Diseña un bloque de aprendizaje altamente recomendado para la carrera de ${vocation} en nivel ${nivel}.
    
    ${evitarUrls.length > 0 ? `REGLA ESTRICTA: NO debes incluir bajo ninguna circunstancia los siguientes enlaces (ya fueron vistos por el usuario): ${evitarUrls.join(', ')}.` : ''}
    
    INSTRUCCIÓN CRÍTICA: Debes generar EXACTAMENTE 5 recursos de aprendizaje distintos. Quiero una mezcla equilibrada (por ejemplo: 2 cursos, 1 libro/documentación, 1 video/canal de YouTube, 1 herramienta/ejercicio práctico).
    
    Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta. Asegúrate de que el arreglo "materiales" contenga exactamente 5 objetos:
    {
      "resumen_enfoque": "Breve párrafo motivacional y estratégico de máximo 3 líneas sobre el objetivo de este bloque de estudio.",
      "materiales": [
        { 
          "titulo": "Título del recurso 1", 
          "descripcion": "Descripción concisa de por qué es útil.", 
          "url": "https://enlace-real-y-valido.com/1", 
          "tipo": "Curso" 
        },
        { 
          "titulo": "Título del recurso 2", 
          "descripcion": "Descripción concisa de por qué es útil.", 
          "url": "https://enlace-real-y-valido.com/2", 
          "tipo": "Video" 
        },
        { 
          "titulo": "Título del recurso 3", 
          "descripcion": "Descripción concisa de por qué es útil.", 
          "url": "https://enlace-real-y-valido.com/3", 
          "tipo": "Libro" 
        },
        { 
          "titulo": "Título del recurso 4", 
          "descripcion": "Descripción concisa de por qué es útil.", 
          "url": "https://enlace-real-y-valido.com/4", 
          "tipo": "Documentación" 
        },
        { 
          "titulo": "Título del recurso 5", 
          "descripcion": "Descripción concisa de por qué es útil.", 
          "url": "https://enlace-real-y-valido.com/5", 
          "tipo": "Herramienta" 
        }
      ]
    }
  `;

  try {
    // 2. Usamos tu cliente openai en lugar de groq
    const response = await openai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" } // Obliga a la IA a responder con un JSON limpio
    });

    // 3. Procesamos la respuesta
    const aiResponse = JSON.parse(response.choices[0].message.content);
    return aiResponse;

  } catch (error) {
    console.error("Error al consultar a la IA de recursos:", error);
    throw new Error("No se pudo generar la recomendación con IA.");
  }
};

module.exports = {
  guardarEvaluacion,
  generarTestConGroq,
  evaluarTest,
  generarYGuardarBloque
};