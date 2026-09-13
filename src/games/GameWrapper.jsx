import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';
import { LudoGame } from './ludo/LudoGame.jsx';
import { TicTacToeGame } from './ticTacToe/TicTacToeGame.jsx';

const GAME_COMPONENTS = {
  'ludo': LudoGame,
  'tic-tac-toe': TicTacToeGame
};

export const GameWrapper = ({
  game,
  onExit,
  onOpenAddCredits
}) => {
  const { user } = useAuth();
  const { balance, deductEntryFee, creditReward } = useWallet();
  const [isReady, setIsReady] = useState(false);
  const [feeDeducted, setFeeDeducted] = useState(false);
  const [error, setError] = useState(null);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeGameSession = async () => {
      if (!game) return;

      // 1. Check if user balance is sufficient
      if (balance < game.entryFee) {
        if (isMounted) {
          setShowInsufficientModal(true);
        }
        return;
      }

      // 2. Deduct entry fee via centralized wallet service
      try {
        await deductEntryFee(game.id, game.title, game.entryFee);
        if (isMounted) {
          setFeeDeducted(true);
          setIsReady(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to deduct entry fee.');
        }
      }
    };

    if (!feeDeducted) {
      initializeGameSession();
    }

    return () => {
      isMounted = false;
    };
  }, [game, balance, deductEntryFee, feeDeducted]);

  const handleWin = async (rewardAmount) => {
    if (!game) return;
    try {
      await creditReward(game.id, game.title, rewardAmount || game.winReward);
    } catch (err) {
      console.error('[GameWrapper] Error crediting win reward:', err);
    }
  };

  if (showInsufficientModal) {
    return (
      <InsufficientBalanceModal
        isOpen={true}
        onClose={() => {
          setShowInsufficientModal(false);
          onExit();
        }}
        game={game}
        currentBalance={balance}
        onAddCredits={() => {
          setShowInsufficientModal(false);
          onExit();
          onOpenAddCredits();
        }}
      />
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-slate-900 border border-rose-500/30 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Game Launch Error</h3>
        <p className="text-xs text-rose-400 mb-6">{error}</p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.id];

  if (!isReady || !GameComponent) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center animate-spin mb-4">
          <span className="text-xl">🎲</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Setting up game arena...</h3>
        <p className="text-xs text-slate-400">Verifying demo balance & allocating match</p>
      </div>
    );
  }

  return (
    <GameComponent
      onExit={onExit}
      onWin={handleWin}
      user={user}
      entryFee={game.entryFee}
    />
  );
};
