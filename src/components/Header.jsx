/**
 * Header.jsx — Cabecera de galaxia con portal interestelar y tipografía estelar.
 */

import { motion } from 'framer-motion';
import TicketBadge from './TicketBadge';

export default function Header({ tickets = 0 }) {
  return (
    <motion.header
      className="relative z-10 text-center pt-8 pb-5 px-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Resplandor central de nebulosa detrás del título */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-96 h-28 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(217,70,239,0.22) 0%, rgba(6,182,212,0.12) 50%, transparent 75%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Chip superior decorativo de coordenadas cósmicas */}
      <motion.div
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
          SECTOR GALÁCTICO • 07
        </span>
      </motion.div>

      {/* Título principal con efecto de galaxia */}
      <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight mb-3">
        <span className="text-shimmer drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          Gacha Cósmico
        </span>
      </h1>

      {/* Subtítulo con tipografía refinada */}
      <p className="text-slate-300/80 text-sm sm:text-base font-light max-w-sm mx-auto mb-6 leading-relaxed">
        Explora actividades del universo, recolecta tickets y gira la ruleta estelar por recompensas.
      </p>

      {/* Badge de tickets interactivo */}
      <TicketBadge tickets={tickets} />
    </motion.header>
  );
}
