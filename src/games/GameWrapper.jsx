import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';
import { LudoGame } from './ludo/LudoGame.jsx';
import { TicTacToeGame } from './ticTacToe/TicTacToeGame.jsx';
import { CarromGame } from './carrom/CarromGame.jsx';
import { ChessGame } from './chess/ChessGame.jsx';
import { PoolGame } from './pool/PoolGame.jsx';
import { KnifeTargetGame } from './knifeTarget/KnifeTargetGame.jsx';
import { MinesGame } from './mines/MinesGame.jsx';
import { RPSGame } from './rps/RPSGame.jsx';
import { MemoryGame } from './memory/MemoryGame.jsx';
import { ConnectFourGame } from './connectFour/ConnectFourGame.jsx';
import { GenericArcadeGame } from './quickArcade/GenericArcadeGame.jsx';
import { AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

const GAME_COMPONENTS = {
  'ludo': LudoGame,
  'tic-tac-toe': TicTacToeGame,
  'carrom': CarromGame,
  'chess': ChessGame,
  'pool': PoolGame,
  'knife-target': KnifeTargetGame,
  'mines': MinesGame,
  'rps': RPSGame,
  'memory': MemoryGame,
  'connect-four': ConnectFourGame
};

export const GameWrapper = ({
  game,
  onExit,
  onOpenAddCredits
}) => {
  const { user } = useAuth();
  const {
    balance,
    checkBalance,
    createGameSession,
    commitEntryFee,
    rollbackGameSession,
    creditReward
  } = useWallet();

  const [session, setSession] = useState(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const [launchError, setLaunchError] = useState(null);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  // Guards to prevent duplicate execution & re-entry
  const hasInitiatedRef = useRef(false);
  const hasCommittedRef = useRef(false);

  useEffect(() => {
    if (hasInitiatedRef.current) return;
    hasInitiatedRef.current = true;

    const launchSequence = async () => {
      if (!game) {
        setLaunchError('No game was specified for launching.');
        return;
      }

      // STEP 1: Check Demo Balance
      const balanceCheck = checkBalance(game.entryFee);
      if (!balanceCheck.sufficient) {
        setShowInsufficientModal(true);
        return;
      }

      let createdSession = null;
      try {
        // STEP 2: Create temporary game session (status = 'launching')
        createdSession = createGameSession(game);
        setSession(createdSession);

        // STEP 3: Verify Game Component resolution
        const ComponentToLoad = GAME_COMPONENTS[game.id] || GenericArcadeGame;
        if (!ComponentToLoad) {
          throw new Error(`Game engine for "${game.title}" is currently unavailable.`);
        }

        // STEP 4: Commit entry fee ONLY after game is verified
        if (!hasCommittedRef.current) {
          hasCommittedRef.current = true;
          const commitResult = commitEntryFee(createdSession.sessionId);
          if (commitResult && commitResult.session) {
            setSession(commitResult.session);
          }
        }

        setIsGameReady(true);
      } catch (err) {
        console.error('[GameWrapper] Launch sequence failed:', err);

        // STEP 5: Rollback on failure - ZERO deductions
        if (createdSession && createdSession.sessionId && !hasCommittedRef.current) {
          try {
            rollbackGameSession(createdSession.sessionId, err.message);
          } catch (rbErr) {
            console.error('[GameWrapper] Rollback error:', rbErr);
          }
        }

        setLaunchError(
          err.message || 'Unable to launch the game. Your Demo Credits were not deducted.'
        );
      }
    };

    launchSequence();
  }, [game, checkBalance, createGameSession, commitEntryFee, rollbackGameSession]);

  const handleWin = async (rewardAmount) => {
    if (!game) return;
    try {
      await creditReward(game.id, game.title, rewardAmount || game.winReward, session?.sessionId);
    } catch (err) {
      console.error('[GameWrapper] Error crediting win reward:', err);
    }
  };

  // Insufficient Balance Modal
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

  // Graceful Error State
  if (launchError) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Game Launch Notice</h3>
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-amber-300 font-medium mb-4">
            Unable to launch the game. Your Demo Credits were not deducted.
          </div>

          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {launchError}
          </p>

          <button
            onClick={onExit}
            className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (!isGameReady || !session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-amber-500/10">
          <span className="text-2xl">🎲</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Loading Arena: {game?.title}...</h3>
        <p className="text-xs text-slate-400">
          Verifying demo balance & allocating secure session
        </p>
      </div>
    );
  }

  const ActiveComponent = GAME_COMPONENTS[game.id] || GenericArcadeGame;

  return (
    <ActiveComponent
      game={game}
      onExit={onExit}
      onWin={handleWin}
      user={user}
      entryFee={game.entryFee}
      session={session}
    />
  );
};
