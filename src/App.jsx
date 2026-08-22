/**
 * App.jsx — Componente raíz del Gacha Cósmico v2.
 *
 * Nuevo flujo: Actividades → Tickets → Ruleta → Inventario
 * Layout de scroll vertical en una sola vista.
 */

import { useCallback, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import StarField from './components/StarField';
import Header from './components/Header';
import Activities from './components/Activities';
import GachaPull from './components/GachaPull';
import PrizeReveal from './components/PrizeReveal';
import Inventory from './components/Inventory';

// Hooks
import { useGacha } from './hooks/useGacha';
import { useInventory } from './hooks/useInventory';
import { useTickets } from './hooks/useTickets';

// Services
import storageService from './services/storageService';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    storageService.init().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <div className="bg-cosmic min-h-screen flex items-center justify-center flex-col relative">
        <StarField count={80} />
        <span className="text-5xl animate-bounce mb-6">🚀</span>
        <h2 className="text-white font-display text-2xl font-bold animate-pulse">
          Conectando con el universo...
        </h2>
        <p className="text-slate-400 mt-2 text-sm">Sincronizando base de datos global</p>
      </div>
    );
  }

  return <AppContent />;
}

function AppContent() {
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
    stats,
  } = useInventory();

  const {
    tickets,
    claimTicket,
    spendTicket,
    canClaim,
    getEvidence,
    hasTickets,
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

  return (
    <div className="bg-cosmic min-h-screen relative">
      <StarField count={80} />
      <Header tickets={tickets} />
      <Activities
        canClaim={canClaim}
        getEvidence={getEvidence}
        onClaimTicket={claimTicket}
      />
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <Inventory inventory={inventory} stats={stats} />
    </div>
  );
}
