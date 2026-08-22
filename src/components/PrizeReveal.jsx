/**
 * PrizeReveal.jsx — Animación de revelación del premio.
 *
 * Se muestra después de la animación de tensión.
 * Cada nivel de rareza tiene su propia secuencia visual:
 * - Común: fade in suave + brillo azul
 * - Raro: explosión púrpura + escala
 * - Legendario: flash dorado + partículas + screen shake
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { getRarityConfig } from '../utils/rarityConfig';
import RarityBadge from './RarityBadge';

/**
 * Genera partículas para el efecto de explosión (legendario).
 */
function generateParticles(count, color) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + Math.random() * 20,
    distance: 80 + Math.random() * 120,
    size: 3 + Math.random() * 5,
    duration: 0.6 + Math.random() * 0.8,
    delay: Math.random() * 0.3,
    color,
  }));
}

export default function PrizeReveal({ result, onClose }) {
  const [showContent, setShowContent] = useState(false);
  const config = getRarityConfig(result?.rarity);
  const isLegendary = result?.rarity === 'legendary';
  const isRare = result?.rarity === 'rare';

  const particles = useMemo(
    () => (isLegendary ? generateParticles(24, config.particleColor) : []),
    [isLegendary, config.particleColor]
  );

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), isLegendary ? 800 : 400);
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
        {/* Backdrop overlay */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Flash de pantalla (raro y legendario) */}
        {(isRare || isLegendary) && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: config.flashColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}

        {/* Partículas (solo legendario) */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
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
              delay: p.delay + 0.3,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Card de premio */}
        <motion.div
          className={`relative glass-card p-8 sm:p-10 max-w-sm w-full text-center ${config.glow}`}
          initial={{ scale: 0, rotate: -10 }}
          animate={{
            scale: [0, 1.15, 1],
            rotate: [isLegendary ? -10 : 0, isLegendary ? 5 : 0, 0],
          }}
          transition={{
            duration: isLegendary ? 0.8 : 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          // Screen shake para legendario
          {...(isLegendary && {
            animate: {
              scale: [0, 1.15, 1],
              rotate: [-10, 5, -3, 2, 0],
              x: [0, -5, 5, -3, 3, 0],
            },
          })}
        >
          {/* Anillo de glow detrás del emoji */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${config.colors.primary}15 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Emoji del premio */}
                <motion.div
                  className="text-6xl sm:text-7xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 12,
                    delay: 0.1,
                  }}
                >
                  {result.prize.emoji}
                </motion.div>

                {/* Badge de rareza */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <RarityBadge rarity={result.rarity} size="lg" />
                </motion.div>

                {/* Nombre del premio */}
                <motion.h2
                  className={`font-display font-bold text-2xl sm:text-3xl mb-2 ${
                    isLegendary ? 'text-shimmer' : 'text-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {result.prize.name}
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {result.prize.description}
                </motion.p>

                {/* Botón cerrar */}
                <motion.button
                  className="btn-pull text-sm px-6 py-2.5"
                  onClick={onClose}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ¡Genial! ✨
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
