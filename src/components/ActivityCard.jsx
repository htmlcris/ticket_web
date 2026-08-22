/**
 * ActivityCard.jsx — Card individual de actividad.
 *
 * Muestra el estado de la actividad (pendiente/completada),
 * la evidencia si ya fue subida, y el botón de acción.
 */

import { motion } from 'framer-motion';

export default function ActivityCard({
  activity,
  isCompleted,
  evidence,
  onClaim,
  index = 0,
}) {
  return (
    <motion.div
      className={`glass-card glass-card-hover p-4 sm:p-5 relative overflow-hidden ${
        isCompleted ? 'border-green-500/30' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
    >
      {/* Glow de fondo según color de actividad */}
      <div
        className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${activity.color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header: Emoji + Nombre + Estado */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: activity.colorLight }}
          >
            {activity.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-white text-sm sm:text-base">
              {activity.name}
            </h3>
            <p className="text-slate-400 text-xs">{activity.description}</p>
          </div>

          {/* Indicador de estado */}
          {isCompleted ? (
            <motion.div
              className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
            >
              <span className="text-sm">✅</span>
            </motion.div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-slate-500">○</span>
            </div>
          )}
        </div>

        {/* Preview de evidencia si ya fue completada */}
        {isCompleted && evidence?.photoBase64 && (
          <motion.div
            className="mb-3 rounded-lg overflow-hidden border border-white/10 h-24"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 96 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={evidence.photoBase64}
              alt={`Evidencia de ${activity.name}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Botón de acción */}
        {isCompleted ? (
          <div className="text-center">
            <span className="text-green-400 text-xs font-medium">
              ✨ ¡Completada hoy! +1 ticket ganado
            </span>
          </div>
        ) : (
          <motion.button
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              backgroundImage: `linear-gradient(135deg, ${activity.color}, ${activity.color}bb)`,
              boxShadow: `0 4px 15px ${activity.color}30`,
            }}
            onClick={() => onClaim(activity)}
            whileHover={{ scale: 1.02, boxShadow: `0 6px 25px ${activity.color}50` }}
            whileTap={{ scale: 0.97 }}
          >
            📸 Subir evidencia
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
