import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const existing = authService.getCurrentUser();
    if (existing) return existing;
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (params && params.get('game')) {
      const cleanUsername = 'demo_player';
      const defaultUser = {
        id: cleanUsername,
        username: cleanUsername,
        fullName: 'Demo Player',
        avatarId: 'avatar-1',
        createdAt: new Date().toISOString(),
        isDemo: true
      };
      authService.login({ username: cleanUsername });
      return defaultUser;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.subscribe((updatedUser) => {
      setUser(updatedUser);
    });
    return unsubscribe;
  }, []);

  const login = async (username) => {
    setIsLoading(true);
    try {
      const u = await authService.login({ username });
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const u = await authService.register(userData);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setIsLoading(true);
    try {
      const u = await authService.quickDemoLogin();
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
