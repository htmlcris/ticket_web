/**
 * PrizeCard.jsx — Card individual de un premio en el inventario.
 *
 * Muestra el emoji, nombre, descripción, rareza y fecha de obtención.
 * Incluye efecto hover con glow según la rareza.
 */

import { motion } from 'framer-motion';
import { getRarityConfig } from '../utils/rarityConfig';
import RarityBadge from './RarityBadge';

export default function PrizeCard({ prize, index = 0 }) {
  const config = getRarityConfig(prize.rarity);

  return (
    <motion.div
      className={`glass-card glass-card-hover p-4 ${config.glow}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* Emoji grande */}
        <div
          className={`text-3xl sm:text-4xl flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
            ${config.colors.bg} ${config.colors.border} border`}
        >
          {prize.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-semibold text-white text-sm sm:text-base truncate">
              {prize.name}
            </h3>
            <RarityBadge rarity={prize.rarity} size="sm" showLabel={false} />
          </div>

          <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 mb-2">
            {prize.description}
          </p>

          {/* Fecha */}
          {prize.obtainedAt && (
            <p className="text-slate-500 text-xs">
              {new Date(prize.obtainedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
