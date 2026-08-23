/**
 * EvidenceModal.jsx — Modal para subir evidencia fotográfica.
 *
 * Permite seleccionar una foto, muestra preview,
 * comprime a thumbnail (~400px, JPEG 60%) para LocalStorage,
 * y confirma o cancela.
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Comprime una imagen a un thumbnail de max 400px, JPEG al 60%.
 * Retorna una promesa con el base64 resultante.
 *
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo en píxeles
 * @param {number} quality - Calidad JPEG (0-1)
 * @returns {Promise<string>} Base64 de la imagen comprimida
 */
function compressImage(file, maxWidth = 400, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Redimensionar manteniendo proporción
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

  /**
   * Maneja la selección de archivo: genera preview y comprime.
   */
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen');
      return;
    }

    setIsProcessing(true);

    try {
      // Preview rápida (sin comprimir)
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Comprimir para almacenar
      const compressed = await compressImage(file);
      setCompressedBase64(compressed);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Confirma la evidencia y envía el base64 comprimido.
   */
  const handleConfirm = useCallback(() => {
    if (compressedBase64) {
      onConfirm(compressedBase64);
      // Reset state
      setPreview(null);
      setCompressedBase64(null);
    }
  }, [compressedBase64, onConfirm]);

  /**
   * Cancela y limpia el estado.
   */
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
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleCancel}
        />

        {/* Modal card */}
        <motion.div
          className="relative glass-card p-6 sm:p-8 max-w-sm w-full z-10"
          style={{ borderColor: `${activity.color}30` }}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <span className="text-4xl mb-2 block">{activity.emoji}</span>
            <h3 className="font-display font-bold text-xl text-white mb-1">
              {activity.name}
            </h3>
            <p className="text-slate-400 text-sm">
              Sube una foto como evidencia para ganar 🎟️ +1 ticket
            </p>
          </div>

          {/* Preview de imagen */}
          {preview ? (
            <motion.div
              className="mb-5 rounded-xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={preview}
                alt="Evidencia"
                className="w-full h-48 object-cover"
              />
            </motion.div>
          ) : (
            /* Zona de subida */
            <label
              className="mb-5 flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-white/15 hover:border-white/30 cursor-pointer transition-colors bg-white/[0.02]"
              htmlFor="evidence-photo"
            >
              <span className="text-3xl mb-2">📸</span>
              <span className="text-slate-400 text-sm text-center px-4">
                Toca para seleccionar una foto
              </span>
            </label>
          )}

          {/* Input de archivo (oculto) */}
          <input
            ref={fileInputRef}
            id="evidence-photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Botones */}
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <motion.button
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                compressedBase64
                  ? 'bg-gradient-to-r text-white shadow-lg'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
              style={
                compressedBase64
                  ? {
                      backgroundImage: `linear-gradient(135deg, ${activity.color}, ${activity.color}cc)`,
                      boxShadow: `0 4px 20px ${activity.color}40`,
                    }
                  : {}
              }
              disabled={!compressedBase64 || isProcessing}
              onClick={handleConfirm}
              whileHover={compressedBase64 ? { scale: 1.03 } : {}}
              whileTap={compressedBase64 ? { scale: 0.97 } : {}}
            >
              {isProcessing ? '⏳ Procesando...' : '✅ Confirmar'}
            </motion.button>
          </div>

          {/* Cambiar foto si ya hay preview */}
          {preview && (
            <button
              className="w-full mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              📷 Cambiar foto
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
