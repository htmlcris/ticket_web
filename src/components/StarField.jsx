/**
 * StarField.jsx — Fondo Galáctico Inmersivo y Ultrarrápido (60 FPS).
 *
 * Optimizado: usa gradientes radiales directos sin filtros blur pesados
 * y animaciones CSS 100% aceleradas por hardware GPU.
 */

import { useMemo } from 'react';

function generateStarBackground(count, sizeMultiplier = 1) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size = (Math.random() * 1.5 + 0.5) * sizeMultiplier;
    const opacity = Math.random() * 0.6 + 0.3;
    const isColored = Math.random() > 0.85;
    const color = isColored 
      ? (Math.random() > 0.5 ? `rgba(168,85,247,${opacity})` : `rgba(56,189,248,${opacity})`)
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 🌌 Luces de Nebulosa Ambiental Livianas (Sin filter: blur) */}
      <div 
        className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(147,51,234,0.05) 50%, transparent 70%)'
        }}
      />
      <div 
        className="absolute top-1/3 -right-24 w-[450px] h-[450px] opacity-35 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(56,189,248,0.04) 50%, transparent 70%)'
        }}
      />

      {/* 🪐 PLANETA 1: Gigante Gaseoso con Anillos (CSS GPU Puro) */}
      <div className="absolute -top-8 sm:top-10 right-2 sm:right-14 w-28 h-28 sm:w-36 sm:h-36 opacity-80 planet-anim-1">
        <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full planet-glow-purple mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-400/15 to-transparent transform -rotate-12 scale-125" />
        </div>
        <div className="planet-ring w-28 h-12 sm:w-36 sm:h-16" />
      </div>

      {/* 🌍 PLANETA 2: Planeta Neón Cian/Esmeralda (CSS GPU Puro) */}
      <div className="absolute top-1/2 -left-8 sm:left-6 w-18 h-18 sm:w-24 sm:h-24 opacity-70 planet-anim-2">
        <div className="w-full h-full rounded-full planet-glow-cyan relative overflow-hidden">
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/20 blur-[1px]" />
        </div>
      </div>

      {/* 🌕 PLANETA 3: Luna Dorada Estelar (CSS GPU Puro) */}
      <div className="absolute bottom-24 right-4 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 opacity-65 planet-anim-3">
        <div className="w-full h-full rounded-full planet-glow-gold relative overflow-hidden">
          <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-amber-100/25 blur-[1px]" />
        </div>
      </div>

      {/* 🌠 Estrellas Fugaces Periódicas */}
      <div className="shooting-star top-20 left-[20%]" style={{ animationDelay: '0s' }} />
      <div className="shooting-star top-1/3 left-[65%]" style={{ animationDelay: '3.8s' }} />

      {/* ✨ Capa de Estrellas Base */}
      <div
        className="absolute inset-0 opacity-75"
        style={{
          background: starsLayer1,
          willChange: 'opacity',
          animation: 'twinkle 5s ease-in-out infinite alternate',
        }}
      />

      {/* 🌟 Capa de Estrellas Brillantes */}
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
