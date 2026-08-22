/**
 * Header.jsx — Cabecera de la aplicación.
 *
 * Muestra el título con efecto shimmer y el badge de tickets.
 */

import { motion } from 'framer-motion';
import TicketBadge from './TicketBadge';

export default function Header({ tickets = 0 }) {
  return (
    <motion.header
      className="relative z-10 text-center pt-8 pb-4 px-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Título principal */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-shimmer mb-3 tracking-tight">
        ✨ Gacha Cósmico
      </h1>

      {/* Subtítulo */}
      <p className="text-slate-400 text-base sm:text-lg font-light max-w-md mx-auto mb-4">
        Completa actividades, gana tickets y descubre premios
      </p>

      {/* Badge de tickets */}
      <TicketBadge tickets={tickets} />
    </motion.header>
  );
}
