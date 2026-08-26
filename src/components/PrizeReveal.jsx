/**
 * PrizeReveal.jsx — Secuencia de Supernova y revelación del premio cósmico.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { getRarityConfig } from '../utils/rarityConfig';
import RarityBadge from './RarityBadge';

function generateParticles(count, color) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 25,
    distance: 100 + Math.random() * 140,
    size: 3 + Math.random() * 5,
    duration: 0.8 + Math.random() * 0.8,
    delay: Math.random() * 0.25,
    color,
  }));
}

export default function PrizeReveal({ result, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const config = getRarityConfig(result?.rarity);
  const isLegendary = result?.rarity === 'legendary';
  const isRare = result?.rarity === 'rare';

  const particles = useMemo(
    () => (isLegendary || isRare ? generateParticles(30, config.particleColor || '#fbbf24') : []),
    [isLegendary, isRare, config.particleColor]
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), isLegendary ? 700 : 350);
    return () => clearTimeout(timer);
  }, [isLegendary]);

  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Fondo oscurecido con blur */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Onda de choque de Supernova (Anillo expansivo) */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            border: `2px solid ${config.colors.primary}`,
            boxShadow: `0 0 40px ${config.colors.primary}`,
          }}
          initial={{ width: 10, height: 10, opacity: 1 }}
          animate={{ width: 600, height: 600, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Flash cósmico de pantalla */}
        {(isRare || isLegendary) && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: config.flashColor || 'rgba(251,191,36,0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        )}

        {/* Chispas y partículas estelares */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay + 0.2,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Tarjeta de Revelación del Premio */}
        <motion.div
          className={`relative glass-card p-8 sm:p-10 max-w-sm w-full text-center border-2 z-10 ${config.glow}`}
          style={{ borderColor: config.colors.primary }}
          initial={{ scale: 0, rotate: -15 }}
          animate={{
            scale: [0, 1.12, 1],
            rotate: [isLegendary ? -10 : 0, isLegendary ? 4 : 0, 0],
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Resplandor de nebulosa detrás del emoji */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${config.colors.primary}25 0%, transparent 70%)`,
            }}
          />

          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Emoji gigante */}
                <motion.div
                  className="text-7xl sm:text-8xl mb-4 select-none filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 14,
                    delay: 0.05,
                  }}
                >
                  {result.prize.emoji}
                </motion.div>

                {/* Badge de rareza */}
                <motion.div
                  className="mb-3 flex justify-center"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <RarityBadge rarity={result.rarity} size="lg" />
                </motion.div>

                {/* Nombre del premio */}
                <motion.h2
                  className={`font-display font-extrabold text-2xl sm:text-3xl mb-2 tracking-tight ${
                    isLegendary ? 'text-shimmer' : 'text-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {result.prize.name}
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  {result.prize.description}
                </motion.p>

                {/* Botón de celebración */}
                <motion.button
                  className="btn-pull text-sm px-8 py-3 w-full"
                  onClick={onClose}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  ✨ ¡RECLAMAR RECOMPENSA! ✨
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
