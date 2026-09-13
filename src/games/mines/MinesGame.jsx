import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Coins, ShieldAlert } from 'lucide-react';

export const MinesGame = ({ onExit, onWin, user, session, entryFee = 30 }) => {
  const TOTAL_TILES = 16;
  const NUM_MINES = 3;

  const [mines, setMines] = useState(() => generateMines(NUM_MINES, TOTAL_TILES));
  const [revealed, setRevealed] = useState(Array(TOTAL_TILES).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gemsFound, setGemsFound] = useState(0);
  const [status, setStatus] = useState('Pick any tile to uncover Gems. Avoid the 3 hidden mines!');

  function generateMines(count, total) {
    const set = new Set();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * total));
    }
    return set;
  }

  const handleTileClick = (idx) => {
    if (gameOver || revealed[idx]) return;

    const nextRevealed = [...revealed];
    nextRevealed[idx] = true;
    setRevealed(nextRevealed);

    if (mines.has(idx)) {
      setGameOver(true);
      setStatus('BOOM! You uncovered a hidden mine. Round lost!');
      // Reveal all mines
      const showAll = nextRevealed.map((_, i) => mines.has(i) || nextRevealed[i]);
      setRevealed(showAll);
    } else {
      const nextGems = gemsFound + 1;
      const nextMult = Number((1.0 + nextGems * 0.35).toFixed(2));
      setGemsFound(nextGems);
      setMultiplier(nextMult);
      setStatus(`Gem uncovered! Multiplier: ${nextMult}x (${nextGems} gems)`);

      // If all non-mine tiles found
      if (nextGems >= TOTAL_TILES - NUM_MINES) {
        setGameOver(true);
        setStatus('Clean Sweep! All gems uncovered!');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        if (onWin) onWin(Math.round(entryFee * nextMult));
      }
    }
  };

  const handleCashout = () => {
    if (gameOver || gemsFound === 0) return;
    setGameOver(true);
    const winAmt = Math.round(entryFee * multiplier);
    setStatus(`Cashed out at ${multiplier}x! +${winAmt} Demo Credits awarded!`);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    if (onWin) onWin(winAmt);
  };

  const handleReset = () => {
    setMines(generateMines(NUM_MINES, TOTAL_TILES));
    setRevealed(Array(TOTAL_TILES).fill(false));
    setGameOver(false);
    setMultiplier(1.0);
    setGemsFound(0);
    setStatus('New field deployed. Uncover gems or cash out anytime!');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xl">
            💣
          </div>
          <div>
            <h2 className="text-base font-black text-white">Minesweeper Blitz</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-MINES'}</span> • Entry: {entryFee} Credits
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

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between px-2 mb-4 text-xs font-bold">
          <div>Gems: <span className="text-emerald-400 text-sm">{gemsFound}</span></div>
          <div>Mines: <span className="text-rose-400 text-sm">{NUM_MINES}</span></div>
          <div>Multiplier: <span className="text-amber-400 text-sm">{multiplier}x</span></div>
        </div>

        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-[320px] aspect-square p-3 bg-slate-950 rounded-2xl border border-slate-800">
          {revealed.map((isRev, idx) => {
            const isMine = mines.has(idx);
            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={gameOver || isRev}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-black transition-all cursor-pointer select-none ${
                  isRev
                    ? isMine
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white animate-fade-in'
                    : 'bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700'
                }`}
              >
                {isRev ? (isMine ? '💣' : '💎') : ''}
              </button>
            );
          })}
        </div>

        <div className="w-full text-center my-3 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {status}
        </div>

        {/* Cashout Button */}
        <button
          onClick={handleCashout}
          disabled={gameOver || gemsFound === 0}
          className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-40"
        >
          <Coins className="w-4 h-4" />
          <span>{gemsFound > 0 ? `CASH OUT (${Math.round(entryFee * multiplier)} CREDITS)` : 'UNCOVER FIRST GEM'}</span>
        </button>
      </div>
    </div>
  );
};
