/**
 * /api/redeem.js
 *
 * Endpoint para marcar un premio como cumplido (redimido).
 * - PATCH: Recibe { pullId } y actualiza ese item del inventario con redeemed=true
 */

import Redis from 'ioredis';

const getRedisClient = () => {
  const url = process.env.REDIS_URL || process.env.KV_REST_API_URL || process.env.STORAGE_URL;
  if (!url) return null;
  return new Redis(url);
};

const redis = getRedisClient();
const STATE_KEY = 'gacha_global_state';

export default async function handler(req, res) {
  if (!redis) {
    return res.status(500).json({ success: false, error: 'No Redis URL provided.' });
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use PATCH.' });
  }

  try {
    const { pullId } = req.body;

    if (!pullId) {
      return res.status(400).json({ success: false, error: 'pullId is required.' });
    }

    // Leer estado actual
    const stateStr = await redis.get(STATE_KEY);
    if (!stateStr) {
      return res.status(404).json({ success: false, error: 'No state found in database.' });
    }

    const state = JSON.parse(stateStr);
    const inventoryKey = 'gacha_cosmico_inventory';
    const inventory = state[inventoryKey] || [];

    // Encontrar el premio y marcarlo como cumplido
    const prizeIndex = inventory.findIndex((p) => p.pullId === pullId);
    if (prizeIndex === -1) {
      return res.status(404).json({ success: false, error: `Prize with pullId "${pullId}" not found.` });
    }

    inventory[prizeIndex] = {
      ...inventory[prizeIndex],
      redeemed: true,
      redeemedAt: new Date().toISOString(),
    };

    state[inventoryKey] = inventory;

    // Guardar estado actualizado
    await redis.set(STATE_KEY, JSON.stringify(state));

    return res.status(200).json({ success: true, prize: inventory[prizeIndex] });

  } catch (error) {
    console.error('Error in /api/redeem:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
