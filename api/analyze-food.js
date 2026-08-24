import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Permitir imágenes grandes
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ success: false, error: 'No image provided' });
  }

  // Verificar que la clave API esté configurada
  if (!process.env.GEMINI_API_KEY) {
    console.error('Missing GEMINI_API_KEY environment variable');
    return res.status(500).json({ 
      success: false, 
      error: 'La API Key de Gemini no está configurada en el servidor.' 
    });
  }

  try {
    // Limpiar el prefijo Base64 si viene con "data:image/jpeg;base64,"
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Inicializar el SDK de Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Definir el prompt estructurado para forzar un formato JSON estricto
    const prompt = `
      Eres un experto nutricionista virtual de alto nivel. Analiza la siguiente imagen de comida con mucho detalle.
      Identifica qué platillo es, desglosa meticulosamente cada uno de sus componentes o ingredientes principales, y estima de forma realista las calorías para CADA ingrediente por separado, basándote en la porción visualizada.

      DEBES responder ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional antes ni después.
      Usa exactamente esta estructura:
      {
        "name": "Nombre detallado del platillo",
        "ingredients": [
          { "name": "Ingrediente 1 (ej. 150g de Pechuga de Pollo)", "calories": 240 },
          { "name": "Ingrediente 2 (ej. 1 taza de Arroz blanco)", "calories": 200 }
        ],
        "calories": 440,
        "isHealthy": true,
        "feedback": "Un mensaje profesional, alentador y con un tip nutricional sobre esta comida."
      }
    `;

    // Llamar al modelo gemini-3.6-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        }
      ]
    });

    // Extraer y parsear la respuesta
    const rawText = response.text;
    
    // Limpiar posibles bloques markdown (```json ... ```) si el modelo ignora la instrucción
    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const resultData = JSON.parse(cleanJsonText);

    return res.status(200).json({
      success: true,
      data: resultData
    });

  } catch (error) {
    console.error('Error in analyze-food API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Hubo un error analizando la imagen. ' + (error.message || 'Error desconocido')
    });
  }
}
