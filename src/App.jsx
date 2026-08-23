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
import AdminPanel from './components/AdminPanel';

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
    // Verificar si estamos en modo admin
    if (window.location.search.includes('admin=true')) {
      setIsAdmin(true);
      return; // No necesitamos cargar el storageService normal si somos admin
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

  // Marca un premio como cumplido llamando al API
  const handleRedeem = useCallback(async (pullId) => {
    try {
      const res = await fetch('/api/redeem', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullId }),
      });
      const result = await res.json();
      if (result.success) {
        // Actualizar el prize en el inventario local (reemplaza el existente)
        updatePrize(result.prize);
      }
    } catch (err) {
      console.error('Error redeeming prize:', err);
    }
  }, [updatePrize]);

  return (
    <div className="bg-cosmic min-h-screen relative">
      <StarField count={100} />
      <Header tickets={tickets} />

      {/* Separador decorativo */}
      <div className="max-w-3xl mx-auto px-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <Activities
        canClaim={canClaim}
        getEvidence={getEvidence}
        onClaimTicket={claimTicket}
      />

      {/* Separador decorativo con glow */}
      <div className="max-w-3xl mx-auto px-4 mb-2">
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%)', height: '1px', filter: 'blur(3px)' }}
          />
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

      {/* Separador decorativo */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <Inventory inventory={inventory} stats={stats} onRedeem={handleRedeem} />
    </div>
  );
}
