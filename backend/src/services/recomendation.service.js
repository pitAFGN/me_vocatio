const { OpenAI } = require("openai");
const pool = require("../config/db");

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
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 2. Generar test dinámico usando Groq Cloud
const generarTestConGroq = async (professionTitle, professionArea) => {
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

  return JSON.parse(rawContent);
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
      model: "llama-3.3-70b-versatile", // 👈 Cambia esto por el modelo que estés usando (ej: "llama3-8b-8192" si estás ruteando hacia Groq)
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
  generarYGuardarBloque
};