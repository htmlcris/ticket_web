/**
 * TicketBadge.jsx — Badge con aspecto de cristal de fotones del agujero negro.
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function TicketBadge({ tickets = 0 }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 shadow-[0_0_25px_rgba(249,115,22,0.3)] relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.7)' }}
    >
      {/* Reflejo de luz pasando */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/15 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      {/* Ícono de ticket con halo dorado */}
      <span className="text-xl filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] select-none">
        🎟️
      </span>

      {/* Contador numérico */}
      <div className="flex items-center gap-1.5">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={tickets}
            className="font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 min-w-[1.75rem] text-center drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            initial={{ y: -18, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          >
            {tickets}
          </motion.span>
        </AnimatePresence>

        <span className="text-amber-200/90 text-xs font-semibold uppercase tracking-wider font-mono">
          {tickets === 1 ? 'Ticket' : 'Tickets'}
        </span>
      </div>

      {/* Indicador de estado */}
      <span className={`w-2 h-2 rounded-full ${tickets > 0 ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse' : 'bg-slate-700'}`} />
    </motion.div>
  );
}
