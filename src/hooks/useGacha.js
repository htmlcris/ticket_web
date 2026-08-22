/**
 * useGacha.js — Hook principal para la lógica del gacha.
 *
 * Gestiona los estados de la tirada:
 * idle → pulling (wheel spins with result known) → revealing → idle
 *
 * El resultado se calcula ANTES de la animación para que la ruleta
 * pueda aterrizar en el premio correcto.
 */

import { useState, useCallback, useRef } from 'react';
import { pullGacha } from '../services/gachaService';
import storageService from '../services/storageService';

export const GACHA_STATES = {
  IDLE: 'idle',
  PULLING: 'pulling',
  REVEALING: 'revealing',
};

export function useGacha() {
  const [state, setState] = useState(GACHA_STATES.IDLE);
  const [result, setResult] = useState(null);
  const [pullCount, setPullCount] = useState(() => storageService.getPullCount());
  const revealTimerRef = useRef(null);

  /**
   * Ejecuta una tirada:
   * 1. Calcula el resultado (API/fallback)
   * 2. Cambia a PULLING con el resultado disponible (para que la ruleta gire al premio)
   * 3. Después de que la ruleta termina de girar (~5s), cambia a REVEALING
   */
  const pull = useCallback(async (onResult) => {
    if (state !== GACHA_STATES.IDLE) return;

    try {
      // Calcular el resultado ANTES de empezar la animación
      const pullResult = await pullGacha();

      // Actualizar contador
      const newCount = storageService.incrementPullCount();
      setPullCount(newCount);

      // Guardar resultado y empezar animación de ruleta
      setResult(pullResult);
      setState(GACHA_STATES.PULLING);

      // Callback para agregar al inventario
      if (onResult) {
        onResult(pullResult);
      }

      // Después de que la ruleta termine de girar, mostrar el reveal
      // La duración debe coincidir con la transición de la ruleta (~5s)
      revealTimerRef.current = setTimeout(() => {
        setState(GACHA_STATES.REVEALING);
      }, 5500);

      return pullResult;
    } catch (error) {
      console.error('[useGacha] Error during pull:', error);
      setState(GACHA_STATES.IDLE);
      throw error;
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(GACHA_STATES.IDLE);
    setResult(null);
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
    }
  }, []);

  return {
    state,
    isPulling: state === GACHA_STATES.PULLING,
    isRevealing: state === GACHA_STATES.REVEALING,
    isIdle: state === GACHA_STATES.IDLE,
    result,
    pullCount,
    pull,
    reset,
  };
}
