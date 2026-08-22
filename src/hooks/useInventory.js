/**
 * useInventory.js — Hook para gestión del inventario de premios.
 *
 * Maneja el estado del inventario (CRUD), estadísticas por rareza,
 * y sincronización con el servicio de persistencia.
 *
 * Uso:
 *   const { inventory, addPrize, removePrize, stats } = useInventory();
 */

import { useState, useCallback, useMemo } from 'react';
import storageService from '../services/storageService';
import { RARITY_ORDER } from '../utils/rarityConfig';

export function useInventory() {
  const [inventory, setInventory] = useState(() => storageService.getInventory());

  /**
   * Agrega un premio al inventario y persiste.
   * @param {object} pullResult - Resultado completo de la tirada (con pullId, prize, rarity, timestamp)
   */
  const addPrize = useCallback((pullResult) => {
    setInventory((prev) => {
      const entry = {
        pullId: pullResult.pullId,
        ...pullResult.prize,
        rarity: pullResult.rarity,
        obtainedAt: pullResult.timestamp,
      };
      const updated = [entry, ...prev];
      storageService.saveInventory(updated);
      return updated;
    });
  }, []);

  /**
   * Elimina un premio del inventario por pullId.
   * @param {string} pullId
   */
  const removePrize = useCallback((pullId) => {
    setInventory((prev) => {
      const updated = prev.filter((p) => p.pullId !== pullId);
      storageService.saveInventory(updated);
      return updated;
    });
  }, []);

  /**
   * Filtra premios por rareza.
   * @param {string} rarity
   * @returns {Array<object>}
   */
  const getByRarity = useCallback(
    (rarity) => inventory.filter((p) => p.rarity === rarity),
    [inventory]
  );

  /**
   * Estadísticas del inventario.
   */
  const stats = useMemo(() => {
    const counts = { common: 0, rare: 0, legendary: 0, total: inventory.length };
    inventory.forEach((p) => {
      if (counts[p.rarity] !== undefined) {
        counts[p.rarity]++;
      }
    });
    return counts;
  }, [inventory]);

  /**
   * Limpia todo el inventario.
   */
  const clearInventory = useCallback(() => {
    setInventory([]);
    storageService.saveInventory([]);
  }, []);

  return {
    inventory,
    addPrize,
    removePrize,
    getByRarity,
    stats,
    clearInventory,
  };
}
