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
  exerciseStreak = 0,
  exerciseWeekly = 0,
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
            
            {activity.id === 'exercise' && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                  <span className="text-emerald-400">🔥 Racha Total</span>
                  <span className="text-emerald-300">{exerciseStreak} / 8</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (exerciseStreak / 8) * 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Meta Semanal:</span>
                  <span className={exerciseWeekly >= 4 ? 'text-green-400 font-bold' : 'text-slate-300'}>
                    {exerciseWeekly} / 4
                  </span>
                </div>
                {exerciseStreak >= 8 && (
                  <motion.div
                    className="mt-1 text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded px-2 py-1 text-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    🎁 ¡PREMIO SORPRESA DESBLOQUEADO!
                  </motion.div>
                )}
              </div>
            )}
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
          (() => {
            // Verificar si expiró la actividad según hora de Ecuador
            let isExpired = false;
            if (activity.deadline) {
              const now = new Date();
              const options = { timeZone: 'America/Guayaquil', hour12: false, hour: 'numeric', minute: 'numeric' };
              const timeString = now.toLocaleTimeString('en-US', options);
              if (timeString !== 'Invalid Date') {
                const [currentHour, currentMinute] = timeString.split(':').map(Number);
                if (currentHour > activity.deadline.hour || (currentHour === activity.deadline.hour && currentMinute >= activity.deadline.minute)) {
                  isExpired = true;
                }
              }
            }

            if (isExpired) {
              return (
                <div className="text-center py-2.5 rounded-xl border border-red-500/30 bg-red-500/10">
                  <span className="text-red-400 text-xs font-medium">
                    ⏳ Se acabó el tiempo
                  </span>
                </div>
              );
            }

            return (
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
            );
          })()
        )}
      </div>
    </motion.div>
  );
}
