/**
 * GachaPull.jsx — Ruleta giratoria real con premios visibles.
 *
 * Reemplaza el orbe por una ruleta circular dividida en segmentos,
 * cada uno mostrando un premio con su emoji. Gira con deceleración
 * realista y aterriza en el premio calculado por el backend.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prizes } from '../data/prizes';
import { getRarityConfig } from '../utils/rarityConfig';

/**
 * Construye los segmentos de la ruleta añadiendo exactamente 1 de cada premio.
 */
function buildWheelSegments() {
  const segments = [];

  // Agregar comunes
  prizes.common.forEach((prize) => {
    segments.push({ ...prize, rarity: 'common' });
  });

  // Agregar raros
  prizes.rare.forEach((prize) => {
    segments.push({ ...prize, rarity: 'rare' });
  });

  // Agregar legendario
  prizes.legendary.forEach((prize) => {
    segments.push({ ...prize, rarity: 'legendary' });
  });

  // Mezclar para que no estén agrupados
  for (let i = segments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [segments[i], segments[j]] = [segments[j], segments[i]];
  }

  return segments;
}

/**
 * Calcula el ángulo de rotación final para aterrizar en un segmento específico.
 * Incluye múltiples vueltas para efecto dramático.
 */
function calculateFinalRotation(targetIndex, totalSegments, extraSpins = 5) {
  const segmentAngle = 360 / totalSegments;
  // El pointer está arriba (0°), así que necesitamos que el segmento objetivo
  // quede alineado con la parte superior
  const targetAngle = segmentAngle * targetIndex + segmentAngle / 2;
  // Rotamos en sentido horario: 360° * vueltas extras + ángulo para llegar al objetivo
  // Restamos porque la ruleta gira y queremos que el target quede arriba
  const finalRotation = 360 * extraSpins + (360 - targetAngle);
  return finalRotation;
}

/**
 * Encuentra el índice del segmento que coincide con el premio ganado.
 */
function findSegmentIndex(segments, result) {
  if (!result) return 0;
  const idx = segments.findIndex(
    (s) => s.id === result.prize.id && s.rarity === result.rarity
  );
  return idx >= 0 ? idx : 0;
}

// Colores de fondo para cada segmento según rareza
const SEGMENT_COLORS = {
  common: ['rgba(96, 165, 250, 0.15)', 'rgba(96, 165, 250, 0.25)'],
  rare: ['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.35)'],
  legendary: ['rgba(251, 191, 36, 0.25)', 'rgba(251, 191, 36, 0.4)'],
};

const SEGMENT_BORDER_COLORS = {
  common: 'rgba(96, 165, 250, 0.4)',
  rare: 'rgba(168, 85, 247, 0.5)',
  legendary: 'rgba(251, 191, 36, 0.6)',
};

export default function GachaPull({ isPulling, isIdle, isRevealing, result, onPull, hasTickets = true }) {
  const segments = useMemo(() => buildWheelSegments(), []);
  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);

  /**
   * Cuando el resultado llega y estamos en pulling, inicia el giro.
   */
  useEffect(() => {
    if (isPulling && result && !isSpinning) {
      const targetIndex = findSegmentIndex(segments, result);
      const finalRotation = calculateFinalRotation(targetIndex, totalSegments, 4 + Math.random() * 3);

      setIsSpinning(true);
      setRotation((prev) => prev + finalRotation);
    }
  }, [isPulling, result, segments, totalSegments, isSpinning]);

  /**
   * Reset cuando volvemos a idle.
   */
  useEffect(() => {
    if (isIdle) {
      setIsSpinning(false);
    }
  }, [isIdle]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12">
      {/* Título de la sección */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
          🎰 Ruleta Cósmica
        </h2>
        <p className="text-slate-400 text-sm">
          Gasta un ticket para girar y ganar un premio
        </p>
      </motion.div>

      {/* Contenedor de la ruleta */}
      <div className="relative mb-8">
        {/* Pointer / flecha indicadora (arriba) */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '20px solid #fbbf24',
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
            }}
          />
        </div>

        {/* Glow de fondo de la ruleta */}
        <div
          className="absolute inset-[-20px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Ruleta SVG */}
        <motion.div
          ref={wheelRef}
          className={`relative w-72 h-72 sm:w-80 sm:h-80 ${
            !hasTickets && isIdle ? 'opacity-50' : ''
          }`}
          animate={{ rotate: rotation }}
          transition={
            isSpinning
              ? {
                  duration: 4 + Math.random(),
                  ease: [0.2, 0.8, 0.3, 1], // Custom cubic-bezier for realistic deceleration
                }
              : { duration: 0 }
          }
          style={{ willChange: 'transform' }}
        >
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full drop-shadow-2xl"
          >
            {/* Borde exterior */}
            <circle
              cx="150" cy="150" r="148"
              fill="none"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="3"
            />

            {/* Segmentos */}
            {segments.map((segment, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
              const radius = 145;
              const innerRadius = 30;

              const x1 = 150 + radius * Math.cos(startAngle);
              const y1 = 150 + radius * Math.sin(startAngle);
              const x2 = 150 + radius * Math.cos(endAngle);
              const y2 = 150 + radius * Math.sin(endAngle);
              const ix1 = 150 + innerRadius * Math.cos(startAngle);
              const iy1 = 150 + innerRadius * Math.sin(startAngle);
              const ix2 = 150 + innerRadius * Math.cos(endAngle);
              const iy2 = 150 + innerRadius * Math.sin(endAngle);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${ix1} ${iy1}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                `L ${ix2} ${iy2}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
                'Z',
              ].join(' ');

              // Posición del emoji (punto medio del segmento)
              const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
              const emojiRadius = 95;
              const emojiX = 150 + emojiRadius * Math.cos(midAngle);
              const emojiY = 150 + emojiRadius * Math.sin(midAngle);

              const colors = SEGMENT_COLORS[segment.rarity];
              const bgColor = i % 2 === 0 ? colors[0] : colors[1];
              const borderColor = SEGMENT_BORDER_COLORS[segment.rarity];

              return (
                <g key={`${segment.id}-${i}`}>
                  {/* Segmento */}
                  <path
                    d={pathData}
                    fill={bgColor}
                    stroke={borderColor}
                    strokeWidth="0.5"
                  />
                  {/* Emoji */}
                  <text
                    x={emojiX}
                    y={emojiY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="22"
                    className="select-none"
                  >
                    {segment.emoji}
                  </text>
                </g>
              );
            })}

            {/* Centro de la ruleta */}
            <circle
              cx="150" cy="150" r="28"
              fill="rgba(10, 10, 26, 0.9)"
              stroke="rgba(168, 85, 247, 0.5)"
              strokeWidth="2"
            />
            <text
              x="150" y="150"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="20"
              className="select-none"
            >
              ✨
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Botón / mensaje */}
      <AnimatePresence mode="wait">
        {isIdle && hasTickets && (
          <motion.button
            key="pull-btn"
            className="btn-pull text-lg"
            onClick={onPull}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="gacha-pull-button"
          >
            ✨ Girar <span className="ml-1 text-sm opacity-80">(🎟️ x1)</span>
          </motion.button>
        )}

        {isIdle && !hasTickets && (
          <motion.div
            key="no-tickets"
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-slate-400 text-sm mb-2">
              🎟️ Necesitas tickets para girar
            </p>
            <p className="text-slate-500 text-xs">
              Completa actividades arriba para ganar tickets
            </p>
          </motion.div>
        )}

        {(isPulling || isSpinning) && (
          <motion.p
            key="spinning-text"
            className="text-slate-400 text-sm font-display tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Girando el destino...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
