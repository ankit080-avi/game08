import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, User, Bot } from 'lucide-react';

const INITIAL_BOARD = [
  ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

export const ChessGame = ({ onExit, onWin, user, session, entryFee = 50 }) => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null); // { r, c }
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState('Select a White piece to move.');
  const [score, setScore] = useState(0);

  const isWhite = (piece) => piece && '♙♘♗♖♕♔'.includes(piece);
  const isBlack = (piece) => piece && '♟♞♝♜♛♚'.includes(piece);

  const handleCellClick = (r, c) => {
    if (!isPlayerTurn) return;

    const piece = board[r][c];

    // If clicking own piece, select it
    if (piece && isWhite(piece)) {
      setSelected({ r, c });
      setStatus(`Selected ${piece} at [${String.fromCharCode(65 + c)}${8 - r}]. Choose destination.`);
      return;
    }

    // If piece was selected, try moving to (r, c)
    if (selected) {
      const fromPiece = board[selected.r][selected.c];
      const targetPiece = board[r][c];

      // Simple legal move: cannot capture own piece
      if (targetPiece && isWhite(targetPiece)) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = fromPiece;
      newBoard[selected.r][selected.c] = null;
      setBoard(newBoard);
      setSelected(null);
      setIsPlayerTurn(false);

      if (targetPiece && isBlack(targetPiece)) {
        setScore((s) => s + 20);
        setStatus(`Captured ${targetPiece}! Bot is calculating response...`);
      } else {
        setStatus(`Moved ${fromPiece}. Bot is thinking...`);
      }

      // Bot turn
      setTimeout(() => {
        botMove(newBoard);
      }, 700);
    }
  };

  const botMove = (currentBoard) => {
    // Find black pieces
    const blackPieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentBoard[r][c] && isBlack(currentBoard[r][c])) {
          blackPieces.push({ r, c, piece: currentBoard[r][c] });
        }
      }
    }

    if (blackPieces.length === 0) {
      setStatus('Checkmate! You won the match!');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onWin) onWin(90);
      return;
    }

    // Pick random black piece and move forward or capture
    const p = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    const possibleMoves = [
      { r: Math.min(7, p.r + 1), c: p.c },
      { r: Math.min(7, p.r + 1), c: Math.max(0, p.c - 1) },
      { r: Math.min(7, p.r + 1), c: Math.min(7, p.c + 1) }
    ];

    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[move.r][move.c] = p.piece;
    newBoard[p.r][p.c] = null;
    setBoard(newBoard);
    setIsPlayerTurn(true);
    setStatus('Bot completed move. Your turn (White)!');
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARD);
    setSelected(null);
    setIsPlayerTurn(true);
    setScore(0);
    setStatus('New chess match. You play White!');
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:max-w-xl mx-auto flex flex-col justify-between p-2.5 sm:p-4 select-none overflow-hidden overscroll-none touch-manipulation pt-[env(safe-area-inset-top,8px)] pb-[env(safe-area-inset-bottom,8px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 mb-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-lg">
            ♟️
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white leading-tight">Chess Master</h2>
            <p className="text-[10px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-CHESS'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[38px] flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Board Card */}
      <div className="flex-1 min-h-0 rounded-3xl bg-slate-900 border border-slate-800 p-3 shadow-2xl flex flex-col justify-between items-center w-full">
        {/* Turn Status */}
        <div className="w-full flex items-center justify-between px-2 mb-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold">
            {isPlayerTurn ? (
              <span className="text-amber-400 flex items-center gap-1"><User className="w-4 h-4" /> Your Turn (White)</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1"><Bot className="w-4 h-4 animate-spin" /> Bot Thinking...</span>
            )}
          </div>
          <div className="font-bold text-slate-400">
            Points: <span className="text-amber-400">{score}</span>
          </div>
        </div>

        {/* 8x8 Chess Board */}
        <div className="w-full max-w-[320px] sm:max-w-[340px] aspect-square rounded-2xl bg-slate-950 p-2 border-2 border-slate-800 shadow-2xl my-auto">
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-xl overflow-hidden border border-slate-700">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isLight = (r + c) % 2 === 0;
                const isSel = selected && selected.r === r && selected.c === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl font-black select-none transition-all cursor-pointer ${
                      isSel
                        ? 'bg-amber-500/80 text-slate-950 ring-2 ring-amber-300'
                        : isLight
                        ? 'bg-[#cbd5e1] text-slate-900 hover:bg-[#e2e8f0]'
                        : 'bg-[#334155] text-white hover:bg-[#475569]'
                    }`}
                  >
                    {piece}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Status prompt */}
        <div className="w-full text-center mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {status}
        </div>
      </div>
    </div>
  );
};
