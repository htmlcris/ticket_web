/**
 * rarityConfig.js — Configuración centralizada de rarezas.
 *
 * Define los drop rates, colores, labels y efectos visuales
 * asociados a cada nivel de rareza. Este archivo es la fuente
 * de verdad para toda la lógica visual y de probabilidades.
 */

export const RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  LEGENDARY: 'legendary',
};

/**
 * Configuración completa de cada rareza.
 * - rate: probabilidad acumulada (0-1). El sistema recorre en orden
 *   y selecciona la primera rareza cuyo umbral supere el random.
 * - label: nombre localizado para UI.
 * - colors: clases de Tailwind y valores hex para efectos dinámicos.
 * - glow: clase CSS de glow.
 * - stars: cantidad de estrellas visuales.
 * - flashColor: color del flash al revelar (rgba).
 * - particleColor: color de las partículas al revelar.
 */
export const rarityConfig = {
  [RARITY.COMMON]: {
    rate: 0.70,
    label: 'Común',
    labelEn: 'Common',
    stars: 1,
    colors: {
      primary: '#60a5fa',
      gradient: 'from-blue-400 to-cyan-400',
      text: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
      ring: 'ring-blue-400/30',
    },
    glow: 'glow-common',
    flashColor: 'rgba(96, 165, 250, 0.3)',
    particleColor: '#60a5fa',
    animationDuration: 2.5,
    revealScale: 1.0,
  },

  [RARITY.RARE]: {
    rate: 0.25,
    label: 'Raro',
    labelEn: 'Rare',
    stars: 2,
    colors: {
      primary: '#a855f7',
      gradient: 'from-purple-500 to-pink-500',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      ring: 'ring-purple-500/30',
    },
    glow: 'glow-rare',
    flashColor: 'rgba(168, 85, 247, 0.4)',
    particleColor: '#a855f7',
    animationDuration: 3.0,
    revealScale: 1.1,
  },

  [RARITY.LEGENDARY]: {
    rate: 0.05,
    label: 'Legendario',
    labelEn: 'Legendary',
    stars: 3,
    colors: {
      primary: '#fbbf24',
      gradient: 'from-amber-400 to-yellow-300',
      text: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
      ring: 'ring-amber-400/30',
    },
    glow: 'glow-legendary',
    flashColor: 'rgba(251, 191, 36, 0.5)',
    particleColor: '#fbbf24',
    animationDuration: 4.0,
    revealScale: 1.2,
  },
};

/**
 * Obtiene la configuración de una rareza por nombre.
 * @param {string} rarity - Nombre de la rareza (common | rare | legendary)
 * @returns {object} Configuración de la rareza
 */
export function getRarityConfig(rarity) {
  return rarityConfig[rarity] || rarityConfig[RARITY.COMMON];
}

/**
 * Lista ordenada de rarezas (de menor a mayor valor).
 */
export const RARITY_ORDER = [RARITY.COMMON, RARITY.RARE, RARITY.LEGENDARY];
