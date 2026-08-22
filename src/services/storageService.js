/**
 * storageService.js — Abstracción de persistencia.
 *
 * Actualmente usa LocalStorage, pero la interfaz está diseñada
 * para ser reemplazada fácilmente por una API REST / base de datos
 * sin modificar los hooks que la consumen.
 *
 * Para migrar a una DB, solo necesitas reemplazar las implementaciones
 * internas y convertir los métodos a async.
 */

const KEYS = {
  INVENTORY: 'gacha_cosmico_inventory',
  PULL_COUNT: 'gacha_cosmico_pull_count',
  SETTINGS: 'gacha_cosmico_settings',
  TICKETS: 'gacha_cosmico_tickets',
  ACTIVITY_LOG: 'gacha_cosmico_activity_log',
  LAST_RESET_DATE: 'gacha_cosmico_last_reset',
};

/**
 * Lee un valor de LocalStorage con manejo seguro de errores.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`[StorageService] Error reading "${key}":`, error);
    return fallback;
  }
}

/**
 * Escribe un valor en LocalStorage con manejo seguro de errores.
 * @param {string} key
 * @param {*} value
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[StorageService] Error writing "${key}":`, error);
  }
}

const storageService = {
  // --- Inventario ---

  getInventory() {
    return safeGet(KEYS.INVENTORY, []);
  },

  saveInventory(inventory) {
    safeSet(KEYS.INVENTORY, inventory);
  },

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

  getPullCount() {
    return safeGet(KEYS.PULL_COUNT, 0);
  },

  savePullCount(count) {
    safeSet(KEYS.PULL_COUNT, count);
  },

  incrementPullCount() {
    const count = this.getPullCount() + 1;
    this.savePullCount(count);
    return count;
  },

  // --- Tickets ---

  /**
   * Obtiene el número actual de tickets disponibles.
   * @returns {number}
   */
  getTickets() {
    return safeGet(KEYS.TICKETS, 0);
  },

  /**
   * Guarda el número de tickets.
   * @param {number} tickets
   */
  saveTickets(tickets) {
    safeSet(KEYS.TICKETS, Math.max(0, tickets));
  },

  /**
   * Incrementa tickets en 1 y retorna el nuevo valor.
   * @returns {number}
   */
  addTicket() {
    const tickets = this.getTickets() + 1;
    this.saveTickets(tickets);
    return tickets;
  },

  /**
   * Gasta 1 ticket. Retorna false si no hay tickets disponibles.
   * @returns {boolean} true si se pudo gastar, false si no había tickets
   */
  spendTicket() {
    const tickets = this.getTickets();
    if (tickets <= 0) return false;
    this.saveTickets(tickets - 1);
    return true;
  },

  // --- Activity Log (registro de actividades completadas hoy) ---

  /**
   * Obtiene el registro de actividades completadas.
   * Cada entrada: { activityId, photoBase64, completedAt }
   * @returns {Array<object>}
   */
  getActivityLog() {
    return safeGet(KEYS.ACTIVITY_LOG, []);
  },

  /**
   * Guarda el registro de actividades.
   * @param {Array<object>} log
   */
  saveActivityLog(log) {
    safeSet(KEYS.ACTIVITY_LOG, log);
  },

  /**
   * Registra una actividad como completada con evidencia.
   * @param {string} activityId
   * @param {string} photoBase64 - Foto en base64 comprimida
   * @returns {Array<object>} Log actualizado
   */
  logActivity(activityId, photoBase64) {
    const log = this.getActivityLog();
    const entry = {
      activityId,
      photoBase64,
      completedAt: new Date().toISOString(),
    };
    const updated = [...log, entry];
    this.saveActivityLog(updated);
    return updated;
  },

  /**
   * Verifica si una actividad ya fue completada hoy.
   * @param {string} activityId
   * @returns {boolean}
   */
  isActivityCompletedToday(activityId) {
    const log = this.getActivityLog();
    return log.some((entry) => entry.activityId === activityId);
  },

  // --- Reset diario ---

  /**
   * Obtiene la fecha del último reset (como string de fecha).
   * @returns {string|null}
   */
  getLastResetDate() {
    return safeGet(KEYS.LAST_RESET_DATE, null);
  },

  /**
   * Guarda la fecha del último reset.
   * @param {string} dateString
   */
  saveLastResetDate(dateString) {
    safeSet(KEYS.LAST_RESET_DATE, dateString);
  },

  /**
   * Verifica si es necesario resetear las actividades (nuevo día).
   * Si es un nuevo día, limpia el activity log y actualiza la fecha.
   * Los tickets acumulados NO se pierden.
   * @returns {boolean} true si se hizo reset
   */
  checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastReset = this.getLastResetDate();

    if (lastReset !== today) {
      this.saveActivityLog([]);
      this.saveLastResetDate(today);
      return true;
    }
    return false;
  },

  // --- Settings ---

  getSettings() {
    return safeGet(KEYS.SETTINGS, { soundEnabled: true });
  },

  saveSettings(settings) {
    safeSet(KEYS.SETTINGS, settings);
  },

  // --- Utilidades ---

  clearAll() {
    Object.values(KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // silently fail
      }
    });
  },
};

export default storageService;
