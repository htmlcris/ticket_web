/**
 * Inventory.jsx — Colección de Tesoros Galácticos obtenidos.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrizeCard from './PrizeCard';
import { RARITY_ORDER, getRarityConfig } from '../utils/rarityConfig';

const FILTERS = [
  { key: 'all', label: 'Todos', emoji: '🌌' },
  { key: 'common', label: 'Comunes', emoji: '💫' },
  { key: 'rare', label: 'Raros', emoji: '🌙' },
  { key: 'legendary', label: 'Legendarios', emoji: '⭐' },
];

export default function Inventory({ inventory, stats, onRedeem }) {
  const [filter, setFilter] = useState('all');

  const filteredInventory = useMemo(() => {
    if (filter === 'all') return inventory;
    return inventory.filter((p) => p.rarity === filter);
  }, [inventory, filter]);

  if (inventory.length === 0) return null;

  return (
    <motion.section
      className="relative z-10 px-4 pb-20 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header de la Colección */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>🎒 Bóveda Estelar</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tesoros Galácticos
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {stats.total} {stats.total === 1 ? 'recompensa desbloqueada' : 'recompensas desbloqueadas'} en tu viaje
        </p>
      </div>

      {/* Métricas rápidas por rareza */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto mb-6">
        {RARITY_ORDER.map((rarity) => {
          const config = getRarityConfig(rarity);
          const count = stats[rarity] || 0;
          return (
            <motion.div
              key={rarity}
              className={`glass-card p-3 text-center border ${config.colors.border}`}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <div className={`text-xl font-bold font-display ${config.colors.text}`}>
                {count}
              </div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                {config.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filtros de Rareza */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {FILTERS.map(({ key, label, emoji }) => {
          const isActive = filter === key;
          return (
            <motion.button
              key={key}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 border-purple-400/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
              onClick={() => setFilter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-1.5">{emoji}</span>
              {label}
              {key !== 'all' && stats[key] > 0 && (
                <span className="ml-1.5 text-[10px] opacity-75 font-mono">({stats[key]})</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Grid de premios */}
      <motion.div className="grid gap-4 sm:grid-cols-2" layout>
        <AnimatePresence mode="popLayout">
          {filteredInventory.map((prize, index) => (
            <PrizeCard
              key={prize.pullId}
              prize={prize}
              index={index}
              onRedeem={onRedeem}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Estado vacío por filtro */}
      {filteredInventory.length === 0 && filter !== 'all' && (
        <motion.div
          className="text-center py-10 glass-card max-w-sm mx-auto border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-3xl block mb-2">🔭</span>
          <p className="text-slate-400 text-sm font-medium">
            Aún no has descubierto premios {FILTERS.find((f) => f.key === filter)?.label.toLowerCase()}
          </p>
          <p className="text-slate-500 text-xs mt-1">¡Sigue girando la ruleta para hallarlos!</p>
        </motion.div>
      )}
    </motion.section>
  );
}
