/**
 * /api/state.js
 *
 * Endpoint para gestionar el estado global del Gacha en la base de datos Redis.
 * - GET: Retorna todo el estado (tickets, activities, inventory, etc)
 * - POST: Actualiza el estado global
 */

import { createClient } from '@vercel/kv';

const getKVClient = () => {
  // Intentar usar las variables por defecto de Vercel KV
  let url = process.env.KV_REST_API_URL;
  let token = process.env.KV_REST_API_TOKEN;

  // Si no existen, intentar con el prefijo "STORAGE_" (que es el que se usó al vincular)
  if (!url) {
    url = process.env.STORAGE_REST_API_URL || process.env.STORAGE_URL;
    token = process.env.STORAGE_REST_API_TOKEN || process.env.STORAGE_TOKEN;
  }

  // Si a pesar de todo no existen, retornar cliente genérico (que fallará con 500)
  return createClient({
    url: url || '',
    token: token || ''
  });
};

const kv = getKVClient();

export default async function handler(req, res) {
  const STATE_KEY = 'gacha_global_state';
  if (!process.env.KV_REST_API_URL && !process.env.KV_URL) {
    console.warn('Advertencia: No se detectaron las variables de entorno de Redis.');
  }

  try {
    if (req.method === 'GET') {
      // 1. Obtener el estado actual
      const state = await kv.get(STATE_KEY);
      
      // Si no hay estado previo, devolvemos un estado por defecto limpio
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
      // 2. Guardar nuevo estado
      const newState = req.body;
      
      if (!newState) {
        return res.status(400).json({ success: false, error: 'No data provided' });
      }

      await kv.set(STATE_KEY, newState);
      return res.status(200).json({ success: true });
    } 
    
    else {
      // Método no soportado
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Error in /api/state:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
