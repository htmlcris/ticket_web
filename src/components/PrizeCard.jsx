/**
 * PrizeCard.jsx — Card individual de un premio como reliquia cósmica.
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
      className={`glass-card glass-card-hover p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between ${
        prize.redeemed ? 'border-emerald-500/30 bg-emerald-950/10' : config.glow
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Resplandor ambiental de la rareza */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${config.colors.primary}, transparent 70%)`
        }}
      />

      <div className="flex items-start gap-3.5 relative z-10">
        
        {/* Orbe del Emoji */}
        <div
          className={`text-3xl sm:text-4xl flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner
            ${prize.redeemed 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : `${config.colors.bg} ${config.colors.border}`}`}
          style={{
            boxShadow: `0 0 15px ${config.colors.primary}25`
          }}
        >
          {prize.emoji}
        </div>

        {/* Detalles del premio */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-bold text-white text-base truncate">
              {prize.name}
            </h3>
            <RarityBadge rarity={prize.rarity} size="sm" showLabel={false} />
          </div>

          <p className="text-slate-300/90 text-xs sm:text-sm line-clamp-2 mb-2 leading-relaxed">
            {prize.description}
          </p>

          {/* Fecha */}
          <p className="text-slate-500 text-[11px] font-mono mb-3">
            Obtenido: {wonDate.toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Botón o Estado de cumplimiento */}
      <div className="mt-2 pt-2 border-t border-white/5 relative z-10">
        {prize.redeemed ? (
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span>✨</span> ¡Premio Cumplido!
            </span>
            {prize.redeemedAt && (
              <span className="text-slate-500 text-[11px] font-mono">
                {new Date(prize.redeemedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        ) : (
          <motion.button
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white tracking-wide uppercase transition-all bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 shadow-[0_4px_15px_rgba(192,38,211,0.35)]"
            onClick={handleRedeem}
            disabled={redeeming}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(192,38,211,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            {redeeming ? '⏳ Registrando...' : '✅ Marcar como Cumplido'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
