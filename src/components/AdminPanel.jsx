/**
 * AdminPanel.jsx — Panel de observador en tiempo real.
 *
 * Muestra tickets, actividades, evidencias, historial de premios
 * con contador regresivo de 24h y botón "Marcar como cumplido".
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from './StarField';
import activities from '../data/activities';

/* ─── Utilidad: countdown ─────────────────────────────────────── */

/**
 * Calcula el tiempo restante desde `timestamp` hasta 24h después.
 * Devuelve null si ya venció.
 */
function getCountdown(timestamp) {
  const end = new Date(timestamp).getTime() + 24 * 60 * 60 * 1000;
  const diff = end - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return { h, m, s, diff };
}

/* ─── Sub-componente: contador de un premio ───────────────────── */

function PrizeCountdown({ prize, onRedeem }) {
  const [countdown, setCountdown] = useState(() => getCountdown(prize.timestamp));
  const [redeeming, setRedeeming] = useState(false);

  // Actualizar el contador cada segundo
  useEffect(() => {
    if (prize.redeemed) return;
    const timer = setInterval(() => {
      setCountdown(getCountdown(prize.timestamp));
    }, 1000);
    return () => clearInterval(timer);
  }, [prize.timestamp, prize.redeemed]);

  const handleRedeem = useCallback(async () => {
    if (redeeming) return;
    setRedeeming(true);
    try {
      await onRedeem(prize.pullId);
    } finally {
      setRedeeming(false);
    }
  }, [prize.pullId, onRedeem, redeeming]);

  const wonDate = new Date(prize.timestamp || Date.now());

  /* Estado: ya fue cumplido */
  if (prize.redeemed) {
    return (
      <motion.div
        className="glass-card p-4 border border-green-500/30 bg-green-500/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">{prize.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white truncate">{prize.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{prize.description}</div>
            <div className="text-xs text-slate-500 mt-1">
              Ganado: {wonDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })} — {wonDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-xs font-bold">
              <span>✅</span> Cumplido
            </div>
            {prize.redeemedAt && (
              <div className="text-xs text-slate-500 mt-1">
                {new Date(prize.redeemedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  /* Estado: tiempo agotado, pendiente de cumplir */
  if (!countdown) {
    return (
      <motion.div
        className="glass-card p-4 border border-orange-500/40 bg-orange-500/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{prize.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white truncate">{prize.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{prize.description}</div>
            <div className="text-xs text-orange-400 mt-1 font-medium">⏰ ¡Las 24h ya vencieron! Pendiente de cumplir.</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Ganado: {wonDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} {wonDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <motion.button
            className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
            onClick={handleRedeem}
            disabled={redeeming}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {redeeming ? '⏳...' : '✅ Marcar cumplido'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  /* Estado: cuenta regresiva activa */
  const urgency = countdown.diff < 3_600_000; // menos de 1h
  const borderColor = urgency ? 'border-red-500/40' : 'border-purple-500/30';
  const bgColor = urgency ? 'bg-red-500/5' : 'bg-purple-500/5';

  return (
    <motion.div
      className={`glass-card p-4 border ${borderColor} ${bgColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-4">
        {/* Emoji + rareza */}
        <div className="flex-shrink-0 text-center">
          <div className="text-4xl">{prize.emoji}</div>
          <div className={`text-[10px] mt-1 font-bold uppercase tracking-wide ${
            prize.rarity === 'legendary' ? 'text-yellow-400' :
            prize.rarity === 'rare' ? 'text-purple-400' : 'text-blue-400'
          }`}>
            {prize.rarity === 'legendary' ? '⭐ Leg.' : prize.rarity === 'rare' ? '🌙 Raro' : '💫 Com.'}
          </div>
        </div>

        {/* Info del premio */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white">{prize.name}</div>
          <div className="text-xs text-slate-400 mt-0.5">{prize.description}</div>
          <div className="text-xs text-slate-500 mt-1">
            Ganado: {wonDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} — {wonDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Countdown display */}
          <div className={`mt-2 flex items-center gap-2 ${urgency ? 'text-red-400' : 'text-slate-300'}`}>
            <span className="text-xs font-medium">{urgency ? '🔴' : '🕐'} Tiempo restante:</span>
            <div className="flex gap-1">
              {[
                { val: countdown.h, unit: 'h' },
                { val: countdown.m, unit: 'm' },
                { val: countdown.s, unit: 's' },
              ].map(({ val, unit }) => (
                <span
                  key={unit}
                  className={`inline-block min-w-[28px] text-center px-1.5 py-0.5 rounded text-xs font-mono font-bold ${
                    urgency
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  {String(val).padStart(2, '0')}{unit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Botón marcar cumplido */}
        <motion.button
          className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
          onClick={handleRedeem}
          disabled={redeeming}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ boxShadow: '0 4px 20px rgba(168,85,247,0.4)' }}
        >
          {redeeming ? '⏳...' : '✅ Cumplido'}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Panel principal ─────────────────────────────────────────── */

export default function AdminPanel() {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setData(result.data);
          setLastUpdate(new Date());
          setErrorMsg(null);
        }
      } else {
        setErrorMsg(`Error ${res.status}: La base de datos no está respondiendo.`);
      }
    } catch (error) {
      console.error('Error fetching state in AdminPanel:', error);
      setErrorMsg('No se pudo conectar al servidor.');
    }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [fetchState]);

  /* Marcar un premio como cumplido */
  const handleRedeem = useCallback(async (pullId) => {
    try {
      const res = await fetch('/api/redeem', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pullId }),
      });
      const result = await res.json();
      if (result.success) {
        // Actualizar localmente sin esperar al next poll
        setData((prev) => {
          if (!prev) return prev;
          const inv = (prev['gacha_cosmico_inventory'] || []).map((p) =>
            p.pullId === pullId ? result.prize : p
          );
          return { ...prev, gacha_cosmico_inventory: inv };
        });
      }
    } catch (err) {
      console.error('Error redeeming prize:', err);
    }
  }, []);

  /* ── Pantalla de carga / error ── */
  if (!data) {
    return (
      <div className="bg-cosmic min-h-screen flex items-center justify-center flex-col relative text-white">
        <StarField count={50} />
        {errorMsg ? (
          <motion.div
            className="bg-red-500/20 border border-red-500/60 p-6 rounded-2xl max-w-md text-center z-10 glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error de Conexión</h2>
            <p className="text-red-200 text-sm">{errorMsg}</p>
            <p className="text-xs mt-4 text-slate-400">
              La base de datos de Vercel KV no está respondiendo.
            </p>
            <button
              onClick={fetchState}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              🔄 Reintentar
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="text-5xl mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🌀
            </motion.div>
            <h2 className="font-display text-xl">Cargando Panel de Observador...</h2>
            <p className="text-slate-500 text-sm mt-2">Conectando con la base de datos</p>
          </>
        )}
      </div>
    );
  }

  const tickets = data['gacha_cosmico_tickets'] || 0;
  const inventory = data['gacha_cosmico_inventory'] || [];
  const activityLog = data['gacha_cosmico_activity_log'] || [];
  const pullCount = data['gacha_cosmico_pull_count'] || 0;

  const pendingPrizes = inventory.filter((p) => !p.redeemed);
  const redeemedPrizes = inventory.filter((p) => p.redeemed);

  return (
    <div className="bg-cosmic min-h-screen relative p-4 sm:p-8 text-white overflow-y-auto">
      <StarField count={80} />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header del panel */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              👁️ Panel de Observador
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              🔄 Actualizado: {lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors border border-white/10"
          >
            ← Salir
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { emoji: '🎟️', val: tickets, label: 'Tickets' },
            { emoji: '🎰', val: pullCount, label: 'Tiradas' },
            { emoji: '🎁', val: inventory.length, label: 'Premios' },
            { emoji: '📸', val: activityLog.length, label: 'Evidencias hoy' },
          ].map(({ emoji, val, label }) => (
            <div key={label} className="glass-card p-4 text-center border border-white/10">
              <span className="text-3xl block mb-2">{emoji}</span>
              <div className="text-2xl font-bold font-display">{val}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Premios pendientes de cumplir ── */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
            🏆 Premios Ganados
            {pendingPrizes.length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 bg-purple-500/30 border border-purple-500/50 rounded-full text-purple-300 text-xs font-bold">
                {pendingPrizes.length} pendiente{pendingPrizes.length > 1 ? 's' : ''}
              </span>
            )}
          </h2>

          {inventory.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400 border-dashed border border-white/15">
              Aún no se ha ganado ningún premio.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {/* Primero los pendientes, luego los cumplidos */}
                {[...pendingPrizes, ...redeemedPrizes].map((prize) => (
                  <PrizeCountdown
                    key={prize.pullId}
                    prize={prize}
                    onRedeem={handleRedeem}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>

        {/* ── Evidencias subidas hoy ── */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
            📸 Evidencias Subidas Hoy
          </h2>

          {activityLog.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-400 border-dashed border border-white/15">
              Aún no se ha subido ninguna foto de evidencia hoy.
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              {activityLog.map((log, index) => {
                const act = activities.find((a) => a.id === log.activityId);
                const date = new Date(log.completedAt);
                return (
                  <motion.div
                    key={index}
                    className="glass-card overflow-hidden border border-white/10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="h-44 bg-black/40 relative">
                      <img
                        src={log.photoBase64}
                        alt="Evidencia"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-bold text-white">
                        {act ? `${act.emoji} ${act.name}` : log.activityId}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
