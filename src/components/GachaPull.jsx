/**
 * GachaPull.jsx — Ruleta giratoria con premios coordinados.
 *
 * El orden de los segmentos es FIJO (sin shuffle aleatorio)
 * para garantizar que el puntero siempre aterrice en el premio correcto.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prizes } from '../data/prizes';

/**
 * Construye los segmentos en orden fijo (sin shuffle).
 * El servidor selecciona el premio por ID, y la ruleta
 * lo busca por ID también, por lo que el orden debe ser estable.
 */
function buildWheelSegments() {
  const segments = [];
  prizes.legendary.forEach((p) => segments.push({ ...p, rarity: 'legendary' }));
  prizes.rare.forEach((p) => segments.push({ ...p, rarity: 'rare' }));
  prizes.common.forEach((p) => segments.push({ ...p, rarity: 'common' }));
  return segments;
}

// Segmentos siempre en el mismo orden (módulo-level constante)
const WHEEL_SEGMENTS = buildWheelSegments();

/**
 * Dado un índice de segmento, calcula cuántos grados girar para que
 * ese segmento quede apuntado por el indicador (arriba, 270° en SVG coords).
 */
function calculateFinalRotation(targetIndex, totalSegments, currentRotation, extraSpins = 5) {
  const segmentAngle = 360 / totalSegments;
  // Centro del segmento objetivo en grados (0 = arriba)
  const segmentCenter = targetIndex * segmentAngle + segmentAngle / 2;
  // Necesitamos que ese ángulo quede en la posición "arriba" del círculo
  const neededAngle = (360 - segmentCenter) % 360;
  // Normalizamos la rotación actual para evitar números gigantes
  const currentMod = ((currentRotation % 360) + 360) % 360;
  let delta = neededAngle - currentMod;
  if (delta <= 0) delta += 360;
  return currentRotation + delta + 360 * extraSpins;
}

function findSegmentIndex(result) {
  if (!result) return 0;
  const idx = WHEEL_SEGMENTS.findIndex(
    (s) => s.id === result.prize.id && s.rarity === result.rarity
  );
  return idx >= 0 ? idx : 0;
}

// Paleta de colores por rareza — más vibrante y clara
const RARITY_PALETTE = {
  common: {
    fill1: '#1e3a5f',
    fill2: '#1a3352',
    border: '#3b82f6',
    text: '#93c5fd',
  },
  rare: {
    fill1: '#3b1f6e',
    fill2: '#2e1859',
    border: '#a855f7',
    text: '#d8b4fe',
  },
  legendary: {
    fill1: '#5c3a00',
    fill2: '#4a2e00',
    border: '#fbbf24',
    text: '#fde68a',
  },
};

