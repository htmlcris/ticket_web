/**
 * EvidenceModal.jsx — Modal holográfico para subir evidencia de misiones cósmicas.
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function compressImage(file, maxWidth = 400, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EvidenceModal({ activity, isOpen, onConfirm, onCancel }) {
  const [preview, setPreview] = useState(null);
  const [compressedBase64, setCompressedBase64] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    setIsProcessing(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      const compressed = await compressImage(file);
      setCompressedBase64(compressed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (compressedBase64) {
      onConfirm(compressedBase64);
      setPreview(null);
      setCompressedBase64(null);
    }
  }, [compressedBase64, onConfirm]);

  const handleCancel = useCallback(() => {
    setPreview(null);
    setCompressedBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCancel();
  }, [onCancel]);

  if (!isOpen || !activity) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop con blur */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCancel}
        />

        {/* Modal Card */}
        <motion.div
          className="relative glass-card p-6 sm:p-8 max-w-md w-full z-10 border shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
          style={{ borderColor: `${activity.color}50` }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div 
              className="text-4xl w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 border shadow-inner"
              style={{ 
                backgroundColor: activity.colorLight,
                borderColor: `${activity.color}40`,
                boxShadow: `0 0 20px ${activity.color}30` 
              }}
            >
              {activity.emoji}
            </div>
            
            <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
              {activity.name}
            </h3>
            
            <p className="text-slate-300/80 text-xs sm:text-sm mt-1">
              Adjunta una foto como prueba para desbloquear <span className="text-amber-300 font-bold">🎟️ +1 Ticket</span>
            </p>
          </div>

          {/* Preview o Zona de Subida */}
          {preview ? (
            <motion.div
              className="mb-6 rounded-2xl overflow-hidden border border-white/20 relative shadow-lg"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={preview}
                alt="Evidencia"
                className="w-full h-52 object-cover"
              />
              <button
                className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white/90 hover:text-white border border-white/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                📷 Cambiar foto
              </button>
            </motion.div>
          ) : (
            <label
              className="hud-bracket mb-6 flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 cursor-pointer transition-all bg-black/30 hover:bg-white/[0.03] group"
              htmlFor="evidence-photo"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                📸
              </span>
              <span className="text-white text-sm font-semibold mb-0.5">
                Tomar foto o seleccionar archivo
              </span>
              <span className="text-slate-400 text-xs font-mono">
                CÁMARA / GALERÍA
              </span>
            </label>
          )}

          {/* Input oculto */}
          <input
            ref={fileInputRef}
            id="evidence-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold border border-white/10 text-slate-300 hover:bg-white/5 transition-colors uppercase tracking-wider"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <motion.button
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-md ${
                compressedBase64
                  ? 'bg-gradient-to-r text-white'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
              style={
                compressedBase64
                  ? {
                      backgroundImage: `linear-gradient(135deg, ${activity.color}, ${activity.color}bb)`,
                      boxShadow: `0 4px 20px ${activity.color}50`,
                    }
                  : {}
              }
              disabled={!compressedBase64 || isProcessing}
              onClick={handleConfirm}
              whileHover={compressedBase64 ? { scale: 1.02 } : {}}
              whileTap={compressedBase64 ? { scale: 0.98 } : {}}
            >
              {isProcessing ? '⏳ Procesando...' : '✨ Confirmar'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
