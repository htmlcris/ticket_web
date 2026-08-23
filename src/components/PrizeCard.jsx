/**
 * PrizeCard.jsx — Card individual de un premio en el inventario.
 *
 * Muestra el emoji, nombre, descripción, rareza y fecha de obtención.
 * Si el premio NO ha sido cumplido, muestra un botón para marcarlo.
 * Si ya fue cumplido, muestra un badge verde.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getRarityConfig } from '../utils/rarityConfig';
import RarityBadge from './RarityBadge';

export default function PrizeCard({ prize, index = 0, onRedeem }) {
  const config = getRarityConfig(prize.rarity);
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (redeeming || !onRedeem) return;
    setRedeeming(true);
    try {
      await onRedeem(prize.pullId);
    } finally {
      setRedeeming(false);
    }
  };

  const wonDate = new Date(prize.timestamp || prize.obtainedAt || Date.now());

  return (
    <motion.div
      className={`glass-card glass-card-hover p-4 ${prize.redeemed ? 'border-green-500/30' : config.glow}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div
          className={`text-3xl sm:text-4xl flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
            ${prize.redeemed ? 'bg-green-500/10 border-green-500/30' : `${config.colors.bg} ${config.colors.border}`} border`}
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

          {/* Fecha de obtención */}
          <p className="text-slate-500 text-xs mb-3">
            Ganado: {wonDate.toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>

          {/* Estado / Acción */}
          {prize.redeemed ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-xs font-bold">
                ✅ ¡Ya lo cumplió!
              </span>
              {prize.redeemedAt && (
                <span className="text-slate-500 text-xs">
                  {new Date(prize.redeemedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          ) : (
            <motion.button
              className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600"
              style={{ boxShadow: '0 4px 15px rgba(168,85,247,0.35)' }}
              onClick={handleRedeem}
              disabled={redeeming}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {redeeming ? '⏳ Guardando...' : '✅ Marcar como cumplido'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
