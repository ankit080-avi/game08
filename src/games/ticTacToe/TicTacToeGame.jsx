import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Bot, User, Trophy, Sparkles } from 'lucide-react';

export const TicTacToeGame = ({ onExit, onWin, user }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'X' (player), 'O' (bot), 'draw'
  const [winningLine, setWinningLine] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: 'draw', line: null };
    }
    return null;
  };

  const handleCellClick = (idx) => {
    if (board[idx] || !isPlayerTurn || winner) return;

    const nextBoard = [...board];
    nextBoard[idx] = 'X';
    setBoard(nextBoard);

    const res = checkWinner(nextBoard);
    if (res) {
      handleGameOver(res);
      return;
    }

    setIsPlayerTurn(false);
  };

  // Bot move (smart Minimax or tactical AI)
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const nextBoard = [...board];

        // 1. Check if bot can win now
        const lines = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
        ];

        let move = -1;

        // Try win
        for (const [a, b, c] of lines) {
          if (nextBoard[a] === 'O' && nextBoard[b] === 'O' && !nextBoard[c]) move = c;
          else if (nextBoard[a] === 'O' && nextBoard[c] === 'O' && !nextBoard[b]) move = b;
          else if (nextBoard[b] === 'O' && nextBoard[c] === 'O' && !nextBoard[a]) move = a;
          if (move !== -1) break;
        }

        // Try block player
        if (move === -1) {
          for (const [a, b, c] of lines) {
            if (nextBoard[a] === 'X' && nextBoard[b] === 'X' && !nextBoard[c]) move = c;
            else if (nextBoard[a] === 'X' && nextBoard[c] === 'X' && !nextBoard[b]) move = b;
            else if (nextBoard[b] === 'X' && nextBoard[c] === 'X' && !nextBoard[a]) move = a;
            if (move !== -1) break;
          }
        }

        // Take center
        if (move === -1 && !nextBoard[4]) move = 4;

        // Take random open
        if (move === -1) {
          const emptyIndices = nextBoard
            .map((v, i) => (v === null ? i : null))
            .filter((v) => v !== null);
          if (emptyIndices.length > 0) {
            move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          }
        }

        if (move !== -1) {
          nextBoard[move] = 'O';
          setBoard(nextBoard);

          const res = checkWinner(nextBoard);
          if (res) {
            handleGameOver(res);
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const handleGameOver = (res) => {
    setWinner(res.winner);
    setWinningLine(res.line);

    if (res.winner === 'X') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      if (onWin) onWin(90);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:max-w-xl mx-auto flex flex-col justify-between p-3 select-none overflow-hidden overscroll-none touch-manipulation pt-[env(safe-area-inset-top,10px)] pb-[env(safe-area-inset-bottom,10px)]">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3.5 mb-2 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>⚡</span> Tic-Tac-Toe Blitz
          </h2>
          <p className="text-[11px] text-slate-400">Entry: 50 Credits • Reward: 90 Credits</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 min-h-[38px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onExit}
            className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs flex items-center gap-1 border border-rose-500/30 min-h-[38px] cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 w-full">
        {/* Turn Banner */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-semibold text-white shadow-md">
            {winner ? (
              winner === 'X' ? '🎉 You Won (+90 Credits)!' : winner === 'O' ? '🤖 Bot Won!' : '🤝 It is a Draw!'
            ) : isPlayerTurn ? (
              <>
                <User className="w-4 h-4 text-emerald-400" />
                <span>Your Turn (X)</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Bot Thinking (O)...</span>
              </>
            )}
          </div>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl w-full max-w-[340px] aspect-square">
          {board.map((val, i) => {
            const isHighlight = winningLine && winningLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleCellClick(i)}
                disabled={!isPlayerTurn || val !== null || winner !== null}
                className={`aspect-square rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all ${
                  isHighlight
                    ? 'bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 scale-105'
                    : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-100'
                } ${!val && isPlayerTurn && !winner ? 'cursor-pointer hover:border-amber-400 active:scale-95' : ''}`}
              >
                {val === 'X' && <span className="text-cyan-400">X</span>}
                {val === 'O' && <span className="text-rose-400">O</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Winner Prompt / Bottom Controls */}
      <div className="shrink-0 text-center py-2">
        {winner ? (
          <button
            onClick={handleReset}
            className="w-full max-w-[280px] py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Play Another Round
          </button>
        ) : (
          <span className="text-[11px] text-slate-500 font-medium">Tap any open square to place your mark</span>
        )}
      </div>
    </div>
  );
};
