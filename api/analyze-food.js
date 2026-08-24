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
      Eres un experto nutricionista virtual. Analiza la siguiente imagen de comida.
      Identifica qué platillo es, sus ingredientes principales, y haz una estimación realista de sus calorías totales basándote en la porción visualizada.

      DEBES responder ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional antes ni después.
      Usa exactamente esta estructura:
      {
        "name": "Nombre del platillo detectado",
        "ingredients": ["Ingrediente 1", "Ingrediente 2", ...],
        "calories": 450,
        "isHealthy": true,
        "feedback": "Un mensaje corto, amigable y motivador sobre la comida (ej. '¡Se ve delicioso y lleno de proteína!')."
      }
    `;

    // Llamar al modelo gemini-1.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
