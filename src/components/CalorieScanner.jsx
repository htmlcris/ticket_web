/**
 * CalorieScanner.jsx — Escáner Bio-Estelar de Calorías con IA de Google Gemini.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalorieScanner() {
  const [photoBase64, setPhotoBase64] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Procesar archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoBase64(event.target.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Enviar a analizar con IA
  const handleAnalyze = async () => {
    if (!photoBase64) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photoBase64 }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'No se pudo analizar la imagen.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Hubo un error al conectar con el servidor cósmico.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 pt-8 pb-36 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header del Escáner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <span>🔬 IA Nutricional Gemini</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 tracking-tight">
          Escáner Bio-Estelar
        </h2>
        <p className="text-slate-300/80 text-xs sm:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
          Toma una foto de tu comida para descomponer sus componentes y calcular su energía calórica en segundos.
        </p>
      </div>

      {/* Contenedor Principal HUD */}
      <div className="glass-card p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden shadow-[0_15px_40px_-10px_rgba(16,185,129,0.15)]">
        
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Input Oculto */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="relative z-10 space-y-6">
          
          {/* Zona de Carga / Visor Fotográfico */}
          {!photoBase64 ? (
            <div 
              className="hud-bracket border-2 border-dashed border-emerald-400/25 hover:border-emerald-400/60 rounded-3xl p-10 sm:p-14 text-center cursor-pointer bg-black/30 hover:bg-emerald-950/20 transition-all duration-300 group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl sm:text-6xl mb-3 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                📸
              </div>
              <p className="text-white font-bold text-base sm:text-lg mb-1">
                Toca para capturar o subir tu platillo
              </p>
              <p className="text-slate-400 text-xs font-mono">
                CÁMARA O GALERÍA DISPONIBLE
              </p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/60">
              <img 
                src={photoBase64} 
                alt="Comida" 
                className="w-full h-auto max-h-84 object-cover"
              />
              
              {/* Overlay de Carga Futurista (Scanning Laser) */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Línea Láser Animada */}
                    <motion.div
                      className="scanner-laser"
                      animate={{ top: ['5%', '95%', '5%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    
                    {/* Retícula HUD */}
                    <div className="w-40 h-40 border border-emerald-400/40 rounded-2xl flex items-center justify-center relative animate-pulse">
                      <span className="text-4xl">🤖</span>
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                    </div>

                    <div className="mt-4 text-emerald-300 font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Analizando densidad calórica...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón para cambiar foto */}
              {!isAnalyzing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5"
                >
                  <span>📷</span> Cambiar foto
                </button>
              )}
            </div>
          )}

          {/* Errores */}
          {error && (
            <motion.div 
              className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs sm:text-sm text-center font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Botón Analizar */}
          {photoBase64 && !result && !isAnalyzing && (
            <motion.button
              className="w-full py-4 rounded-2xl text-base sm:text-lg font-bold text-white tracking-wide uppercase bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_6px_25px_rgba(16,185,129,0.35)]"
              onClick={handleAnalyze}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              ✨ Descomponer Calorías con IA ✨
            </motion.button>
          )}

          {/* Resultado de Telemetría Nutricional */}
          {result && (
            <motion.div 
              className="bg-black/50 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Encabezado del resultado */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                    PLATILLO DETECTADO
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {result.name}
                  </h3>
                </div>

                {/* Badge de estado saludable */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                  result.isHealthy 
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                    : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                }`}>
                  {result.isHealthy ? '✅ Saludable' : '⚠️ Moderación'}
                </span>
              </div>

              {/* Métrica principal de calorías */}
              <div className="my-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-slate-300 text-xs sm:text-sm font-medium">
                  Energía Total Estimada:
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  🔥 {result.calories} kcal
                </span>
              </div>

              {/* Desglose de ingredientes */}
              <div className="mb-5">
                <h4 className="text-[11px] text-slate-400 font-bold uppercase font-mono tracking-wider mb-2.5">
                  Desglose Nutricional por Ingrediente
                </h4>
                <div className="space-y-2">
                  {result.ingredients?.map((ing, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between items-center bg-white/5 border border-white/5 px-3.5 py-2.5 rounded-xl hover:border-emerald-500/30 transition-colors"
                    >
                      <span className="text-slate-200 text-xs sm:text-sm font-medium">
                        {ing.name}
                      </span>
                      <span className="text-emerald-300 text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                        {ing.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensaje del Nutricionista Virtual */}
              <div className="bg-emerald-500/10 p-4 rounded-xl text-xs sm:text-sm text-emerald-200 leading-relaxed border-l-3 border-emerald-400 relative">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                  💡 Diagnóstico del Nutricionista:
                </span>
                "{result.feedback}"
              </div>

              {/* Botón para escanear otro platillo */}
              <motion.button
                className="w-full mt-5 py-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider border border-white/10 hover:border-white/20 bg-white/5 transition-colors"
                onClick={() => {
                  setPhotoBase64(null);
                  setResult(null);
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                📸 Escanear otro platillo
              </motion.button>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
