/**
 * Activities.jsx — Sección de actividades del día.
 *
 * Muestra las actividades disponibles, su estado de completado,
 * y el modal de evidencia. Cada actividad puede reclamarse 1 vez por día.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import activities from '../data/activities';
import ActivityCard from './ActivityCard';
import EvidenceModal from './EvidenceModal';

export default function Activities({ canClaim, getEvidence, onClaimTicket, exerciseStreak, exerciseWeekly }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Abre el modal de evidencia para una actividad.
   */
  const handleClaim = useCallback((activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  /**
   * Confirma la evidencia y reclama el ticket.
   */
  const handleConfirmEvidence = useCallback(
    (photoBase64) => {
      if (selectedActivity) {
        onClaimTicket(selectedActivity.id, photoBase64);
      }
      setIsModalOpen(false);
      setSelectedActivity(null);
    },
    [selectedActivity, onClaimTicket]
  );

  /**
   * Cancela el modal.
   */
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  // Contar actividades completadas
  const completedCount = activities.filter(
    (a) => !canClaim(a.id)
  ).length;

  return (
    <motion.section
      className={`relative px-4 max-w-3xl mx-auto mb-10 ${isModalOpen ? 'z-50' : 'z-10'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
          🎯 Actividades del Día
        </h2>
        <p className="text-slate-400 text-sm">
          Completa actividades con evidencia para ganar tickets
          <span className="ml-2 text-xs text-slate-500">
            ({completedCount}/{activities.length} completadas)
          </span>
        </p>
      </div>

      {/* Grid de actividades */}
      <div className="grid gap-3 sm:grid-cols-3">
        {activities.map((activity, index) => {
          const completed = !canClaim(activity.id);
          const evidence = getEvidence(activity.id);

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isCompleted={completed}
              evidence={evidence}
              onClaim={handleClaim}
              index={index}
              exerciseStreak={exerciseStreak}
              exerciseWeekly={exerciseWeekly}
            />
          );
        })}
      </div>

      {/* Mensaje cuando todas están completadas */}
      {completedCount === activities.length && (
        <motion.p
          className="text-center text-emerald-400/80 text-sm mt-4 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          🌟 ¡Todas las actividades completadas hoy! Vuelve mañana para más tickets.
        </motion.p>
      )}

      {/* Modal de evidencia */}
      <EvidenceModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onConfirm={handleConfirmEvidence}
        onCancel={handleCancel}
      />
    </motion.section>
  );
}
