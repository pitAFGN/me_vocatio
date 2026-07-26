const { GoogleGenAI } = require('@google/genai');
require('dotenv').config(); // Carga las variables de tu .env

async function probarConexion() {
    console.log("🔄 Conectando con Gemini...");
    
    // Le pasamos un objeto vacío de opciones para que no falle al buscar 'project',
    // o le pasamos la API key directamente leyendo el .env
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Hola Gemini, estoy configurando el backend en Node.js para meVocatio. ¿Me escuchas bien?',
        });

        console.log("\n✅ ¡Conexión exitosa! Respuesta de la IA:");
        console.log("-".repeat(50));
        console.log(response.text);
        console.log("-".repeat(50));
    } catch (error) {
        console.error("\n❌ Hubo un error en la conexión:");
        console.error(error);
    }
}

probarConexion();