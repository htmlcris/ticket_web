/**
 * storageService.js — Abstracción de persistencia con soporte Vercel KV.
 *
 * Mantiene un caché síncrono en memoria para que los hooks funcionen rápido,
 * y sincroniza de fondo con la base de datos (/api/state) y LocalStorage (fallback).
 */

const KEYS = {
  INVENTORY: 'gacha_cosmico_inventory',
  PULL_COUNT: 'gacha_cosmico_pull_count',
  SETTINGS: 'gacha_cosmico_settings',
  TICKETS: 'gacha_cosmico_tickets',
  ACTIVITY_LOG: 'gacha_cosmico_activity_log',
  LAST_RESET_DATE: 'gacha_cosmico_last_reset',
  EXERCISE_STREAK: 'gacha_cosmico_exercise_streak',
  EXERCISE_WEEKLY: 'gacha_cosmico_exercise_weekly',
  EXERCISE_WEEK_ID: 'gacha_cosmico_exercise_week_id',
};

// Caché en memoria (se llena al hacer .init())
let memoryCache = {
  [KEYS.INVENTORY]: [],
  [KEYS.PULL_COUNT]: 0,
  [KEYS.SETTINGS]: { soundEnabled: true },
  [KEYS.TICKETS]: 0,
  [KEYS.ACTIVITY_LOG]: [],
  [KEYS.LAST_RESET_DATE]: null,
  [KEYS.EXERCISE_STREAK]: 0,
  [KEYS.EXERCISE_WEEKLY]: 0,
  [KEYS.EXERCISE_WEEK_ID]: null,
};

// Bandera para saber si ya cargamos de la DB
let isInitialized = false;

/**
 * Lee un valor del caché en memoria (y si no existe, de LocalStorage).
 */
function safeGet(key, fallback) {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key];
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

/**
 * Actualiza el caché local, LocalStorage y sincroniza con la nube.
 */
function safeSet(key, value) {
  // 1. Actualizar caché en memoria
  memoryCache[key] = value;
  
  // 2. Guardar en LocalStorage como respaldo
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}

  // 3. Sincronizar con la base de datos de forma asíncrona (si está inicializado)
  if (isInitialized) {
    syncToCloud();
  }
}

/**
 * Envía el estado completo a Vercel KV.
 * Se hace en background (fire and forget) para no bloquear la UI.
 */
let syncTimeout = null;
function syncToCloud() {
  // Usamos un debounce para no saturar la API si se hacen muchos cambios rápidos
  if (syncTimeout) clearTimeout(syncTimeout);
  
  syncTimeout = setTimeout(() => {
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memoryCache)
    }).catch(err => console.warn('Error sincronizando con la nube:', err));
  }, 1000);
}

/**
 * Devuelve un string identificador para la semana actual (empezando en Lunes).
 * Ej: "2026-08-17" para toda la semana del 17 al 23 de agosto.
 */
