import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, User, Bot } from 'lucide-react';

const CHOICES = [
  { id: 'rock', name: 'Rock', icon: '✊', beats: 'scissors' },
  { id: 'paper', name: 'Paper', icon: '✋', beats: 'rock' },
  { id: 'scissors', name: 'Scissors', icon: '✌️', beats: 'paper' }
];

export const RPSGame = ({ onExit, onWin, user, session, entryFee = 25 }) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [lastRound, setLastRound] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('First to 3 points takes the victory!');

  const playRound = (playerChoice) => {
    if (gameOver) return;

    const botChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    let result = '';

    if (playerChoice.id === botChoice.id) {
      result = 'Draw!';
    } else if (playerChoice.beats === botChoice.id) {
      result = 'You Win Point!';
      const newScore = playerScore + 1;
      setPlayerScore(newScore);
      if (newScore >= 3) {
        setGameOver(true);
        setStatus('Match Champion! You won the series!');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        if (onWin) onWin(50);
      }
    } else {
      result = 'Bot Wins Point!';
      const newBot = botScore + 1;
      setBotScore(newBot);
      if (newBot >= 3) {
        setGameOver(true);
        setStatus('Bot won the series! Try a rematch.');
      }
    }

    setLastRound({ player: playerChoice, bot: botChoice, result });
  };

  const handleReset = () => {
    setPlayerScore(0);
    setBotScore(0);
    setLastRound(null);
    setGameOver(false);
    setStatus('New match! Choose Rock, Paper, or Scissors.');
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:max-w-md mx-auto flex flex-col justify-between p-2.5 sm:p-4 select-none overflow-hidden overscroll-none touch-manipulation pt-[env(safe-area-inset-top,8px)] pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex items-center justify-between p-3 mb-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg">
            ✊
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white leading-tight">RPS Showdown</h2>
            <p className="text-[10px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-RPS'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={handleReset} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onExit} className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[38px] flex items-center gap-1 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-3xl bg-slate-900 border border-slate-800 p-3 sm:p-5 shadow-2xl flex flex-col justify-between items-center w-full">
        {/* Score Board */}
        <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 mb-2 shrink-0">
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><User className="w-3.5 h-3.5" /> You</p>
            <p className="text-2xl font-black text-amber-400">{playerScore}</p>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">VS</div>
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Bot className="w-3.5 h-3.5" /> Bot</p>
            <p className="text-2xl font-black text-emerald-400">{botScore}</p>
          </div>
        </div>

        {/* Round Duel Display */}
        <div className="h-28 flex items-center justify-center gap-6 my-2">
          {lastRound ? (
            <>
              <div className="text-center">
                <span className="text-5xl block animate-bounce">{lastRound.player.icon}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1">Your Pick</span>
              </div>
              <div className="text-xs font-black text-amber-400 uppercase tracking-wider">{lastRound.result}</div>
              <div className="text-center">
                <span className="text-5xl block animate-bounce">{lastRound.bot.icon}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1">Bot Pick</span>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 font-medium">Tap an action below to strike!</div>
          )}
        </div>

        <div className="w-full text-center my-3 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {status}
        </div>

        {/* 3 Touch-Friendly Choice Buttons (min height 54px) */}
        <div className="grid grid-cols-3 gap-3 w-full mt-2">
          {CHOICES.map((c) => (
            <button
              key={c.id}
              onClick={() => playRound(c)}
              disabled={gameOver}
              className="min-h-[56px] p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-40"
            >
              <span className="text-2xl leading-none">{c.icon}</span>
              <span className="text-xs font-bold text-white">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
