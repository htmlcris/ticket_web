import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb', // Soporte amplio para imágenes procesadas
    },
  },
};

export default async function handler(req, res) {
  // Configurar cabeceras CORS básicas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body || {};

  if (!imageBase64) {
    return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen para analizar.' });
  }

  // Verificar que la clave API esté configurada
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY environment variable');
    return res.status(500).json({ 
      success: false, 
      error: 'La API Key de Gemini no está configurada en las variables de entorno de Vercel.' 
    });
  }

  try {
    // Detectar tipo MIME real (jpeg, png, webp)
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    // Limpiar el prefijo Base64
    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    // Inicializar el SDK oficial de Gemini
    const ai = new GoogleGenAI({ apiKey });

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

    // Lista de modelos candidatos con fallback automático en caso de incompatibilidad o cuota
    const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError = null;
    let rawText = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            prompt,
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        });

        if (response && response.text) {
          rawText = response.text;
          break; // Éxito con este modelo
        }
      } catch (err) {
        console.warn(`Intento con modelo ${modelName} falló:`, err.message);
        lastError = err;
      }
    }

    if (!rawText) {
      throw lastError || new Error('No se pudo generar respuesta de ningún modelo de IA.');
    }

    // Extraer bloque JSON seguro con regex
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('La IA no devolvió un formato JSON válido.');
    }

    const resultData = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      success: true,
      data: resultData
    });

  } catch (error) {
    console.error('Error in analyze-food API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Hubo un problema al procesar la imagen: ' + (error.message || 'Error desconocido')
    });
  }
}
