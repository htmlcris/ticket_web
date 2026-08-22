/**
 * /api/pull.js — Vercel Serverless Function
 *
 * Calcula el premio del gacha de forma segura en el servidor.
 * El cálculo de probabilidades ocurre aquí para evitar manipulación
 * desde el frontend.
 *
 * POST /api/pull
 * Response: { success, prize: { id, name, description, emoji, rarity, timestamp } }
 */

// --- Catálogo de premios (duplicado del frontend para independencia del backend) ---
const prizes = {
  common: [
    {
      id: 'c1',
      name: 'Una cartita hecha a mano',
      description: 'Hecha a mano con mucho cariño',
      emoji: '💌',
    },
    {
      id: 'c2',
      name: '5 fotos suyas',
      description: 'De lo que sea',
      emoji: '📸',
    },
    {
      id: 'c3',
      name: 'Jugar algo que yo quiera',
      description: 'Jugamos a lo que yo decida',
      emoji: '🎮',
    },
    {
      id: 'c4',
      name: 'No ganaste nada',
      description: 'Suerte para la próxima',
      emoji: '😢',
    },
    {
      id: 'c5',
      name: 'No ganaste nada',
      description: 'Suerte para la próxima',
      emoji: '😢',
    },
    {
      id: 'c6',
      name: 'No ganaste nada',
      description: 'Suerte para la próxima',
      emoji: '😢',
    },
  ],

  rare: [
    {
      id: 'r1',
      name: 'Venir a mi casa (solo unas horas)',
      description: 'Debe cumplir en un plazo de máximo una semana',
      emoji: '🏠',
    },
    {
      id: 'r2',
      name: 'Ver dos cap de supernatural',
      description: 'Reclamable en un plazo de una semana',
      emoji: '👻',
    },
    {
      id: 'r3',
      name: 'Fotos exclusivas',
      description: 'Su vrg, su carita, su abdomen, lo que sea',
      emoji: '🔥',
    },
  ],

  legendary: [
    {
      id: 'l1',
      name: 'Venir a mi casa (quedarse a dormir)',
      description: 'Debe cumplir en un plazo de máximo una semana',
      emoji: '🌙',
    },
  ],
};

/**
 * Drop rates (probabilidades acumuladas).
 * La suma DEBE ser exactamente 1.0.
 *
 * Común:      70%
 * Raro:       25%
 * Legendario:  5%
 */
const DROP_RATES = [
  { rarity: 'common', threshold: 0.70 },
  { rarity: 'rare', threshold: 0.95 },    // 0.70 + 0.25
  { rarity: 'legendary', threshold: 1.00 }, // 0.95 + 0.05
];

/**
 * Determina la rareza basándose en un número aleatorio (0-1).
 * Recorre los umbrales acumulados y retorna la primera rareza
 * cuyo umbral supere el valor dado.
 *
 * @param {number} roll - Número aleatorio entre 0 y 1
 * @returns {string} Rareza seleccionada
 */
function determineRarity(roll) {
  for (const { rarity, threshold } of DROP_RATES) {
    if (roll < threshold) {
      return rarity;
    }
  }
  // Fallback de seguridad
  return 'common';
}

/**
 * Selecciona un premio aleatorio dentro de la rareza indicada.
 *
 * @param {string} rarity - La rareza del premio
 * @returns {object} Premio seleccionado con metadata
 */
function selectPrize(rarity) {
  const pool = prizes[rarity];
  if (!pool || pool.length === 0) {
    throw new Error(`No prizes available for rarity: ${rarity}`);
  }
  const index = Math.floor(Math.random() * pool.length);
  return { ...pool[index] };
}

/**
 * Genera un ID único para la instancia del premio obtenido.
 * Combina timestamp + random para evitar colisiones.
 */
function generatePullId() {
  return `pull_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// --- Handler principal ---
export default function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    // 1. Generar número aleatorio para determinar rareza
    const roll = Math.random();

    // 2. Determinar la rareza
    const rarity = determineRarity(roll);

    // 3. Seleccionar un premio aleatorio de esa rareza
    const prize = selectPrize(rarity);

    // 4. Construir respuesta con metadata
    const result = {
      pullId: generatePullId(),
      rarity,
      prize: {
        ...prize,
        rarity,
      },
      timestamp: new Date().toISOString(),
      // Debug info (se puede quitar en producción)
      _debug: {
        roll: roll.toFixed(4),
        rarity,
      },
    };

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error in /api/pull:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
