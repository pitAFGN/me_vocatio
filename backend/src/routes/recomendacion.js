const { Router } = require('express');
const OpenAI = require('openai');
const djson = require('dirty-json');

const router = Router();

// Inicializamos Groq con su cliente oficial
const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1"
});

router.post('/recomendar', async (req, res) => {
  try {
    const { vocacion, nivel, evitarUrls } = req.body;

    if (!vocacion) {
      return res.status(400).json({ error: "La vocación es requerida." });
    }

    const urlsAExcluirTexto = evitarUrls && evitarUrls.length > 0 
      ? evitarUrls.map(url => `- ${url}`).join('\n')
      : "Ninguna.";

    // PROMPT TEXTO PLANO: Le exigimos el formato envuelto en bloques de markdown estables
    const prompt = `Genera una ruta de aprendizaje estructurada para la vocación: "${vocacion}" y nivel de conocimiento: "${nivel}".

RECURSOS QUE NO DEBES REPETIR BAJO NINGUNA CIRCUNSTANCIA:
${urlsAExcluirTexto}

REGLAS DE CONTENIDO OBLIGATORIAS:
1. Concéntrate UNICAMENTE en sitios web formales de lectura, documentación técnica oficial y plataformas de cursos interactivos (ej. khanacademy.org, freecodecamp.org, coursera.org, edx.org, developer.mozilla.org, w3schools.com, wikipedia.org).
2. Está TERMINANTEMENTE PROHIBIDO incluir videos de YouTube, listas de reproducción, canales o enlaces que contengan "youtube.com" o "youtu.be".

Devuelve tu respuesta EXACTAMENTE dentro de un bloque de código JSON con esta estructura limpia:

\`\`\`json
{
  "resumen_enfoque": "Escribe una introducción teórica y consejos clave adaptados al nivel (2 a 3 frases).",
  "materiales": [
    {
      "titulo": "Nombre oficial del recurso, libro o documentación",
      "descripcion": "Breve descripción de lo que el usuario va a leer o practicar en este sitio.",
      "url": "URL real y directa al sitio web o plataforma",
      "tipo": "CURSO"
    }
  ]
}
\`\`\`

Valores válidos para el campo "tipo": CURSO, ARTICULO, DOCUMENTACION o HERRAMIENTA. Genera exactamente entre 6 y 10 elementos únicos.`;

    // Consultamos a Groq sin forzar response_format para evitar bloqueos del proxy de Cloudflare
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: "You are an automated backend model. You strictly output learning paths wrapped inside standard \`\`\`json ... \`\`\` markdown blocks. Never use video recommendations." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.4 // Baja temperatura para asegurar obediencia en las reglas
    });

    let rawText = response.choices[0].message.content;

    // Extraemos de forma segura el texto encerrado en las etiquetas de bloque de código json
    const jsonMatch = rawText.match(/```json([\s\S]*?)```/) || rawText.match(/```([\s\S]*?)```/);
    let jsonString = jsonMatch ? jsonMatch[1].trim() : rawText.trim();

    // Procesamos y reparamos automáticamente cualquier comilla suelta o salto extraño usando dirty-json
    let dataJSON;
    try {
      dataJSON = djson.parse(jsonString);
    } catch (parseError) {
      console.error("Error crítico de análisis de JSON de Groq:", parseError);
      return res.status(500).json({ error: "La IA devolvió un formato ilegible. Por favor, reintenta." });
    }

    // PURGA ABSOLUTA: Filtro manual en el backend para erradicar cualquier video colado de la IA
    if (dataJSON.materiales && Array.isArray(dataJSON.materiales)) {
      dataJSON.materiales = dataJSON.materiales.filter(material => {
        const url = (material.url || '').toLowerCase();
        const tipo = (material.tipo || '').toUpperCase();
        const titulo = (material.titulo || '').toLowerCase();
        
        const esVideoSospechoso = url.includes('youtube.com') || 
                                  url.includes('youtu.be') || 
                                  tipo === 'VIDEO' || 
                                  url.includes('dqw4w9wgxcq') || // Rick-roll filtrado
                                  titulo.includes('video tutorial') ||
                                  titulo.includes('podcast');
                                  
        return !esVideoSospechoso;
      });
    }

    // Respondemos con la estructura limpia requerida por el frontend
    return res.json({
      resumen_enfoque: dataJSON.resumen_enfoque || "Ruta de autoaprendizaje generada a tu medida.",
      materiales: dataJSON.materiales || []
    });

  } catch (error) {
    console.error("Error en el módulo de recomendación con Groq:", error);
    return res.status(500).json({ 
      error: "Ocurrió un error interno en el servidor al generar las recomendaciones." 
    });
  }
});

module.exports = router;