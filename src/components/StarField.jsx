/**
 * StarField.jsx — Fondo Inmersivo de Agujero Negro & Disco de Acreción (60 FPS).
 *
 * Muestra el horizonte de sucesos, anillo de fotones incandescente
 * y estrellas distorsionadas por la gravedad relativista.
 */

import { useMemo } from 'react';

function generateStarBackground(count, sizeMultiplier = 1) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size = (Math.random() * 1.5 + 0.5) * sizeMultiplier;
    const opacity = Math.random() * 0.6 + 0.3;
    const isGold = Math.random() > 0.75;
    const color = isGold 
      ? (Math.random() > 0.5 ? `rgba(251,191,36,${opacity})` : `rgba(249,115,22,${opacity})`)
      : `rgba(255,255,255,${opacity})`;

    shadows.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, ${color} 40%, transparent 60%)`
    );
  }
  return shadows.join(', ');
}

export default function StarField({ count = 60 }) {
  const starsLayer1 = useMemo(() => generateStarBackground(count, 0.9), [count]);
  const starsLayer2 = useMemo(() => generateStarBackground(Math.floor(count * 0.4), 1.3), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black">
      
      {/* 🕳️ AGUJERO NEGRO / HORIZONTE DE SUCESOS (Fondo Central Superior) */}
      <div className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] opacity-90 pointer-events-none">
        
        {/* Resplandor ambiental de radiación de Hawking */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(220,38,38,0.12) 40%, transparent 70%)'
          }}
        />

        {/* Disco de Acreción giratorio (Lente Gravitacional en perspectiva) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[130px] sm:w-[450px] sm:h-[170px] rounded-[50%] animate-accretion-spin"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(254,240,138,0.9) 45%, rgba(249,115,22,0.8) 60%, rgba(220,38,38,0.4) 75%, transparent 85%)',
            boxShadow: '0 0 35px rgba(249,115,22,0.8), inset 0 0 20px rgba(251,191,36,0.6)',
            transform: 'translate(-50%, -50%) rotate(-15deg)',
          }}
        />

        {/* Arco de luz superior (efecto Interstellar - gravedad doblando el disco trasero) */}
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[240px] h-[160px] sm:w-[320px] sm:h-[220px] rounded-full border-t-4 border-amber-300/80 pointer-events-none opacity-80"
          style={{
            boxShadow: '0 -8px 25px rgba(251,191,36,0.7)',
            filter: 'blur(1px)'
          }}
        />

        {/* Sombra de la Singularidad (El Núcleo Negro Absoluto) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-black border border-amber-400/60 shadow-[0_0_30px_rgba(249,115,22,0.9),inset_0_0_25px_rgba(0,0,0,1)]"
        />

        {/* Anillo de Fotones (Photon Sphere) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[118px] h-[118px] sm:w-[168px] sm:h-[168px] rounded-full border border-yellow-200/90 shadow-[0_0_15px_#fbbf24]"
        />
      </div>

      {/* 🌠 Materia y Fotones cayendo a la Singularidad */}
      <div className="shooting-star top-24 left-[15%]" style={{ animationDelay: '0s' }} />
      <div className="shooting-star top-1/2 left-[70%]" style={{ animationDelay: '3.5s' }} />

      {/* ✨ Capa 1: Estrellas de Fondo */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: starsLayer1,
          willChange: 'opacity',
          animation: 'twinkle 5s ease-in-out infinite alternate',
        }}
      />

      {/* 🌟 Capa 2: Estrellas Fotónicas Doradas */}
      <div
        className="absolute inset-0 opacity-85"
        style={{
          background: starsLayer2,
          animation: 'twinkle 3.5s ease-in-out 1.5s infinite alternate-reverse',
        }}
      />
    </div>
  );
}