export default function GachaPull({ isPulling, isIdle, isRevealing, result, onPull, hasTickets = true }) {
  const segments = WHEEL_SEGMENTS;
  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinDuration = useRef(4.5);

  useEffect(() => {
    if (isPulling && result && !isSpinning) {
      const targetIndex = findSegmentIndex(result);
      spinDuration.current = 4 + Math.random() * 1.5;
      const finalRotation = calculateFinalRotation(targetIndex, totalSegments, rotation, 5 + Math.floor(Math.random() * 3));

      setIsSpinning(true);
      setRotation(finalRotation);
    }
  }, [isPulling, result, totalSegments, isSpinning, rotation]);

  useEffect(() => {
    if (isIdle) {
      setIsSpinning(false);
    }
  }, [isIdle]);

  const cx = 150;
  const cy = 150;
  const outerR = 144;
  const innerR = 32;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12">
      {/* Título */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
          🎰 Ruleta Cósmica
        </h2>
        <p className="text-slate-400 text-sm">
          Gasta un ticket para girar y ganar un premio
        </p>
      </motion.div>

      {/* Ruleta container */}
      <div className="relative mb-8">
        {/* Aura de fondo */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-30px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(96,165,250,0.08) 50%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Puntero (triángulo amarillo) */}
        <div
          className="absolute z-20 left-1/2 -translate-x-1/2"
          style={{ top: '-14px' }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '13px solid transparent',
              borderRight: '13px solid transparent',
              borderTop: '22px solid #fbbf24',
              filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.9))',
            }}
          />
        </div>

        {/* Ruleta girando */}
        <motion.div
          className={`relative w-[288px] h-[288px] sm:w-[320px] sm:h-[320px] ${!hasTickets && isIdle ? 'opacity-50' : ''}`}
          animate={{ rotate: rotation }}
          transition={
            isSpinning
              ? { duration: spinDuration.current, ease: [0.15, 0.85, 0.25, 1] }
              : { duration: 0 }
          }
          style={{ willChange: 'transform' }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
            {/* Borde exterior decorativo */}
            <circle cx={cx} cy={cy} r={outerR + 3} fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="6" />
            <circle cx={cx} cy={cy} r={outerR + 3} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 6" />

            {segments.map((seg, i) => {
              const startDeg = i * segmentAngle - 90;
              const endDeg = startDeg + segmentAngle;
              const toRad = (d) => d * (Math.PI / 180);

              const x1 = cx + outerR * Math.cos(toRad(startDeg));
              const y1 = cy + outerR * Math.sin(toRad(startDeg));
              const x2 = cx + outerR * Math.cos(toRad(endDeg));
              const y2 = cy + outerR * Math.sin(toRad(endDeg));
              const ix1 = cx + innerR * Math.cos(toRad(startDeg));
              const iy1 = cy + innerR * Math.sin(toRad(startDeg));
              const ix2 = cx + innerR * Math.cos(toRad(endDeg));
              const iy2 = cy + innerR * Math.sin(toRad(endDeg));
              const large = segmentAngle > 180 ? 1 : 0;

              const pathD = [
                `M ${ix1} ${iy1}`,
                `L ${x1} ${y1}`,
                `A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2}`,
                `L ${ix2} ${iy2}`,
                `A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1}`,
                'Z',
              ].join(' ');

              const pal = RARITY_PALETTE[seg.rarity];
              const fillColor = i % 2 === 0 ? pal.fill1 : pal.fill2;

              // Posición del contenido (emoji + texto) en el centro del segmento
              const midDeg = startDeg + segmentAngle / 2;
              const contentR = (outerR + innerR) / 2;
              const contentX = cx + contentR * Math.cos(toRad(midDeg));
              const contentY = cy + contentR * Math.sin(toRad(midDeg));

              // Rotación del texto para leerlo radialmente
              const textRotation = midDeg + 90;

              // Nombre truncado
              const maxChars = segmentAngle > 30 ? 16 : 10;
              const label = seg.name.length > maxChars
                ? seg.name.substring(0, maxChars - 2) + '…'
                : seg.name;

              return (
                <g key={`${seg.id}-${i}`}>
                  <path
                    d={pathD}
                    fill={fillColor}
                    stroke={pal.border}
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                  />
                  <g transform={`translate(${contentX}, ${contentY}) rotate(${textRotation})`}>
                    {/* Emoji */}
                    <text
                      x="0"
                      y="-9"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={segmentAngle >= 40 ? '16' : '12'}
                      className="select-none"
                    >
                      {seg.emoji}
                    </text>
                    {/* Nombre del premio */}
                    <text
                      x="0"
                      y="9"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={segmentAngle >= 40 ? '7.5' : '6'}
                      fill={pal.text}
                      fontWeight="600"
                      className="select-none"
                    >
                      {label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Centro */}
            <circle cx={cx} cy={cy} r={innerR} fill="#0a0a1a" stroke="rgba(168,85,247,0.6)" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={innerR - 4} fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="1" />
            <text
              x={cx} y={cy}
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

      {/* Botón / estado */}
      <AnimatePresence mode="wait">
        {isIdle && hasTickets && (
          <motion.button
            key="pull-btn"
            className="btn-pull text-lg px-10"
            onClick={onPull}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="gacha-pull-button"
          >
            ✨ Girar <span className="ml-1 text-sm opacity-75">(🎟️ ×1)</span>
          </motion.button>
        )}

        {isIdle && !hasTickets && (
          <motion.div
            key="no-tickets"
            className="text-center glass-card px-6 py-4 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-slate-300 text-sm font-medium mb-1">🎟️ Sin tickets disponibles</p>
            <p className="text-slate-500 text-xs">Completa actividades arriba para ganar tickets</p>
          </motion.div>
        )}

        {(isPulling || isSpinning) && (
          <motion.div
            key="spinning-text"
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-slate-300 text-sm font-display tracking-widest uppercase">
              Girando el destino...
            </p>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-purple-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
