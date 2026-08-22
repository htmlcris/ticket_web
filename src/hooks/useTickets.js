/**
 * useTickets.js — Hook para gestión de tickets y actividades.
 *
 * Maneja:
 * - Tickets disponibles (ganar/gastar)
 * - Registro de actividades completadas hoy
 * - Reset diario automático
 * - Validación anti-exceso (1 ticket por actividad por día)
 *
 * Uso:
 *   const { tickets, activityLog, claimTicket, spendTicket, canClaim } = useTickets();
 */

import { useState, useCallback, useEffect } from 'react';
import storageService from '../services/storageService';

export function useTickets() {
  const [tickets, setTickets] = useState(() => storageService.getTickets());
  const [activityLog, setActivityLog] = useState(() => storageService.getActivityLog());

  /**
   * Al montar, verificar si es un nuevo día y resetear actividades.
   * Los tickets acumulados se mantienen.
   */
  useEffect(() => {
    const didReset = storageService.checkAndResetDaily();
    if (didReset) {
      setActivityLog([]);
      // Los tickets NO se resetean, solo las actividades
    }
  }, []);

  /**
   * Verifica si una actividad puede ser reclamada (no completada hoy).
   * @param {string} activityId
   * @returns {boolean}
   */
  const canClaim = useCallback(
    (activityId) => {
      return !activityLog.some((entry) => entry.activityId === activityId);
    },
    [activityLog]
  );

  /**
   * Reclama 1 ticket por completar una actividad con evidencia.
   * Valida que la actividad no haya sido completada hoy.
   *
   * @param {string} activityId - ID de la actividad
   * @param {string} photoBase64 - Foto de evidencia en base64
   * @returns {boolean} true si se reclamó exitosamente
   */
  const claimTicket = useCallback(
    (activityId, photoBase64) => {
      // Validación anti-exceso: no se puede reclamar dos veces
      if (!canClaim(activityId)) {
        console.warn(`[useTickets] Activity "${activityId}" already claimed today.`);
        return false;
      }

      if (!photoBase64) {
        console.warn('[useTickets] Photo evidence is required.');
        return false;
      }

      // Registrar actividad con evidencia
      const updatedLog = storageService.logActivity(activityId, photoBase64);
      setActivityLog(updatedLog);

      // Agregar 1 ticket
      const newTickets = storageService.addTicket();
      setTickets(newTickets);

      return true;
    },
    [canClaim]
  );

  /**
   * Gasta 1 ticket para la ruleta.
   * @returns {boolean} true si se pudo gastar, false si no hay tickets
   */
  const spendTicket = useCallback(() => {
    if (tickets <= 0) return false;

    const success = storageService.spendTicket();
    if (success) {
      setTickets((prev) => prev - 1);
    }
    return success;
  }, [tickets]);

  /**
   * Obtiene la entrada de evidencia de una actividad específica.
   * @param {string} activityId
   * @returns {object|null} Entrada del log o null
   */
  const getEvidence = useCallback(
    (activityId) => {
      return activityLog.find((entry) => entry.activityId === activityId) || null;
    },
    [activityLog]
  );

  return {
    tickets,
    activityLog,
    claimTicket,
    spendTicket,
    canClaim,
    getEvidence,
    hasTickets: tickets > 0,
  };
}
