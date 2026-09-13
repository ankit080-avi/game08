import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Play, Trophy, Zap, Target } from 'lucide-react';

export const GenericArcadeGame = ({ game, onExit, onWin, user, session, entryFee = 40 }) => {
  const [score, setScore] = useState(0);
  const [roundsLeft, setRoundsLeft] = useState(6);
  const [targetPos, setTargetPos] = useState(50); // percentage
  const [isActionActive, setIsActionActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Tap the action button at the right moment to score points!');

  const animRef = useRef(null);

  // Moving target mechanic
  useEffect(() => {
    let dir = 1;
    let pos = 50;

    const loop = () => {
      pos += dir * 1.4;
      if (pos > 85) dir = -1;
      if (pos < 15) dir = 1;
      setTargetPos(pos);
      animRef.current = requestAnimationFrame(loop);
    };

    if (!gameOver) {
      animRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameOver]);

  const handleAction = () => {
    if (gameOver || roundsLeft <= 0 || isActionActive) return;

    setIsActionActive(true);
    setRoundsLeft((r) => r - 1);

    // Score based on distance from center (50%)
    const dist = Math.abs(targetPos - 50);
    let pts = 0;
    let feedback = '';

    if (dist < 10) {
      pts = 30;
      feedback = '🎯 BULLSEYE! Perfect strike (+30 pts)';
    } else if (dist < 22) {
      pts = 15;
      feedback = '✨ Great hit! (+15 pts)';
    } else {
      pts = 5;
      feedback = '⚡ Grazed the edge (+5 pts)';
    }

    const newScore = score + pts;
    setScore(newScore);
    setMessage(feedback);

    setTimeout(() => {
      setIsActionActive(false);
      if (roundsLeft - 1 <= 0) {
        setGameOver(true);
        if (newScore >= 60) {
          setMessage(`Stage Complete! Outstanding score of ${newScore} pts!`);
          confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
          if (onWin) onWin(game?.winReward || 80);
        } else {
          setMessage(`Session finished with ${newScore} pts. Try again for the bonus reward!`);
        }
      }
    }, 450);
  };

  const handleReset = () => {
    setScore(0);
    setRoundsLeft(6);
    setGameOver(false);
    setMessage('New round ready! Aim for the gold center.');
  };

  const getGameIcon = () => {
    switch (game?.id) {
      case 'archery': return '🏹';
      case 'fruit-slice': return '🍉';
      case 'bubble-shooter': return '🫧';
      case 'checkers': return '🔴';
      case 'sudoku': return '🔢';
      default: return '🎮';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
            {getGameIcon()}
          </div>
          <div>
            <h2 className="text-base font-black text-white">{game?.title || 'Arcade Demo'}</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-ARC'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onExit} className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[44px] flex items-center gap-1 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Arena Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between px-2 mb-4 text-xs font-bold">
          <div>Score: <span className="text-amber-400 text-sm font-black">{score}</span> <span className="text-slate-500">(Target: 60)</span></div>
          <div>Attempts Left: <span className="text-emerald-400 text-sm font-black">{roundsLeft}</span></div>
        </div>

        {/* Dynamic Interactive Gauge */}
        <div className="w-full h-44 sm:h-52 rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 relative flex flex-col justify-between overflow-hidden shadow-inner select-none">
          {/* Center Target Marker */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 bg-amber-500/15 border-x border-amber-500/30 flex items-center justify-center">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest rotate-90">BULLSEYE</span>
          </div>

          {/* Dynamic Moving Target */}
          <div
            style={{ left: `${targetPos}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-transform"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 shadow-xl flex items-center justify-center text-xl animate-pulse">
              {getGameIcon()}
            </div>
            <div className="w-1 h-12 bg-amber-400/80 mt-1 rounded-full" />
          </div>

          {/* Bottom Reticle */}
          <div className="w-full mt-auto flex justify-between text-[10px] font-bold text-slate-500 px-2">
            <span>START</span>
            <span className="text-amber-400">ZONE</span>
            <span>END</span>
          </div>
        </div>

        {/* Status prompt */}
        <div className="w-full text-center my-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {message}
        </div>

        {/* Big Action Button (min touch target 50px) */}
        <button
          onClick={handleAction}
          disabled={gameOver || roundsLeft <= 0 || isActionActive}
          className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer active:scale-95 disabled:opacity-40"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>{isActionActive ? 'RECORDING STRIKE...' : 'TRIGGER ACTION'}</span>
        </button>
      </div>
    </div>
  );
};
