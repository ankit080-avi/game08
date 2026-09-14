import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowLeft, Frown } from 'lucide-react';

/**
 * Game Result & Celebration Screen
 * WIN: 🎉 YOU WIN, Score/Credits, [ PLAY AGAIN ], [ EXIT ]
 * LOSS: GAME OVER - The Bot Won, Score, [ PLAY AGAIN ], [ EXIT ]
 */
export const GameResult = ({
  isOpen = false,
  isWinner = false,
  winnerName = 'You',
  score = 180,
  onPlayAgain,
  onExit
}) => {
  useEffect(() => {
    if (isOpen && isWinner) {
      try {
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }
  }, [isOpen, isWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-6 text-center relative overflow-hidden">
        {/* Top Ambient Glow */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isWinner ? 'bg-amber-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Central Icon */}
        <div
          className={`mx-auto w-20 h-20 rounded-3xl border-2 flex items-center justify-center shadow-xl mb-4 ${
            isWinner
              ? 'bg-gradient-to-br from-amber-400 to-yellow-600 border-amber-200 text-slate-950'
              : 'bg-gradient-to-br from-rose-900 to-slate-950 border-rose-500/50 text-rose-400'
          }`}
        >
          {isWinner ? <Trophy className="w-10 h-10 stroke-[2.5]" /> : <Frown className="w-10 h-10" />}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-1">
          {isWinner ? '🎉 YOU WIN' : 'GAME OVER'}
        </h2>
        <p className="text-xs text-slate-300 mb-5">
          {isWinner
            ? 'Congratulations! All your tokens successfully conquered Home.'
            : `${winnerName} won the match! Better luck next time.`}
        </p>

        {/* Score / Earnings Box */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between px-5">
          <span className="text-xs font-bold text-slate-400">Match Score / Reward:</span>
          <span className={`text-base font-black ${isWinner ? 'text-amber-400' : 'text-slate-300'}`}>
            {isWinner ? `+${score} Credits` : '0 Credits'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>PLAY AGAIN</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
