import { useState, useEffect } from 'react';
import StarField from './StarField';
import activities from '../data/activities';

export default function AdminPanel() {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setData(result.data);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Error fetching state in AdminPanel:', error);
    }
  };

  useEffect(() => {
    // Fetch initial state
    fetchState();

    // Poll every 5 seconds
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="bg-cosmic min-h-screen flex items-center justify-center flex-col relative text-white">
        <StarField count={50} />
        <span className="text-4xl animate-spin mb-4">🌀</span>
        <h2 className="font-display">Cargando Panel de Observador...</h2>
      </div>
    );
  }

  const { tickets, inventory, activityLog, pullCount } = data;

  return (
    <div className="bg-cosmic min-h-screen relative p-4 sm:p-8 text-white overflow-y-auto">
      <StarField count={80} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Modo Observador
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Actualizado en tiempo real (Última vez: {lastUpdate.toLocaleTimeString()})
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            Salir al Gacha
          </button>
        </div>

        {/* Stats Flexbox */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <span className="text-3xl block mb-2">🎟️</span>
            <div className="text-2xl font-bold">{tickets || 0}</div>
            <div className="text-xs text-slate-400">Tickets Actuales</div>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-3xl block mb-2">🎰</span>
            <div className="text-2xl font-bold">{pullCount || 0}</div>
            <div className="text-xs text-slate-400">Tiradas Totales</div>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-3xl block mb-2">🎁</span>
            <div className="text-2xl font-bold">{inventory ? inventory.length : 0}</div>
            <div className="text-xs text-slate-400">Premios Ganados</div>
          </div>
          <div className="glass-card p-4 text-center">
            <span className="text-3xl block mb-2">📸</span>
            <div className="text-2xl font-bold">{activityLog ? activityLog.length : 0}</div>
            <div className="text-xs text-slate-400">Evidencias Hoy</div>
          </div>
        </div>

        {/* Evidencias Hoy */}
        <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
          📸 Evidencias Subidas Hoy
        </h2>
        
        {(!activityLog || activityLog.length === 0) ? (
          <div className="glass-card p-8 text-center text-slate-400 mb-8 border-dashed border border-white/20">
            Aún no se ha subido ninguna foto de evidencia el día de hoy.
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {activityLog.map((log, index) => {
              const act = activities.find(a => a.id === log.activityId);
              const date = new Date(log.completedAt);
              return (
                <div key={index} className="glass-card overflow-hidden">
                  <div className="h-40 bg-black/50">
                    <img 
                      src={log.photoBase64} 
                      alt="Evidencia" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-bold">{act ? act.name : log.activityId}</div>
                    <div className="text-xs text-slate-400">
                      Subida a las {date.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Historial de Premios */}
        <h2 className="text-xl font-bold mb-4 font-display flex items-center gap-2">
          🏆 Historial de Premios Obtenidos
        </h2>

        {(!inventory || inventory.length === 0) ? (
          <div className="glass-card p-8 text-center text-slate-400 border-dashed border border-white/20">
            Aún no se ha ganado ningún premio.
          </div>
        ) : (
          <div className="space-y-3">
            {inventory.map((prize, idx) => {
              const date = new Date(prize.timestamp || Date.now());
              return (
                <div key={idx} className="glass-card p-4 flex items-center gap-4">
                  <div className="text-4xl">{prize.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold">{prize.name}</div>
                    <div className="text-sm text-slate-300">{prize.description}</div>
                  </div>
                  <div className="text-xs text-slate-400 text-right">
                    <div>{date.toLocaleDateString()}</div>
                    <div>{date.toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
