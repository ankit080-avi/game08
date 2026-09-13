/**
 * Auth Service - Modular dummy authentication provider.
 * Implements session storage in localStorage.
 * Can be swapped with a real backend API (JWT / OAuth / REST) without UI changes.
 */

import { storageService, StorageKeys } from './storageService.js';

const AUTH_LISTENERS = new Set();

function notifyListeners(user) {
  AUTH_LISTENERS.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error('[AuthService] Listener error:', e);
    }
  });
}

export const authService = {
  /**
   * Subscribe to auth changes
   */
  subscribe(callback) {
    AUTH_LISTENERS.add(callback);
    return () => AUTH_LISTENERS.delete(callback);
  },

  /**
   * Get current authenticated user session
   */
  getCurrentUser() {
    const session = storageService.get(StorageKeys.SESSION);
    if (!session || !session.userId) return null;
    const users = storageService.get(StorageKeys.USER, {});
    return users[session.userId] || session;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return Boolean(this.getCurrentUser());
  },

  /**
   * Register a new demo account
   */
  async register({ username, fullName, avatarId = 'avatar-1' }) {
    // Artificial small async delay to mimic backend API
    await new Promise((res) => setTimeout(res, 120));

    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim() || cleanUsername;

    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }

    const users = storageService.get(StorageKeys.USER, {});
    if (users[cleanUsername]) {
      throw new Error('Username already exists. Please pick another.');
    }

    const newUser = {
      id: cleanUsername,
      username: cleanUsername,
      fullName: cleanName,
      avatarId,
      createdAt: new Date().toISOString(),
      isDemo: true
    };

    users[cleanUsername] = newUser;
    storageService.set(StorageKeys.USER, users);

    // Create session
    storageService.set(StorageKeys.SESSION, {
      userId: cleanUsername,
      loginAt: new Date().toISOString()
    });

    notifyListeners(newUser);
    return newUser;
  },

  /**
   * Login with username
   */
  async login({ username }) {
    await new Promise((res) => setTimeout(res, 100));

    const cleanUsername = (username || '').trim().toLowerCase();
    if (!cleanUsername) {
      throw new Error('Please enter a username.');
    }

    const users = storageService.get(StorageKeys.USER, {});
    let user = users[cleanUsername];

    // If user doesn't exist yet, auto-register them seamlessly for demo convenience
    if (!user) {
      user = {
        id: cleanUsername,
        username: cleanUsername,
        fullName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1) + ' (Demo)',
        avatarId: 'avatar-1',
        createdAt: new Date().toISOString(),
        isDemo: true
      };
      users[cleanUsername] = user;
      storageService.set(StorageKeys.USER, users);
    }

    storageService.set(StorageKeys.SESSION, {
      userId: cleanUsername,
      loginAt: new Date().toISOString()
    });

    notifyListeners(user);
    return user;
  },

  /**
   * Quick 1-click Demo Login
   */
  async quickDemoLogin() {
    return this.login({ username: 'demo_player' });
  },

  /**
   * Logout user and clear session
   */
  logout() {
    storageService.remove(StorageKeys.SESSION);
    notifyListeners(null);
    return true;
  }
};
