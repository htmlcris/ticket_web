/**
 * gachaService.js — Servicio de comunicación con la API del gacha.
 *
 * Abstrae la llamada al endpoint /api/pull.
 * En desarrollo local (sin Vercel), hace el cálculo client-side
 * como fallback para que la app funcione con `npm run dev`.
 */

import { prizes } from '../data/prizes';

/**
 * Drop rates para el fallback local.
 * Replicados del backend para mantener consistencia.
 */
const DROP_RATES = [
  { rarity: 'common', threshold: 0.70 },
  { rarity: 'rare', threshold: 0.95 },
  { rarity: 'legendary', threshold: 1.00 },
];

/**
 * Cálculo local de la tirada (fallback cuando la API no está disponible).
 * @returns {object} Resultado de la tirada
 */
function localPull() {
  const roll = Math.random();

  let rarity = 'common';
  for (const { rarity: r, threshold } of DROP_RATES) {
    if (roll < threshold) {
      rarity = r;
      break;
    }
  }

  const pool = prizes[rarity];
  const index = Math.floor(Math.random() * pool.length);
  const prize = { ...pool[index] };

  return {
    pullId: `pull_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    rarity,
    prize: { ...prize, rarity },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Ejecuta una tirada del gacha.
 *
 * Intenta llamar a la API del servidor primero.
 * Si falla (ej. en desarrollo local), usa el cálculo local.
 *
 * @returns {Promise<object>} Resultado de la tirada
 */
export async function pullGacha() {
  try {
    const response = await fetch('/api/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Unknown API error');
    }

    return {
      pullId: data.pullId,
      rarity: data.rarity,
      prize: data.prize,
      timestamp: data.timestamp,
    };
  } catch (error) {
    // Fallback a cálculo local (útil en desarrollo sin Vercel)
    console.info(
      '[GachaService] API no disponible, usando cálculo local:',
      error.message
    );
    return localPull();
  }
}
