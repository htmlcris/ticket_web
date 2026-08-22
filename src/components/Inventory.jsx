/**
 * Inventory.jsx — Vista del inventario de premios obtenidos.
 *
 * Muestra los premios en un grid con filtros por rareza,
 * estadísticas generales y animaciones de entrada.
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

export default function Inventory({ inventory, stats }) {
  const [filter, setFilter] = useState('all');

  const filteredInventory = useMemo(() => {
    if (filter === 'all') return inventory;
    return inventory.filter((p) => p.rarity === filter);
  }, [inventory, filter]);

  if (inventory.length === 0) return null;

  return (
    <motion.section
      className="relative z-10 px-4 pb-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* Header del inventario */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          🎒 Tu Colección
        </h2>
        <p className="text-slate-400 text-sm">
          {stats.total} {stats.total === 1 ? 'premio obtenido' : 'premios obtenidos'}
        </p>
      </div>

      {/* Stats rápidas */}
      <div className="flex justify-center gap-4 sm:gap-6 mb-6">
        {RARITY_ORDER.map((rarity) => {
          const config = getRarityConfig(rarity);
          const count = stats[rarity] || 0;
          return (
            <motion.div
              key={rarity}
              className={`glass-card px-3 py-2 text-center min-w-[70px] ${config.colors.border} border`}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`text-lg font-bold font-display ${config.colors.text}`}>
                {count}
              </div>
              <div className="text-xs text-slate-400">{config.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {FILTERS.map(({ key, label, emoji }) => (
          <motion.button
            key={key}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === key
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
            }`}
            onClick={() => setFilter(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">{emoji}</span>
            {label}
            {key !== 'all' && stats[key] > 0 && (
              <span className="ml-1 text-xs opacity-60">({stats[key]})</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Grid de premios */}
      <motion.div className="grid gap-3 sm:grid-cols-2" layout>
        <AnimatePresence mode="popLayout">
          {filteredInventory.map((prize, index) => (
            <PrizeCard
              key={prize.pullId}
              prize={prize}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state para filtro */}
      {filteredInventory.length === 0 && filter !== 'all' && (
        <motion.p
          className="text-center text-slate-500 py-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Aún no tienes premios {FILTERS.find((f) => f.key === filter)?.label.toLowerCase()} 🌠
        </motion.p>
      )}
    </motion.section>
  );
}
