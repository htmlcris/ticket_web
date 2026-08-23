import Redis from 'ioredis';

const getRedisClient = () => {
  const url = process.env.REDIS_URL || process.env.KV_REST_API_URL || process.env.STORAGE_URL;
  if (!url) {
    return null;
  }
  return new Redis(url);
};

const redis = getRedisClient();

export default async function handler(req, res) {
  const STATE_KEY = 'gacha_global_state';
  
  if (!redis) {
    return res.status(500).json({ success: false, error: 'No Redis URL provided in environment.' });
  }

  try {
    if (req.method === 'GET') {
      const stateStr = await redis.get(STATE_KEY);
      const state = stateStr ? JSON.parse(stateStr) : null;
      
      if (!state) {
        return res.status(200).json({
          success: true,
          data: {
            tickets: 0,
            activityLog: {},
            inventory: [],
            pullCount: 0,
            lastResetDate: null
          }
        });
      }
      
      return res.status(200).json({ success: true, data: state });
    } 
    
    else if (req.method === 'POST') {
      const newState = req.body;
      
      if (!newState) {
        return res.status(400).json({ success: false, error: 'No data provided' });
      }

      await redis.set(STATE_KEY, JSON.stringify(newState));
      return res.status(200).json({ success: true });
    } 
    
    else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error in /api/state:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
