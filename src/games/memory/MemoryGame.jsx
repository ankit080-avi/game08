import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut } from 'lucide-react';

const EMOJIS = ['💎', '🔥', '⚡', '👑', '🚀', '🌟'];

export const MemoryGame = ({ onExit, onWin, user, session, entryFee = 35 }) => {
  const [cards, setCards] = useState(() => initializeCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function initializeCards() {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
    return deck;
  }

  const handleCardClick = (idx) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || flippedIndices.length >= 2 || gameOver) return;

    const nextDeck = [...cards];
    nextDeck[idx].isFlipped = true;
    setCards(nextDeck);

    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = nextFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        // Matched!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, isMatched: true } : c))
          );
          setFlippedIndices([]);
          const nextMatched = matchedPairs + 1;
          setMatchedPairs(nextMatched);

          if (nextMatched === EMOJIS.length) {
            setGameOver(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            if (onWin) onWin(70);
          }
        }, 400);
      } else {
        // Not matching, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const handleReset = () => {
    setCards(initializeCards());
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameOver(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl">
            🧠
          </div>
          <div>
            <h2 className="text-base font-black text-white">Memory Match</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-MEM'}</span> • Entry: {entryFee} Credits
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
          <div>Pairs Found: <span className="text-emerald-400 text-sm">{matchedPairs} / 6</span></div>
          <div>Moves: <span className="text-amber-400 text-sm">{moves}</span></div>
        </div>

        {/* 4x3 Card Grid */}
        <div className="grid grid-cols-4 gap-2.5 w-full max-w-[340px] p-2 bg-slate-950 rounded-2xl border border-slate-800">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.isFlipped || card.isMatched || gameOver}
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-black transition-all duration-200 cursor-pointer select-none ${
                card.isFlipped || card.isMatched
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-500'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>

        <div className="w-full text-center mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {gameOver ? 'All pairs matched! Victory reward credited.' : 'Tap any two cards to test your memory!'}
        </div>
      </div>
    </div>
  );
};
