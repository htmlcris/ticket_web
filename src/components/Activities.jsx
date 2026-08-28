/**
 * Activities.jsx — Sección de Misiones Cósmicas del día.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import activities from '../data/activities';
import ActivityCard from './ActivityCard';
import EvidenceModal from './EvidenceModal';

export default function Activities({ canClaim, getEvidence, onClaimTicket, exerciseStreak, exerciseWeekly }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClaim = useCallback((activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

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

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  const completedCount = activities.filter((a) => !canClaim(a.id)).length;
  const progressPercent = (completedCount / activities.length) * 100;

  return (
    <motion.section
      className={`relative px-4 max-w-4xl mx-auto mb-12 ${isModalOpen ? 'z-50' : 'z-10'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {/* Header de Misiones */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>🎯 Misiones Diarias</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Actividades del Día
        </h2>
        <p className="text-slate-300/80 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Registra tus hazañas con evidencia fotográfica para cargar energía y reclamar tickets.
        </p>

        {/* Barra de progreso de misiones diarias */}
        <div className="max-w-xs mx-auto mt-4">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>Progreso diario</span>
            <span className="text-amber-400 font-bold">{completedCount} / {activities.length}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Grid de tarjetas de actividad */}
      <div className="grid gap-4 sm:grid-cols-3">
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

      {/* Mensaje de felicitación si completó todas */}
      {completedCount === activities.length && (
        <motion.div
          className="mt-6 p-4 rounded-2xl glass-card border border-amber-500/40 bg-amber-500/10 text-center max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-2xl block mb-1">🌟</span>
          <p className="text-amber-300 font-bold text-sm">
            ¡Todas las misiones del día completadas con éxito!
          </p>
          <p className="text-amber-200/70 text-xs mt-0.5">
            Tus tickets están listos para ser usados en la Ruleta Cósmica.
          </p>
        </motion.div>
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
