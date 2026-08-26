/**
 * StarField.jsx — Fondo Galáctico Inmersivo con Planetas Flotantes,
 * Nebulosas Profundas y Estrellas Fugaces.
 *
 * Optimizado para alto rendimiento a 60 FPS con aceleración por GPU.
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Genera un background CSS con múltiples radial-gradients
 * para simular estrellas de distintos tamaños y brillos.
 */
function generateStarBackground(count, sizeMultiplier = 1) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size = (Math.random() * 1.8 + 0.5) * sizeMultiplier;
    const opacity = Math.random() * 0.7 + 0.3;
    const isColored = Math.random() > 0.8;
    const color = isColored 
      ? (Math.random() > 0.5 ? `rgba(168,85,247,${opacity})` : `rgba(56,189,248,${opacity})`)
      : `rgba(255,255,255,${opacity})`;

    shadows.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, ${color} 40%, transparent 60%)`
    );
  }
  return shadows.join(', ');
}

export default function StarField({ count = 80 }) {
  // Generar capas de estrellas memorizadas
  const distantStars = useMemo(() => generateStarBackground(count, 0.8), [count]);
  const mediumStars = useMemo(() => generateStarBackground(Math.floor(count * 0.5), 1.2), [count]);
  const brightStars = useMemo(() => generateStarBackground(15, 1.8), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 🌌 Nebulosas Profundas de Gas Interestelar (Luces de ambiente) */}
      <div 
        className="nebula-glow w-[550px] h-[550px] -top-32 -left-32 bg-purple-600/20"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="nebula-glow w-[600px] h-[600px] top-1/4 -right-40 bg-cyan-500/15"
        style={{ animationDelay: '-3s' }}
      />
      <div 
        className="nebula-glow w-[650px] h-[650px] -bottom-36 left-1/4 bg-fuchsia-600/15"
        style={{ animationDelay: '-6s' }}
      />

      {/* 🪐 PLANETA 1: Gigante Gaseoso con Anillos (Saturno Cósmico) - Superior Derecho */}
      <motion.div
        className="absolute -top-12 sm:top-12 right-2 sm:right-16 w-28 h-28 sm:w-40 sm:h-40 opacity-75 sm:opacity-90"
        initial={{ y: 0, rotate: 0 }}
        animate={{ 
          y: [-8, 12, -8],
          rotate: [-2, 3, -2],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Cuerpo del planeta */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full planet-glow-purple mx-auto relative overflow-hidden">
          {/* Franjas atmosféricas */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-400/20 to-transparent transform -rotate-12 scale-125" />
          <div className="absolute top-1/3 inset-x-0 h-2 bg-white/10 blur-[1px] transform -rotate-12" />
        </div>

        {/* Anillo de luz en perspectiva 3D */}
        <div 
          className="planet-ring w-32 h-14 sm:w-44 sm:h-18" 
          style={{
            top: '40%',
            left: '50%',
            borderColor: 'rgba(217, 70, 239, 0.7)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(56, 189, 248, 0.4)'
          }}
        />
      </motion.div>

      {/* 🌍 PLANETA 2: Planeta Neón Cian/Esmeralda - Lateral Izquierdo */}
      <motion.div
        className="absolute top-1/2 -left-10 sm:left-8 w-20 h-20 sm:w-28 sm:h-28 opacity-60 sm:opacity-80"
        initial={{ y: 0 }}
        animate={{ 
          y: [10, -14, 10],
          x: [0, 6, 0]
        }}
        transition={{ 
          duration: 9, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-full h-full rounded-full planet-glow-cyan relative overflow-hidden">
          {/* Atmósfera exterior */}
          <div className="absolute inset-0 rounded-full border border-cyan-300/40" />
          {/* Resplandor lunar interno */}
          <div className="absolute top-2 left-3 w-6 h-6 rounded-full bg-white/25 blur-sm" />
          {/* Cráter estilizado */}
          <div className="absolute bottom-4 right-5 w-4 h-4 rounded-full bg-cyan-950/40 border border-cyan-400/20" />
        </div>
      </motion.div>

      {/* 🌕 PLANETA 3: Luna Dorada Estelar - Inferior Derecho */}
      <motion.div
        className="absolute bottom-24 right-4 sm:right-24 w-14 h-14 sm:w-20 sm:h-20 opacity-50 sm:opacity-75"
        initial={{ y: 0 }}
        animate={{ 
          y: [-6, 8, -6],
          rotate: [0, 8, 0]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="w-full h-full rounded-full planet-glow-gold relative overflow-hidden">
          <div className="absolute top-1 left-2 w-4 h-4 rounded-full bg-amber-100/30 blur-[2px]" />
          <div className="absolute -inset-1 rounded-full border border-amber-300/20 animate-pulse-slow" />
        </div>
      </motion.div>

      {/* 🌠 Estrellas Fugaces (Meteors) */}
      <div 
        className="shooting-star top-16 left-[25%]" 
        style={{ animationDelay: '0s', animationDuration: '7s' }} 
      />
      <div 
        className="shooting-star top-1/3 left-[70%]" 
        style={{ animationDelay: '3.5s', animationDuration: '8.5s' }} 
      />
      <div 
        className="shooting-star top-2/3 left-[40%]" 
        style={{ animationDelay: '5.5s', animationDuration: '6.5s' }} 
      />

      {/* ✨ Capa 1: Estrellas Lejanas */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: distantStars,
          willChange: 'opacity',
          animation: 'twinkle 6s ease-in-out infinite alternate',
        }}
      />

      {/* ✨ Capa 2: Estrellas Medias Titilantes */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: mediumStars,
          animation: 'twinkle 4s ease-in-out 1.5s infinite alternate-reverse',
        }}
      />

      {/* 🌟 Capa 3: Estrellas Brillantes Destellantes */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: brightStars,
          animation: 'twinkle 3s ease-in-out 0.8s infinite alternate',
        }}
      />
    </div>
  );
}
