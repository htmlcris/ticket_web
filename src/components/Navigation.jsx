/**
 * Navigation.jsx — Barra de navegación flotante tipo Dock Galáctico.
 */

import { motion } from 'framer-motion';

export default function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'gacha', label: 'Gacha Cósmico', icon: '🪐' },
    { id: 'scanner', label: 'Escáner Nutricional', icon: '🥗' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-[#030014] via-[#030014]/90 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        <div className="flex p-1.5 bg-black/60 border border-white/15 rounded-3xl backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/70 via-fuchsia-600/70 to-pink-600/70 border border-white/30 rounded-2xl shadow-[0_0_20px_rgba(192,38,211,0.4)]"
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
