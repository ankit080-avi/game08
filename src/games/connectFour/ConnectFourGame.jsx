import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, User, Bot } from 'lucide-react';

export const ConnectFourGame = ({ onExit, onWin, user, session, entryFee = 45 }) => {
  const ROWS = 6;
  const COLS = 7;
  const [board, setBoard] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'R' (player), 'Y' (bot), 'draw'
  const [status, setStatus] = useState('Tap any column to drop your red disc!');

  const checkWin = (b, r, c, player) => {
    // Horizontal
    let count = 0;
    for (let ci = 0; ci < COLS; ci++) {
      count = b[r][ci] === player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Vertical
    count = 0;
    for (let ri = 0; ri < ROWS; ri++) {
      count = b[ri][c] === player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Diagonal \
    for (let ri = 0; ri < ROWS - 3; ri++) {
      for (let ci = 0; ci < COLS - 3; ci++) {
        if (b[ri][ci] === player && b[ri+1][ci+1] === player && b[ri+2][ci+2] === player && b[ri+3][ci+3] === player) return true;
      }
    }
    // Diagonal /
    for (let ri = 3; ri < ROWS; ri++) {
      for (let ci = 0; ci < COLS - 3; ci++) {
        if (b[ri][ci] === player && b[ri-1][ci+1] === player && b[ri-2][ci+2] === player && b[ri-3][ci+3] === player) return true;
      }
    }
    return false;
  };

  const dropDisc = (col) => {
    if (!isPlayerTurn || winner) return;

    // Find lowest empty row in col
    let rowToDrop = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        rowToDrop = r;
        break;
      }
    }
    if (rowToDrop === -1) return; // Column full

    const newBoard = board.map((row) => [...row]);
    newBoard[rowToDrop][col] = 'R';
    setBoard(newBoard);

    if (checkWin(newBoard, rowToDrop, col, 'R')) {
      setWinner('R');
      setStatus('Victory! You connected 4 discs!');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onWin) onWin(80);
      return;
    }

    setIsPlayerTurn(false);
    setStatus('Bot is choosing column...');

    // Bot response
    setTimeout(() => {
      botDrop(newBoard);
    }, 600);
  };

  const botDrop = (currentBoard) => {
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
      if (!currentBoard[0][c]) validCols.push(c);
    }
    if (validCols.length === 0) {
      setWinner('draw');
      setStatus('Game drawn!');
      return;
    }

    const col = validCols[Math.floor(Math.random() * validCols.length)];
    let rowToDrop = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!currentBoard[r][col]) {
        rowToDrop = r;
        break;
      }
    }

    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[rowToDrop][col] = 'Y';
    setBoard(newBoard);

    if (checkWin(newBoard, rowToDrop, col, 'Y')) {
      setWinner('Y');
      setStatus('Bot connected 4 discs! Try again.');
      return;
    }

    setIsPlayerTurn(true);
    setStatus('Your turn! Drop your disc into any column.');
  };

  const handleReset = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setStatus('New match! Tap any column to drop.');
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:max-w-lg mx-auto flex flex-col justify-between p-3 select-none overflow-hidden overscroll-none touch-manipulation pt-[env(safe-area-inset-top,10px)] pb-[env(safe-area-inset-bottom,10px)] pl-[env(safe-area-inset-left,10px)] pr-[env(safe-area-inset-right,10px)]">
      <div className="flex items-center justify-between p-3.5 mb-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl">
            🔵
          </div>
          <div>
            <h2 className="text-base font-black text-white">Connect Four</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-C4'}</span> • Entry: {entryFee} Credits
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

      <div className="flex-1 min-h-0 rounded-3xl bg-slate-900 border border-slate-800 p-3 sm:p-5 shadow-2xl flex flex-col items-center justify-between">
        <div className="w-full flex items-center justify-between px-2 mb-2 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            {isPlayerTurn ? (
              <span className="text-red-400 flex items-center gap-1"><User className="w-4 h-4" /> You (Red)</span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1"><Bot className="w-4 h-4 animate-spin" /> Bot (Yellow)</span>
            )}
          </div>
          <div className="text-slate-400">Connect 4 to Win</div>
        </div>

        {/* Board & Controls Center Container */}
        <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center">
          {/* 7-Column Drop Buttons */}
          <div className="grid grid-cols-7 gap-1.5 w-full max-w-[340px] mb-2">
            {Array.from({ length: COLS }).map((_, c) => (
              <button
                key={c}
                onClick={() => dropDisc(c)}
                disabled={!isPlayerTurn || winner || board[0][c]}
                className="py-2 rounded-lg bg-slate-800 hover:bg-blue-600 active:bg-blue-700 text-slate-300 hover:text-white text-xs font-black transition-colors cursor-pointer disabled:opacity-30 min-h-[38px] flex items-center justify-center"
              >
                ↓
              </button>
            ))}
          </div>

          {/* 7x6 Connect Four Grid */}
          <div className="w-full max-w-[340px] p-2.5 sm:p-3 bg-blue-700 rounded-2xl border-4 border-blue-900 shadow-2xl">
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {board.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-square rounded-full bg-slate-950 border-2 border-blue-800 flex items-center justify-center overflow-hidden shadow-inner"
                  >
                    {val === 'R' && <div className="w-full h-full rounded-full bg-red-500 border border-red-300 shadow-lg animate-fade-in" />}
                    {val === 'Y' && <div className="w-full h-full rounded-full bg-amber-400 border border-amber-200 shadow-lg animate-fade-in" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-full text-center mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 shrink-0">
          {status}
        </div>
      </div>
    </div>
  );
};