function getCurrentWeekId() {
  const now = new Date();
  const day = now.getDay();
  // day es 0 para Domingo, 1 para Lunes. Convertimos para que Lunes sea el inicio.
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

const storageService = {
  /**
   * Inicializa el servicio conectándose a la base de datos de Vercel.
   * Llama a esta función cuando la App carga.
   */
  async init() {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Volcar datos de la nube en nuestro caché local
          const data = result.data;
          
          memoryCache = {
            [KEYS.INVENTORY]: data[KEYS.INVENTORY] || [],
            [KEYS.PULL_COUNT]: data[KEYS.PULL_COUNT] || 0,
            [KEYS.SETTINGS]: data[KEYS.SETTINGS] || { soundEnabled: true },
            [KEYS.TICKETS]: data[KEYS.TICKETS] || 0,
            [KEYS.ACTIVITY_LOG]: data[KEYS.ACTIVITY_LOG] || [],
            [KEYS.LAST_RESET_DATE]: data[KEYS.LAST_RESET_DATE] || null,
            [KEYS.EXERCISE_STREAK]: data[KEYS.EXERCISE_STREAK] || 0,
            [KEYS.EXERCISE_WEEKLY]: data[KEYS.EXERCISE_WEEKLY] || 0,
            [KEYS.EXERCISE_WEEK_ID]: data[KEYS.EXERCISE_WEEK_ID] || null,
          };
          
          // Actualizar LocalStorage con lo que vino de la nube
          Object.keys(memoryCache).forEach(key => {
            try { localStorage.setItem(key, JSON.stringify(memoryCache[key])); } catch(e) {}
          });
        }
      }
    } catch (error) {
      console.warn('No se pudo cargar de la nube, usando LocalStorage local.', error);
      // Fallback: cargar de localStorage al caché de memoria
      Object.keys(KEYS).forEach(k => {
        const key = KEYS[k];
        memoryCache[key] = safeGet(key, memoryCache[key]);
      });
    } finally {
      isInitialized = true;
    }
  },

  // --- Inventario ---

  getInventory() { return safeGet(KEYS.INVENTORY, []); },
  saveInventory(inventory) { safeSet(KEYS.INVENTORY, inventory); },
  
  addPrize(prize) {
    const inventory = this.getInventory();
    const updated = [prize, ...inventory];
    this.saveInventory(updated);
    return updated;
  },

  removePrize(pullId) {
    const inventory = this.getInventory();
    const updated = inventory.filter((p) => p.pullId !== pullId);
    this.saveInventory(updated);
    return updated;
  },

  // --- Contador de tiradas ---

  getPullCount() { return safeGet(KEYS.PULL_COUNT, 0); },
  savePullCount(count) { safeSet(KEYS.PULL_COUNT, count); },
  incrementPullCount() {
    const count = this.getPullCount() + 1;
    this.savePullCount(count);
    return count;
  },

  // --- Tickets ---

  getTickets() { return safeGet(KEYS.TICKETS, 0); },
  saveTickets(tickets) { safeSet(KEYS.TICKETS, Math.max(0, tickets)); },
  addTicket() {
    const tickets = this.getTickets() + 1;
    this.saveTickets(tickets);
    return tickets;
  },
  spendTicket() {
    const tickets = this.getTickets();
    if (tickets <= 0) return false;
    this.saveTickets(tickets - 1);
    return true;
  },

  // --- Activity Log ---

  getActivityLog() { return safeGet(KEYS.ACTIVITY_LOG, []); },
  saveActivityLog(log) { safeSet(KEYS.ACTIVITY_LOG, log); },
  logActivity(activityId, photoBase64) {
    const log = this.getActivityLog();
    const entry = {
      activityId,
      photoBase64,
      completedAt: new Date().toISOString(),
    };
    const updated = [...log, entry];
    this.saveActivityLog(updated);

    // Lógica especial para la racha de ejercicios
    if (activityId === 'exercise') {
      const currentWeekId = getCurrentWeekId();
      let weekId = this.getExerciseWeekId();
      
      // Si por alguna razón el checkAndResetDaily falló, hacemos la verificación aquí también
      if (weekId !== currentWeekId) {
        const lastWeeklyCount = this.getExerciseWeekly();
        if (weekId !== null && lastWeeklyCount < 4) {
          this.saveExerciseStreak(0); // Faltaron días, reinicia racha total
        }
        this.saveExerciseWeekly(0);
        this.saveExerciseWeekId(currentWeekId);
      }

      const newWeeklyCount = this.getExerciseWeekly() + 1;
      this.saveExerciseWeekly(newWeeklyCount);

      let newStreak = this.getExerciseStreak() + 1;
      if (newStreak >= 8) {
        // Alcanzó la racha sorpresa!
        // No se reinicia aquí para que la UI lo muestre, lo reiniciaremos desde UI después,
        // O lo podemos dejar en 8 para que reclame, y el backend no lo toque hasta que lo cobren.
      }
      this.saveExerciseStreak(newStreak);
    }

    return updated;
  },
  isActivityCompletedToday(activityId) {
    const log = this.getActivityLog();
    return log.some((entry) => entry.activityId === activityId);
  },

  // --- Reset diario y verificación semanal ---

  getLastResetDate() { return safeGet(KEYS.LAST_RESET_DATE, null); },
  saveLastResetDate(dateString) { safeSet(KEYS.LAST_RESET_DATE, dateString); },
  checkAndResetDaily() {
    let didReset = false;
    const today = new Date().toDateString();
    const lastReset = this.getLastResetDate();

    if (lastReset !== today) {
      this.saveActivityLog([]);
      this.saveLastResetDate(today);
      didReset = true;
    }

    // Verificación de semana para la racha
    const currentWeekId = getCurrentWeekId();
    const storedWeekId = this.getExerciseWeekId();

    if (storedWeekId !== null && storedWeekId !== currentWeekId) {
      const lastWeeklyCount = this.getExerciseWeekly();
      if (lastWeeklyCount < 4) {
        // Si no cumplió 4 en la semana pasada, pierde la racha
        this.saveExerciseStreak(0);
      }
      // Reiniciamos la semana
      this.saveExerciseWeekly(0);
      this.saveExerciseWeekId(currentWeekId);
      didReset = true;
    } else if (storedWeekId === null) {
      this.saveExerciseWeekId(currentWeekId);
    }

    return didReset;
  },

  // --- Racha de Ejercicios ---

  getExerciseStreak() { return safeGet(KEYS.EXERCISE_STREAK, 0); },
  saveExerciseStreak(streak) { safeSet(KEYS.EXERCISE_STREAK, streak); },
  getExerciseWeekly() { return safeGet(KEYS.EXERCISE_WEEKLY, 0); },
  saveExerciseWeekly(count) { safeSet(KEYS.EXERCISE_WEEKLY, count); },
  getExerciseWeekId() { return safeGet(KEYS.EXERCISE_WEEK_ID, null); },
  saveExerciseWeekId(weekId) { safeSet(KEYS.EXERCISE_WEEK_ID, weekId); },

  // --- Settings ---

  getSettings() { return safeGet(KEYS.SETTINGS, { soundEnabled: true }); },
  saveSettings(settings) { safeSet(KEYS.SETTINGS, settings); },

  // --- Utilidades ---

  clearAll() {
    // Resetear en memoria y local
    Object.keys(memoryCache).forEach(key => {
      memoryCache[key] = (key === KEYS.INVENTORY || key === KEYS.ACTIVITY_LOG) ? [] : 
                         (key === KEYS.TICKETS || key === KEYS.PULL_COUNT || key === KEYS.EXERCISE_STREAK || key === KEYS.EXERCISE_WEEKLY) ? 0 : null;
      try { localStorage.removeItem(key); } catch (e) {}
    });
    // Limpiar en la nube
    syncToCloud();
  },
};

export default storageService;
