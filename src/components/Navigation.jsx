/**
 * Navigation.jsx — Dock Flotante de Singularidad para Móvil.
 */

import { motion } from 'framer-motion';

export default function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'gacha', label: 'Ruleta Cósmica', icon: '🕳️' },
    { id: 'scanner', label: 'Escáner Nutricional', icon: '🥗' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        <div className="flex p-1.5 bg-black/80 border border-amber-500/25 rounded-3xl backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-amber-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-amber-600/80 to-yellow-600/80 border border-amber-300/40 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10 text-lg select-none filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                  {tab.icon}
                </span>
                <span className="relative z-10 font-display tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
