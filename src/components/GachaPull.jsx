/**
 * GachaPull.jsx — Ruleta Astrolabio Cósmico con premios coordinados.
 *
 * El orden de los segmentos es FIJO (sin shuffle aleatorio)
 * para garantizar que el puntero siempre aterrice en el premio exacto.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prizes } from '../data/prizes';

/**
 * Construye los segmentos en orden fijo (sin shuffle).
 */
function buildWheelSegments() {
  const segments = [];
  prizes.legendary.forEach((p) => segments.push({ ...p, rarity: 'legendary' }));
  prizes.rare.forEach((p) => segments.push({ ...p, rarity: 'rare' }));
  prizes.common.forEach((p) => segments.push({ ...p, rarity: 'common' }));
  return segments;
}

const WHEEL_SEGMENTS = buildWheelSegments();

/**
 * Calcula cuántos grados girar para que el puntero (arriba) aterrice en el segmento objetivo.
 */
function calculateFinalRotation(targetIndex, totalSegments, currentRotation, extraSpins = 5) {
  const segmentAngle = 360 / totalSegments;
  const segmentCenter = targetIndex * segmentAngle + segmentAngle / 2;
  const neededAngle = (360 - segmentCenter) % 360;
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

// Paleta de colores cósmica de alto contraste por rareza
const RARITY_PALETTE = {
  common: {
    fill1: '#0d223a',
    fill2: '#081728',
    border: '#38bdf8',
    text: '#bae6fd',
    glow: 'rgba(56, 189, 248, 0.5)',
  },
  rare: {
    fill1: '#2e1055',
    fill2: '#1f093a',
    border: '#d946ef',
    text: '#f5d0fe',
    glow: 'rgba(217, 70, 239, 0.5)',
  },
  legendary: {
    fill1: '#4a2800',
    fill2: '#331a00',
    border: '#fbbf24',
    text: '#fef08a',
    glow: 'rgba(251, 191, 36, 0.7)',
  },
};

export default function GachaPull({ isPulling, isIdle, isRevealing, result, onPull, hasTickets = true }) {
  const segments = WHEEL_SEGMENTS;
  const totalSegments = segments.length;
  const segmentAngle = 360 / totalSegments;

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinDuration = useRef(4.8);

  useEffect(() => {
    if (isPulling && result && !isSpinning) {
      const targetIndex = findSegmentIndex(result);
      spinDuration.current = 4.2 + Math.random() * 1.2;
      const finalRotation = calculateFinalRotation(targetIndex, totalSegments, rotation, 6 + Math.floor(Math.random() * 2));

      setIsSpinning(true);
      setRotation(finalRotation);
    }
  }, [isPulling, result, totalSegments, isSpinning, rotation]);

  useEffect(() => {
    if (isIdle) {
      setIsSpinning(false);
    }
  }, [isIdle]);

  const cx = 160;
  const cy = 160;
  const outerR = 146;
  const innerR = 36;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-10">
      
      {/* Título de la sección */}
      <motion.div
        className="text-center mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>✨ Portal de Destino</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ruleta Cósmica
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
          Canjea 1 ticket para invocar la energía estelar y obtener un premio
        </p>
      </motion.div>

      {/* Contenedor del Portal / Ruleta */}
      <div className="relative mb-8">
        
        {/* Aura de nebulosa ambiental tras la ruleta */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: '-40px',
            background: 'radial-gradient(circle, rgba(217,70,239,0.2) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)',
            filter: 'blur(25px)',
          }}
        />

        {/* Anillo decorativo exterior con marcas estelares (constelaciones) */}
        <div 
          className="absolute -inset-4 rounded-full border border-purple-500/20 pointer-events-none animate-spin-slow opacity-60" 
          style={{ borderStyle: 'dashed' }}
        />
        <div 
          className="absolute -inset-8 rounded-full border border-cyan-500/15 pointer-events-none animate-spin-reverse-slow opacity-40" 
        />

        {/* Puntero Estelar de Cristal Dorado */}
        <div
          className="absolute z-20 left-1/2 -translate-x-1/2"
          style={{ top: '-18px' }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            {/* Gema superior */}
            <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] mb-0.5 border border-white/60" />
            {/* Triángulo puntero */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderTop: '24px solid #fbbf24',
                filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.95))',
              }}
            />
          </motion.div>
        </div>

        {/* Ruleta giratoria SVG */}
        <motion.div
          className={`relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] ${!hasTickets && isIdle ? 'opacity-60 grayscale-[20%]' : ''}`}
          animate={{ rotate: rotation }}
          transition={
            isSpinning
              ? { duration: spinDuration.current, ease: [0.12, 0.88, 0.2, 1] }
              : { duration: 0 }
          }
          style={{ willChange: 'transform' }}
        >
          <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
            
            {/* Bordes galácticos exteriores */}
            <circle cx={cx} cy={cy} r={outerR + 5} fill="none" stroke="rgba(217, 70, 239, 0.4)" strokeWidth="4" />
            <circle cx={cx} cy={cy} r={outerR + 2} fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx={cx} cy={cy} r={outerR + 10} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" />

            {/* Segmentos de premios */}
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

              // Posición del contenido en el arco central
              const midDeg = startDeg + segmentAngle / 2;
              const contentR = (outerR + innerR) / 2;
              const contentX = cx + contentR * Math.cos(toRad(midDeg));
              const contentY = cy + contentR * Math.sin(toRad(midDeg));

              const textRotation = midDeg + 90;

              const maxChars = segmentAngle > 30 ? 16 : 10;
              const label = seg.name.length > maxChars
                ? seg.name.substring(0, maxChars - 2) + '…'
                : seg.name;

              return (
                <g key={`${seg.id}-${i}`}>
                  {/* Segmento */}
                  <path
                    d={pathD}
                    fill={fillColor}
                    stroke={pal.border}
                    strokeWidth="1"
                    strokeOpacity="0.65"
                  />
                  
                  {/* Contenido (Emoji + Texto) */}
                  <g transform={`translate(${contentX}, ${contentY}) rotate(${textRotation})`}>
                    <text
                      x="0"
                      y="-10"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={segmentAngle >= 40 ? '17' : '13'}
                      className="select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                      {seg.emoji}
                    </text>
                    <text
                      x="0"
                      y="10"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={segmentAngle >= 40 ? '8' : '6.5'}
                      fill={pal.text}
                      fontWeight="700"
                      className="select-none tracking-wide uppercase"
                    >
                      {label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Núcleo Central (Agujero Negro / Portal de Cristal) */}
            <circle cx={cx} cy={cy} r={innerR + 3} fill="none" stroke="rgba(217, 70, 239, 0.6)" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={innerR} fill="#030014" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={innerR - 6} fill="rgba(147, 51, 234, 0.25)" />
            
            {/* Símbolo central */}
            <text
              x={cx} y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="22"
              className="select-none filter drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
            >
              🪐
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Controles y Estados */}
      <AnimatePresence mode="wait">
        {isIdle && hasTickets && (
          <motion.button
            key="pull-btn"
            className="btn-pull text-lg px-12"
            onClick={onPull}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            id="gacha-pull-button"
          >
            ✨ GIRAR DESTINO <span className="ml-2 text-xs font-mono bg-white/20 px-2 py-0.5 rounded-full">🎟️ ×1</span>
          </motion.button>
        )}

        {isIdle && !hasTickets && (
          <motion.div
            key="no-tickets"
            className="text-center glass-card px-8 py-4 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-2xl mb-1">🎟️</div>
            <p className="text-white text-sm font-semibold mb-0.5">Sin tickets cósmicos disponibles</p>
            <p className="text-slate-400 text-xs">Completa las misiones diarias de arriba para conseguir más</p>
          </motion.div>
        )}

        {(isPulling || isSpinning) && (
          <motion.div
            key="spinning-text"
            className="flex flex-col items-center gap-3 glass-card px-8 py-3.5 border border-purple-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
              <p className="text-fuchsia-300 text-sm font-display tracking-widest uppercase font-bold">
                Alineando con el Universo...
              </p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
