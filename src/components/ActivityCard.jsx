/**
 * ActivityCard.jsx — Card individual de actividad con estética galáctica.
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
      className={`glass-card glass-card-hover p-5 relative overflow-hidden flex flex-col justify-between ${
        isCompleted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10'
      }`}
      style={{
        boxShadow: isCompleted 
          ? '0 10px 30px -5px rgba(16, 185, 129, 0.2)' 
          : undefined
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
    >
      {/* Resplandor ambiental interior según el color de la actividad */}
      <div
        className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 80% 0%, ${activity.color}, transparent 65%)`,
        }}
      />

      <div className="relative z-10">
        
        {/* Encabezado: Icono + Título + Badge de estado */}
        <div className="flex items-start gap-3.5 mb-3">
          
          {/* Contenedor del Emoji con aura */}
          <div
            className="text-3xl w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/15 p-2 shadow-inner"
            style={{ 
              backgroundColor: activity.colorLight,
              boxShadow: `0 0 20px ${activity.color}30` 
            }}
          >
            {activity.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-display font-bold text-white text-base truncate">
                {activity.name}
              </h3>
              
              {/* Indicador de estado */}
              {isCompleted ? (
                <motion.span 
                  className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span>✓</span> Hecho
                </motion.span>
              ) : (
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                  +1 🎟️
                </span>
              )}
            </div>

            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          </div>
        </div>

        {/* 🏋️ Especial: Racha de Ejercicio Estelar */}
        {activity.id === 'exercise' && (
          <div className="my-3 p-3 rounded-xl bg-black/40 border border-emerald-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider mb-1.5">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="animate-pulse">🔥</span> Racha Galáctica
              </span>
              <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                {exerciseStreak} / 8
              </span>
            </div>

            {/* Barra de progreso de energía */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full shadow-[0_0_10px_#34d399]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (exerciseStreak / 8) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="text-[10px] text-slate-400 flex justify-between mt-2 font-mono">
              <span>Meta Semanal (Lun-Dom):</span>
              <span className={exerciseWeekly >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                {exerciseWeekly} / 4
              </span>
            </div>

            {exerciseStreak >= 8 && (
              <motion.div
                className="mt-2 text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 rounded-lg px-2.5 py-1.5 text-center shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                🎁 ¡PREMIO SORPRESA DESBLOQUEADO!
              </motion.div>
            )}
          </div>
        )}

        {/* Preview de evidencia si ya fue completada */}
        {isCompleted && evidence?.photoBase64 && (
          <motion.div
            className="my-3 rounded-xl overflow-hidden border border-white/15 h-28 relative group"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 112 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={evidence.photoBase64}
              alt={`Evidencia de ${activity.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] text-white/80 font-mono">📸 Evidencia Verificada</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Botón de acción / Estado */}
      <div className="mt-3 relative z-10">
        {isCompleted ? (
          <div className="text-center py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
              <span>✨</span> Misión cumplida hoy
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
                <div className="text-center py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10">
                  <span className="text-rose-400 text-xs font-medium flex items-center justify-center gap-1">
                    <span>⏳</span> Tiempo expirado
                  </span>
                </div>
              );
            }

            return (
              <motion.button
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${activity.color}, ${activity.color}bb)`,
                  boxShadow: `0 4px 18px ${activity.color}35`,
                }}
                onClick={() => onClaim(activity)}
                whileHover={{ scale: 1.02, boxShadow: `0 6px 24px ${activity.color}55` }}
                whileTap={{ scale: 0.97 }}
              >
                <span>📸</span> Subir Evidencia
              </motion.button>
            );
          })()
        )}
      </div>
    </motion.div>
  );
}
