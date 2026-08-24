import { motion } from 'framer-motion';

export default function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'gacha', label: 'Gacha', icon: '🎰' },
    { id: 'scanner', label: 'Escáner IA', icon: '🥗' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/80 to-transparent backdrop-blur-sm pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-pink-500/40 border border-white/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-xl">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
