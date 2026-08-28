/**
 * /api/pull.js — Vercel Serverless Function
 *
 * Calcula el premio del gacha de forma segura en el servidor.
 * Catálogo sincronizado al 100% con src/data/prizes.js.
 */

// --- Catálogo de premios idéntico al frontend ---
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
      name: 'Jugar algo que yo quiera',
      description: 'Jugamos a lo que yo decida',
      emoji: '🎮',
    },
    {
      id: 'c3',
      name: 'No ganaste nada',
      description: 'Suerte para la próxima',
      emoji: '😢',
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
      description: 'Lo que quieras',
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
 * Común:      70%
 * Raro:       25%
 * Legendario:  5%
 */
const DROP_RATES = [
  { rarity: 'common', threshold: 0.70 },
  { rarity: 'rare', threshold: 0.95 },
  { rarity: 'legendary', threshold: 1.00 },
];

function determineRarity(roll) {
  for (const { rarity, threshold } of DROP_RATES) {
    if (roll < threshold) {
      return rarity;
    }
  }
  return 'common';
}

function selectPrize(rarity) {
  const pool = prizes[rarity];
  if (!pool || pool.length === 0) {
    throw new Error(`No prizes available for rarity: ${rarity}`);
  }
  const index = Math.floor(Math.random() * pool.length);
  return { ...pool[index] };
}

function generatePullId() {
  return `pull_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    const roll = Math.random();
    const rarity = determineRarity(roll);
    const prize = selectPrize(rarity);

    const result = {
      pullId: generatePullId(),
      rarity,
      prize: {
        ...prize,
        rarity,
      },
      timestamp: new Date().toISOString(),
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
