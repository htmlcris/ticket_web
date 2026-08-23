export default function handler(req, res) {
  const envKeys = Object.keys(process.env).filter(key => key.includes('KV') || key.includes('STORAGE') || key.includes('REDIS'));
  
  let redisUrlPrefix = 'NOT_SET';
  if (process.env.REDIS_URL) {
    redisUrlPrefix = process.env.REDIS_URL.substring(0, 10);
  }

  res.status(200).json({
    success: true,
    availableKeys: envKeys,
    redisUrlPrefix: redisUrlPrefix,
    message: "Verifica si KV_REST_API_URL o STORAGE_URL están en esta lista."
  });
}
