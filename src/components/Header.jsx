/**
 * Header.jsx — Cabecera premium de la aplicación.
 */

import { motion } from 'framer-motion';
import TicketBadge from './TicketBadge';

export default function Header({ tickets = 0 }) {
  return (
    <motion.header
      className="relative z-10 text-center pt-10 pb-6 px-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Decorative glow behind title */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 w-80 h-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.25) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Título principal */}
      <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold font-display text-shimmer mb-3 tracking-tight">
        ✨ Gacha Cósmico
      </h1>

      {/* Subtítulo */}
      <p className="text-slate-400 text-sm sm:text-base font-light max-w-xs mx-auto mb-6 leading-relaxed">
        Completa actividades, gana tickets y descubre premios
      </p>

      {/* Badge de tickets */}
      <TicketBadge tickets={tickets} />
    </motion.header>
  );
}
