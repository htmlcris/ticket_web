/**
 * TicketBadge.jsx — Badge animado que muestra tickets disponibles.
 *
 * Muestra un contador con animación de rebote cuando cambia el valor.
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function TicketBadge({ tickets = 0 }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-amber-400/20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
    >
      <span className="text-lg">🎟️</span>

      <AnimatePresence mode="popLayout">
        <motion.span
          key={tickets}
          className="font-display font-bold text-xl text-amber-400 min-w-[1.5rem] text-center"
          initial={{ y: -15, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 15, opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {tickets}
        </motion.span>
      </AnimatePresence>

      <span className="text-slate-400 text-sm">
        {tickets === 1 ? 'ticket' : 'tickets'}
      </span>
    </motion.div>
  );
}
