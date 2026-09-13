/**
 * Wallet Service - Centralized Virtual Demo Wallet Manager.
 * STRICT POLICY:
 * 1. Virtual demo credits only. No real currency or payment gateways.
 * 2. Balance can NEVER become negative.
 * 3. Every single balance update MUST generate an immutable transaction record.
 * 4. Concurrent / duplicate operations are guarded with a processing mutex.
 */

import { storageService, StorageKeys } from './storageService.js';

const WALLET_LISTENERS = new Set();
let isProcessing = false;

export const TransactionType = {
  CREDIT_ADDED: 'CREDIT_ADDED',
  ENTRY_FEE: 'ENTRY_FEE',
  GAME_REWARD: 'GAME_REWARD',
  DEMO_RESET: 'DEMO_RESET'
};

export const TransactionStatus = {
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

const DEFAULT_INITIAL_BALANCE = 500; // Demo credits granted upon first wallet init

function notifyListeners(walletData) {
  WALLET_LISTENERS.forEach((cb) => {
    try {
      cb(walletData);
    } catch (e) {
      console.error('[WalletService] Listener error:', e);
    }
  });
}

function generateTxnId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TXN-${dateStr}-${rand}`;
}

export const walletService = {
  /**
   * Subscribe to wallet changes (balance, transactions)
   */
  subscribe(callback) {
    WALLET_LISTENERS.add(callback);
    return () => WALLET_LISTENERS.delete(callback);
  },

  /**
   * Initialize or retrieve wallet data for a user
   */
  getWallet(userId = 'default') {
    const allWallets = storageService.get(StorageKeys.WALLET, {});
    if (!allWallets[userId]) {
      // First time initialization with initial demo grant
      const initialBalance = DEFAULT_INITIAL_BALANCE;
      const initTxn = {
        id: generateTxnId(),
        userId,
        type: TransactionType.CREDIT_ADDED,
        amount: initialBalance,
        previousBalance: 0,
        newBalance: initialBalance,
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
        description: 'Welcome Bonus: Initial Demo Credits'
      };

      allWallets[userId] = {
        userId,
        balance: initialBalance,
        currency: 'Demo Credits',
        updatedAt: new Date().toISOString()
      };

      storageService.set(StorageKeys.WALLET, allWallets);

      // Record transaction
      const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
      allTxns.unshift(initTxn);
      storageService.set(StorageKeys.TRANSACTIONS, allTxns);
    }

    return allWallets[userId];
  },

  /**
   * Get current demo balance
   */
  getBalance(userId = 'default') {
    const wallet = this.getWallet(userId);
    return wallet.balance || 0;
  },

  /**
   * Check if user has sufficient demo credits
   */
  hasSufficientBalance(amount, userId = 'default') {
    const balance = this.getBalance(userId);
    return balance >= amount;
  },

  /**
   * Get transaction history for user
   */
  getTransactions(userId = 'default') {
    const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
    return allTxns.filter((t) => t.userId === userId || !t.userId);
  },

  /**
   * Add demo credits to the wallet
   */
  async addCredits(amount, description = 'Demo Credit Added', userId = 'default') {
    if (isProcessing) {
      throw new Error('A transaction is already in progress. Please wait.');
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || !Number.isFinite(numAmount)) {
      throw new Error('Invalid amount format.');
    }

    if (numAmount <= 0) {
      throw new Error('Amount must be greater than zero.');
    }

    if (numAmount > 50000) {
      throw new Error('Demo credit addition is capped at 50,000 per request.');
    }

    isProcessing = true;
    try {
      // Slight delay for realistic async state
      await new Promise((res) => setTimeout(res, 100));

      const allWallets = storageService.get(StorageKeys.WALLET, {});
      const currentWallet = this.getWallet(userId);
      const prevBalance = currentWallet.balance;
      const newBalance = prevBalance + numAmount;

      const txn = {
        id: generateTxnId(),
        userId,
        type: TransactionType.CREDIT_ADDED,
        amount: numAmount,
        previousBalance: prevBalance,
        newBalance: newBalance,
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
        description: description || `Added ${numAmount} Demo Credits`
      };

      allWallets[userId] = {
        ...currentWallet,
        balance: newBalance,
        updatedAt: new Date().toISOString()
      };

      storageService.set(StorageKeys.WALLET, allWallets);

      const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
      allTxns.unshift(txn);
      storageService.set(StorageKeys.TRANSACTIONS, allTxns);

      notifyListeners({ wallet: allWallets[userId], transactions: allTxns, lastTxn: txn });
      return { success: true, balance: newBalance, transaction: txn };
    } finally {
      isProcessing = false;
    }
  },

  /**
   * Deduct entry fee before launching a game
   */
  async deductEntryFee(gameId, gameTitle, entryFee, userId = 'default') {
    if (isProcessing) {
      throw new Error('A transaction is currently being processed.');
    }

    const fee = Number(entryFee);
    if (isNaN(fee) || fee <= 0) {
      throw new Error('Invalid game entry fee.');
    }

    isProcessing = true;
    try {
      await new Promise((res) => setTimeout(res, 80));

      const allWallets = storageService.get(StorageKeys.WALLET, {});
      const currentWallet = this.getWallet(userId);
      const prevBalance = currentWallet.balance;

      if (prevBalance < fee) {
        throw new Error(`Insufficient Demo Credits. You need ${fee} Demo Credits, but your balance is ${prevBalance}.`);
      }

      const newBalance = prevBalance - fee;

      const txn = {
        id: generateTxnId(),
        userId,
        gameId,
        type: TransactionType.ENTRY_FEE,
        amount: -fee,
        previousBalance: prevBalance,
        newBalance: newBalance,
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
        description: `${gameTitle || 'Game'} Entry Fee`
      };

      allWallets[userId] = {
        ...currentWallet,
        balance: newBalance,
        updatedAt: new Date().toISOString()
      };

      storageService.set(StorageKeys.WALLET, allWallets);

      const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
      allTxns.unshift(txn);
      storageService.set(StorageKeys.TRANSACTIONS, allTxns);

      notifyListeners({ wallet: allWallets[userId], transactions: allTxns, lastTxn: txn });
      return { success: true, balance: newBalance, transaction: txn };
    } finally {
      isProcessing = false;
    }
  },

  /**
   * Credit demo rewards upon winning a game
   */
  async creditReward(gameId, gameTitle, rewardAmount, userId = 'default') {
    if (isProcessing) {
      throw new Error('Transaction in progress.');
    }

    const reward = Number(rewardAmount);
    if (isNaN(reward) || reward <= 0) return null;

    isProcessing = true;
    try {
      await new Promise((res) => setTimeout(res, 60));

      const allWallets = storageService.get(StorageKeys.WALLET, {});
      const currentWallet = this.getWallet(userId);
      const prevBalance = currentWallet.balance;
      const newBalance = prevBalance + reward;

      const txn = {
        id: generateTxnId(),
        userId,
        gameId,
        type: TransactionType.GAME_REWARD,
        amount: reward,
        previousBalance: prevBalance,
        newBalance: newBalance,
        date: new Date().toISOString(),
        status: TransactionStatus.COMPLETED,
        description: `Victory Reward: ${gameTitle || 'Game'} Demo Win`
      };

      allWallets[userId] = {
        ...currentWallet,
        balance: newBalance,
        updatedAt: new Date().toISOString()
      };

      storageService.set(StorageKeys.WALLET, allWallets);

      const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
      allTxns.unshift(txn);
      storageService.set(StorageKeys.TRANSACTIONS, allTxns);

      notifyListeners({ wallet: allWallets[userId], transactions: allTxns, lastTxn: txn });
      return { success: true, balance: newBalance, transaction: txn };
    } finally {
      isProcessing = false;
    }
  }
};
