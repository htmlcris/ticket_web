/**
 * App.jsx — Componente raíz del Gacha Cósmico (Edición Singularidad & Agujero Negro).
 *
 * Flujo: Misiones Diarias → Tickets → Ruleta Singularidad → Bóveda de Premios
 * Navegación integrada con Escáner Bio-Estelar.
 */

import { useCallback, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import StarField from './components/StarField';
import Header from './components/Header';
import Activities from './components/Activities';
import GachaPull from './components/GachaPull';
import PrizeReveal from './components/PrizeReveal';
import Inventory from './components/Inventory';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import CalorieScanner from './components/CalorieScanner';

// Hooks
import { useGacha } from './hooks/useGacha';
import { useInventory } from './hooks/useInventory';
import { useTickets } from './hooks/useTickets';

// Services
import storageService from './services/storageService';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('admin=true')) {
      setIsAdmin(true);
      return;
    }

    storageService.init().then(() => {
      setIsReady(true);
    });
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (!isReady) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center flex-col relative overflow-hidden">
        <StarField count={60} />
        
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Orbe pulsante del Agujero Negro */}
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 blur-xl opacity-70 animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-black border border-amber-400/50 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(249,115,22,0.8)]">
              🕳️
            </div>
          </div>

          <h2 className="text-white font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Entrando al Horizonte de Sucesos...
          </h2>
          <p className="text-amber-200/80 text-xs sm:text-sm font-mono tracking-wider max-w-xs uppercase">
            Sincronizando Bóveda de Singularidad
          </p>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-200"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return <AppContent />;
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState('gacha');

  const {
    isPulling,
    isRevealing,
    isIdle,
    result,
    pull,
    reset,
  } = useGacha();

  const {
    inventory,
    addPrize,
    updatePrize,
    stats,
  } = useInventory();

  const {
    tickets,
    claimTicket,
    spendTicket,
    canClaim,
    getEvidence,
    hasTickets,
    exerciseStreak,
    exerciseWeekly,
  } = useTickets();

  const handlePull = useCallback(() => {
    const spent = spendTicket();
    if (!spent) return;
    pull((pullResult) => {
      addPrize(pullResult);
    });
  }, [spendTicket, pull, addPrize]);

  const handleCloseReveal = useCallback(() => {
    reset();
  }, [reset]);

  const handleRedeem = useCallback(async (pullId) => {
    try {
      const res = await fetch('/api/redeem', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullId }),
      });
      const result = await res.json();
      if (result.success) {
        updatePrize(result.prize);
      }
    } catch (err) {
      console.error('Error redeeming prize:', err);
    }
  }, [updatePrize]);

  return (
    <div className="bg-cosmic min-h-screen relative pb-28">
      <StarField count={70} />
      
      {currentTab === 'gacha' ? (
        <>
          <Header tickets={tickets} />

          {/* Divisor de haz de fotones */}
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
          </div>

          <Activities
            canClaim={canClaim}
            getEvidence={getEvidence}
            onClaimTicket={claimTicket}
            exerciseStreak={exerciseStreak}
            exerciseWeekly={exerciseWeekly}
          />

          {/* Divisor central con orbe de singularidad */}
          <div className="max-w-4xl mx-auto px-4 my-4">
            <div className="relative flex justify-center items-center">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div
                className="absolute w-64 h-4 pointer-events-none"
                style={{ 
                  background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.25) 0%, transparent 70%)',
                  filter: 'blur(6px)' 
                }}
              />
              <span className="absolute px-3 py-0.5 bg-black border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                ✦ ✦ ✦
              </span>
            </div>
          </div>

          <GachaPull
            isPulling={isPulling}
            isIdle={isIdle}
            isRevealing={isRevealing}
            result={result}
            onPull={handlePull}
            hasTickets={hasTickets}
          />
          
          <AnimatePresence>
            {isRevealing && result && (
              <PrizeReveal result={result} onClose={handleCloseReveal} />
            )}
          </AnimatePresence>

          {/* Divisor hacia la colección */}
          <div className="max-w-4xl mx-auto px-4 my-6">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />
          </div>

          <Inventory inventory={inventory} stats={stats} onRedeem={handleRedeem} />
        </>
      ) : (
        <CalorieScanner />
      )}

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
