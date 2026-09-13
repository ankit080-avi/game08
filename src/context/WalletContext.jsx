import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService';
import { useAuth } from './AuthContext';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(true);
    try {
      const res = await walletService.addCredits(amount, description, userId);
      setLastNotification({
        type: 'success',
        message: `+${amount} Demo Credits added to your wallet.`
      });
      refreshData();
      return res;
    } finally {
      setIsProcessing(false);
    }
  };

  const deductEntryFee = async (gameId, gameTitle, amount) => {
    if (!user) throw new Error('User must be logged in.');
    setIsProcessing(true);
    try {
      const res = await walletService.deductEntryFee(gameId, gameTitle, amount, userId);
      setLastNotification({
        type: 'info',
        message: `${amount} Demo Credits deducted for ${gameTitle}.`
      });
      refreshData();
      return res;
    } finally {
      setIsProcessing(false);
    }
  };

  const creditReward = async (gameId, gameTitle, amount) => {
    if (!user) return null;
    setIsProcessing(true);
    try {
      const res = await walletService.creditReward(gameId, gameTitle, amount, userId);
      if (res) {
        setLastNotification({
          type: 'success',
          message: `Victory! +${amount} Demo Credits awarded!`
        });
        refreshData();
      }
      return res;
    } finally {
      setIsProcessing(false);
    }
  };

  const hasSufficientBalance = (amount) => {
    return balance >= amount;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isProcessing,
        lastNotification,
        clearNotification: () => setLastNotification(null),
        addCredits,
        deductEntryFee,
        creditReward,
        hasSufficientBalance,
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
