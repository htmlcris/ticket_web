export default function handler(req, res) {
  // Solo devolvemos las claves de las variables de entorno, NUNCA los valores por seguridad
  const envKeys = Object.keys(process.env).filter(key => key.includes('KV') || key.includes('STORAGE') || key.includes('REDIS'));
  
  res.status(200).json({
    success: true,
    availableKeys: envKeys,
    message: "Verifica si KV_REST_API_URL o STORAGE_URL están en esta lista."
  });
}
