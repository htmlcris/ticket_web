/**
 * App.jsx — Componente raíz del Gacha Cósmico v2.
 *
 * Nuevo flujo: Actividades → Tickets → Ruleta → Inventario
 * Layout de scroll vertical en una sola vista.
 */

import { useCallback } from 'react';
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

export default function App() {
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

  /**
   * Ejecuta una tirada: gasta 1 ticket → pull → agrega al inventario.
   */
  const handlePull = useCallback(() => {
    // Gastar ticket primero
    const spent = spendTicket();
    if (!spent) return;

    // Ejecutar tirada
    pull((pullResult) => {
      addPrize(pullResult);
    });
  }, [spendTicket, pull, addPrize]);

  /**
   * Cierra el reveal y vuelve al estado idle.
   */
  const handleCloseReveal = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-cosmic min-h-screen relative">
      {/* Fondo de estrellas */}
      <StarField count={80} />

      {/* Header con título y contador de tickets */}
      <Header tickets={tickets} />

      {/* Sección de actividades del día */}
      <Activities
        canClaim={canClaim}
        getEvidence={getEvidence}
        onClaimTicket={claimTicket}
      />

      {/* Divisor visual */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Zona principal del gacha */}
      <GachaPull
        isPulling={isPulling}
        isIdle={isIdle}
        isRevealing={isRevealing}
        result={result}
        onPull={handlePull}
        hasTickets={hasTickets}
      />

      {/* Modal de revelación del premio */}
      <AnimatePresence>
        {isRevealing && result && (
          <PrizeReveal
            result={result}
            onClose={handleCloseReveal}
          />
        )}
      </AnimatePresence>

      {/* Divisor visual */}
      <div className="max-w-3xl mx-auto px-4 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Inventario de premios obtenidos */}
      <Inventory
        inventory={inventory}
        stats={stats}
      />
    </div>
  );
}
