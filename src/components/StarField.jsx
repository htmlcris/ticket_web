/**
 * StarField.jsx — Fondo animado de estrellas cósmicas (OPTIMIZADO).
 *
 * Usa una sola capa CSS con radial-gradients en lugar de 80+ divs,
 * eliminando el overhead de DOM y mejorando rendimiento drásticamente.
 */

import { useMemo } from 'react';

/**
 * Genera un background CSS con múltiples radial-gradients
 * para simular estrellas sin elementos DOM individuales.
 */
function generateStarBackground(count) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 0.5;
    const opacity = Math.random() * 0.6 + 0.2;
    shadows.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,255,255,${opacity}) 50%, transparent 50%)`
    );
  }
  return shadows.join(', ');
}

export default function StarField({ count = 60 }) {
  const background = useMemo(() => generateStarBackground(count), [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Capa principal de estrellas — un solo div con gradients CSS */}
      <div
        className="absolute inset-0"
        style={{
          background,
          willChange: 'opacity',
          animation: 'twinkle 5s ease-in-out infinite alternate',
        }}
      />

      {/* Segunda capa con offset para más densidad */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: generateStarBackground(30),
          animation: 'twinkle 7s ease-in-out 2s infinite alternate-reverse',
        }}
      />
    </div>
  );
}
