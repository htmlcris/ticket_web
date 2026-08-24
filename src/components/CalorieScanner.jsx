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
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoBase64(event.target.result);
      setResult(null); // Resetear resultado previo
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
      setError('Hubo un error al conectar con el servidor.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 pt-10 pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
          🥗 Escáner de Calorías IA
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Sube la foto de tu comida y deja que nuestra Inteligencia Artificial estime las calorías y nutrientes.
        </p>
      </div>

      <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
        
        {/* Glow de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 pointer-events-none" />
        
        {/* Input Oculto */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="relative z-10 space-y-6">
          
          {/* Preview o Placeholder */}
          {!photoBase64 ? (
            <div 
              className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-3">📸</div>
              <p className="text-white font-medium mb-1">Toca para abrir la cámara</p>
              <p className="text-slate-500 text-xs">O selecciona una foto de tu galería</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={photoBase64} 
                alt="Comida" 
                className="w-full h-auto max-h-80 object-cover"
              />
              
              {/* Overlay de Carga (Scanning) */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div 
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-full h-1 bg-emerald-400 absolute top-0 shadow-[0_0_15px_#34d399]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="text-4xl mb-4 animate-pulse">🤖</div>
                    <div className="text-emerald-400 font-bold tracking-widest text-sm uppercase">
                      Analizando...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón para cambiar foto (Solo visible si no está analizando) */}
              {!isAnalyzing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-full text-white/70 hover:text-white border border-white/20 transition-colors"
                >
                  ✏️
                </button>
              )}
            </div>
          )}

          {/* Errores */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Botón Analizar */}
          {photoBase64 && !result && !isAnalyzing && (
            <motion.button
              className="w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
              onClick={handleAnalyze}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✨ Descubrir Calorías ✨
            </motion.button>
          )}

          {/* Resultado */}
          {result && (
            <motion.div 
              className="bg-black/40 border border-emerald-500/30 rounded-xl p-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-xl font-bold text-white mb-1 font-display">
                {result.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${result.isHealthy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.isHealthy ? '✅ Saludable' : '⚠️ Cuidado'}
                </span>
                <span className="text-emerald-300 font-mono font-bold">
                  🔥 {result.calories} kcal
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
                  Desglose Nutricional
                </h4>
                <div className="space-y-2">
                  {result.ingredients?.map((ing, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 border border-white/5 px-3 py-2 rounded-lg">
                      <span className="text-slate-300 text-sm font-medium">{ing.name}</span>
                      <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">
                        {ing.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded-lg text-sm text-emerald-200 italic border-l-2 border-emerald-500">
                "{result.feedback}"
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
