import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService.js';
import { useAuth } from './AuthContext';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [lastNotification, setLastNotification] = useState(null);

  const refreshData = useCallback(() => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      return;
    }
    const currentWallet = walletService.getWallet(userId);
    setBalance(currentWallet.balance || 0);
    const txns = walletService.getTransactions(userId);
    setTransactions(txns);
  }, [user, userId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const unsubscribe = walletService.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [refreshData]);

  const addCredits = async (amount, description) => {
    if (!user) throw new Error('User must be logged in.');
    const res = await walletService.addCredits(amount, description, userId);
    setLastNotification({
      type: 'success',
      message: `+${amount} Demo Credits added to your wallet.`
    });
    refreshData();
    return res;
  };

  const checkBalance = (amount) => {
    return walletService.checkBalance(amount, userId);
  };

  const hasSufficientBalance = (amount) => {
    return walletService.hasSufficientBalance(amount, userId);
  };

  const createGameSession = (game) => {
    if (!user) throw new Error('User must be logged in to launch a game.');
    return walletService.createGameSession({
      userId,
      gameId: game.id,
      gameTitle: game.title,
      entryFee: game.entryFee
    });
  };

  const commitEntryFee = (sessionId) => {
    const res = walletService.commitEntryFee(sessionId);
    refreshData();
    return res;
  };

  const rollbackGameSession = (sessionId, reason) => {
    return walletService.rollbackGameSession(sessionId, reason);
  };

  const creditReward = async (gameId, gameTitle, amount, sessionId = null) => {
    if (!user) return null;
    const res = await walletService.creditReward(gameId, gameTitle, amount, userId, sessionId);
    if (res) {
      setLastNotification({
        type: 'success',
        message: `Victory! +${amount} Demo Credits awarded!`
      });
      refreshData();
    }
    return res;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        lastNotification,
        clearNotification: () => setLastNotification(null),
        addCredits,
        checkBalance,
        hasSufficientBalance,
        createGameSession,
        commitEntryFee,
        rollbackGameSession,
        creditReward,
        refreshWallet: refreshData
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
