/**
 * RarityBadge.jsx — Badge visual que indica la rareza de un premio.
 *
 * Muestra estrellas y el label de rareza con los colores correspondientes.
 */

import { motion } from 'framer-motion';
import { getRarityConfig } from '../utils/rarityConfig';

export default function RarityBadge({ rarity, size = 'md', showLabel = true }) {
  const config = getRarityConfig(rarity);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2',
  };

  return (
    <motion.span
      className={`inline-flex items-center rounded-full font-semibold font-display
        ${config.colors.bg} ${config.colors.text} ${config.colors.border} border
        ${sizeClasses[size]}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Estrellas según rareza */}
      <span className="flex gap-0.5">
        {Array.from({ length: config.stars }).map((_, i) => (
          <span key={i} className="leading-none">⭐</span>
        ))}
      </span>

      {/* Label */}
      {showLabel && <span>{config.label}</span>}
    </motion.span>
  );
}
