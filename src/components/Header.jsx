/**
 * Header.jsx — Cabecera de Singularidad & Agujero Negro.
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
      {/* Resplandor central del disco de acreción */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-96 h-28 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.25) 0%, rgba(251,191,36,0.12) 50%, transparent 75%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Chip superior decorativo de coordenadas del agujero negro */}
      <motion.div
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-amber-500/30 mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase font-bold">
          HORIZONTE DE SUCESOS • SINGULARIDAD
        </span>
      </motion.div>

      {/* Título principal con efecto de fotones */}
      <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight mb-3">
        <span className="text-shimmer drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">
          Gacha Cósmico
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-slate-300 text-sm sm:text-base font-light max-w-sm mx-auto mb-6 leading-relaxed">
        Canjea energía en el horizonte de sucesos y desafía la gravedad por recompensas.
      </p>

      {/* Badge de tickets interactivo */}
      <TicketBadge tickets={tickets} />
    </motion.header>
  );
}
