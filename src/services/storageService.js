/**
 * Storage Service - Centralized localStorage manager
 * All platform data is persisted using the 'game08_' prefix.
 * Provides safe JSON parsing and fallback error handling.
 */

const STORAGE_PREFIX = 'game08_';

export const StorageKeys = {
  USER: `${STORAGE_PREFIX}user`,
  SESSION: `${STORAGE_PREFIX}session`,
  WALLET: `${STORAGE_PREFIX}wallet`,
  TRANSACTIONS: `${STORAGE_PREFIX}transactions`,
  GAME_STATE: `${STORAGE_PREFIX}gameState`,
  SETTINGS: `${STORAGE_PREFIX}settings`
};

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`[StorageService] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Error writing key "${key}":`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Error removing key "${key}":`, err);
      return false;
    }
  },

  /**
   * Reset all platform data stored under game08_ prefix
   */
  clearPlatformData() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (err) {
      console.error('[StorageService] Error clearing platform data:', err);
      return false;
    }
  }
};
