/**
 * Wallet Service - Centralized Virtual Demo Wallet Manager.
 * STRICT POLICY:
 * 1. Virtual demo credits only. No real currency or payment gateways.
 * 2. Balance can NEVER become negative.
 * 3. Every single balance update MUST generate an immutable transaction record.
 * 4. Safe 2-phase game entry: Create session -> Initialize Game -> Commit entry fee.
 * 5. If initialization fails, rollbackGameSession leaves balance completely untouched.
 */

import { storageService, StorageKeys } from './storageService.js';

const WALLET_LISTENERS = new Set();

export const TransactionType = {
  CREDIT_ADDED: 'CREDIT_ADDED',
  GAME_ENTRY: 'GAME_ENTRY',
  ENTRY_FEE: 'GAME_ENTRY', // Alias for compatibility
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

function generateSessionId() {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GSESS-${Date.now().toString().slice(-6)}-${rand}`;
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
   * Check whether user has sufficient demo balance
   */
  checkBalance(amount, userId = 'default') {
    const currentBalance = this.getBalance(userId);
    const required = Number(amount) || 0;
    const sufficient = currentBalance >= required;
    const shortage = Math.max(0, required - currentBalance);
    return { sufficient, currentBalance, shortage };
  },

  /**
   * Legacy alias for checking balance
   */
  hasSufficientBalance(amount, userId = 'default') {
    return this.checkBalance(amount, userId).sufficient;
  },

  /**
   * Get transaction history for user
   */
  getTransactions(userId = 'default') {
    const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
    return allTxns.filter((t) => t.userId === userId || !t.userId);
  },

  /**
   * STEP 2 OF SAFE LAUNCH:
   * Create a temporary game session in memory & localStorage.
   * Does NOT deduct any credits. Does NOT create a transaction.
   */
  createGameSession({ userId = 'default', gameId, gameTitle, entryFee }) {
    const fee = Number(entryFee);
    if (isNaN(fee) || fee <= 0) {
      throw new Error('Invalid game entry fee.');
    }

    const { sufficient, currentBalance, shortage } = this.checkBalance(fee, userId);
    if (!sufficient) {
      throw new Error(`Insufficient Demo Credits. Required: ${fee}, Available: ${currentBalance}. (Shortage: ${shortage})`);
    }

    const sessionId = generateSessionId();
    const gameSession = {
      sessionId,
      gameId,
      gameTitle: gameTitle || gameId,
      userId,
      entryFee: fee,
      status: 'launching',
      createdAt: new Date().toISOString(),
      committedAt: null,
      transactionId: null
    };

    const sessions = storageService.get(StorageKeys.GAME_STATE, {});
    sessions[sessionId] = gameSession;
    storageService.set(StorageKeys.GAME_STATE, sessions);

    return gameSession;
  },

  /**
   * STEP 4 OF SAFE LAUNCH:
   * Commit entry fee ONLY after game successfully loads.
   * Implements strict idempotency via sessionId.
   */
  commitEntryFee(sessionId) {
    if (!sessionId) {
      throw new Error('Invalid session ID for committing entry fee.');
    }

    const sessions = storageService.get(StorageKeys.GAME_STATE, {});
    const session = sessions[sessionId];

    if (!session) {
      throw new Error(`Game session ${sessionId} not found.`);
    }

    // Idempotency: If already committed, return existing transaction safely
    if (session.status === 'active' && session.transactionId) {
      const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
      const existingTxn = allTxns.find((t) => t.id === session.transactionId);
      return {
        success: true,
        alreadyCommitted: true,
        transaction: existingTxn,
        balance: this.getBalance(session.userId),
        session
      };
    }

    const userId = session.userId || 'default';
    const allWallets = storageService.get(StorageKeys.WALLET, {});
    const currentWallet = this.getWallet(userId);
    const prevBalance = currentWallet.balance;
    const fee = session.entryFee;

    if (prevBalance < fee) {
      // Rollback session
      this.rollbackGameSession(sessionId, 'Insufficient balance at commit time');
      throw new Error(`Insufficient Demo Credits at launch confirmation. Balance: ${prevBalance}, Required: ${fee}`);
    }

    const newBalance = prevBalance - fee;
    const txnId = generateTxnId();

    const txn = {
      id: txnId,
      userId,
      sessionId: session.sessionId,
      gameId: session.gameId,
      type: TransactionType.GAME_ENTRY,
      amount: -fee,
      previousBalance: prevBalance,
      newBalance: newBalance,
      date: new Date().toISOString(),
      status: TransactionStatus.COMPLETED,
      description: `${session.gameTitle} Entry Fee`
    };

    // Update wallet balance
    allWallets[userId] = {
      ...currentWallet,
      balance: newBalance,
      updatedAt: new Date().toISOString()
    };
    storageService.set(StorageKeys.WALLET, allWallets);

    // Save transaction
    const allTxns = storageService.get(StorageKeys.TRANSACTIONS, []);
    allTxns.unshift(txn);
    storageService.set(StorageKeys.TRANSACTIONS, allTxns);

    // Update session status to active
    session.status = 'active';
    session.committedAt = new Date().toISOString();
    session.transactionId = txnId;
    sessions[sessionId] = session;
    storageService.set(StorageKeys.GAME_STATE, sessions);

    notifyListeners({ wallet: allWallets[userId], transactions: allTxns, lastTxn: txn, session });

    return {
      success: true,
      balance: newBalance,
      transaction: txn,
      session
    };
  },

  /**
   * STEP 5: ROLLBACK ON FAILURE
   * Removes temporary game session without deducting credits or creating a transaction.
   */
  rollbackGameSession(sessionId, reason = 'Game initialization failed') {
    if (!sessionId) return { rolledBack: false };

    const sessions = storageService.get(StorageKeys.GAME_STATE, {});
    const session = sessions[sessionId];

    if (!session) return { rolledBack: false };

    // If already active/committed, do not rollback balance here
    if (session.status === 'active') {
      return { rolledBack: false, message: 'Session was already committed.' };
    }

    // Delete temporary launching session
    delete sessions[sessionId];
    storageService.set(StorageKeys.GAME_STATE, sessions);

    return {
      rolledBack: true,
      sessionId,
      reason,
      balanceUntouched: true
    };
  },

  /**
   * Add demo credits to the wallet
   */
  async addCredits(amount, description = 'Demo Credit Added', userId = 'default') {
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
  },

  /**
   * Credit demo rewards upon winning a game
   */
  async creditReward(gameId, gameTitle, rewardAmount, userId = 'default', sessionId = null) {
    const reward = Number(rewardAmount);
    if (isNaN(reward) || reward <= 0) return null;

    const allWallets = storageService.get(StorageKeys.WALLET, {});
    const currentWallet = this.getWallet(userId);
    const prevBalance = currentWallet.balance;
    const newBalance = prevBalance + reward;

    const txn = {
      id: generateTxnId(),
      userId,
      gameId,
      sessionId,
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
  }
};
