import React from 'react';
import { isCardJoker, SUIT_COLORS } from './rummyLogic.js';

export const RummyCard = ({
  card,
  cutJoker = null,
  isFaceDown = false,
  isSelected = false,
  onClick = null,
  size = 'normal', // 'compact', 'small', 'normal', 'large'
  disabled = false,
  className = '',
  badge = null
}) => {
  // Size presets optimized for both mobile and desktop screens
  const sizeClasses = {
    compact: 'w-11 h-16 sm:w-13 sm:h-18 text-[11px] rounded-md',
    small: 'w-12 h-17 sm:w-14 sm:h-20 text-xs rounded-lg',
    normal: 'w-13 h-19 sm:w-16 sm:h-23 md:w-16 md:h-24 text-xs sm:text-sm rounded-lg',
    large: 'w-16 h-24 sm:w-20 sm:h-28 text-base rounded-xl'
  };

  const dim = sizeClasses[size] || sizeClasses.normal;

  if (isFaceDown || !card) {
    return (
      <div
        onClick={!disabled && onClick ? onClick : undefined}
        className={`relative ${dim} shrink-0 bg-gradient-to-br from-red-900 via-rose-950 to-red-950 border-2 border-amber-400/60 shadow-md flex items-center justify-center select-none overflow-hidden transition-transform duration-150 ${
          onClick && !disabled ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${className}`}
      >
        {/* RummyCircle Ornate Card Back Pattern */}
        <div className="absolute inset-0.5 border border-amber-400/40 rounded flex items-center justify-center">
          <div className="w-full h-full opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:5px_5px]" />
          <div className="absolute w-6 h-6 rounded-full border border-amber-400/70 flex items-center justify-center bg-red-950/90 shadow-inner">
            <span className="text-amber-400 text-[8px] font-black">♠♥</span>
          </div>
        </div>
      </div>
    );
  }

  const isJoker = isCardJoker(card, cutJoker);
  const isCutMatch = cutJoker && card.rank === cutJoker.rank && !card.isPrintedJoker;
  const isRed = card.suit === '♥' || card.suit === '♦';
  const suitColor = SUIT_COLORS[card.suit] || (isRed ? '#dc2626' : '#0f172a');

  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      className={`relative ${dim} shrink-0 bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-300 shadow-md flex flex-col justify-between p-1 select-none transition-all duration-200 ease-out ${
        isSelected
          ? '-translate-y-3.5 ring-2 ring-amber-400 shadow-xl shadow-amber-500/50 border-amber-300 z-20 scale-105'
          : 'hover:-translate-y-1 z-10'
      } ${onClick && !disabled ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {/* Joker indicator badge (RummyCircle hallmark) */}
      {isJoker && (
        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[7px] sm:text-[8px] px-1 py-0.2 rounded-full shadow-md flex items-center gap-0.5 border border-amber-200 z-30">
          <span>★</span>
          <span>{card.isPrintedJoker ? 'JOKER' : 'WILD'}</span>
        </div>
      )}

      {/* Selected indicator pin */}
      {isSelected && (
        <div className="absolute -top-1.5 -left-1.5 bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow border border-slate-900 z-30">
          ✓
        </div>
      )}

      {/* Custom badge passed by caller (e.g. points) */}
      {badge && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-amber-300 text-[8px] px-1 rounded shadow z-20">
          {badge}
        </div>
      )}

      {/* Top Left Rank & Suit (Left-aligned so visible when overlapped) */}
      <div className="flex flex-col items-start leading-none pl-0.5" style={{ color: suitColor }}>
        <span className="font-black text-xs sm:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-xs sm:text-sm -mt-0.5">{card.suit}</span>
      </div>

      {/* Center Display */}
      <div className="flex items-center justify-center flex-1 my-auto pointer-events-none">
        {card.isPrintedJoker ? (
          <div className="text-center">
            <span className="text-base sm:text-2xl">🃏</span>
            <div className="text-[6px] sm:text-[7px] font-black text-amber-700 uppercase tracking-widest leading-tight">
              Joker
            </div>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="text-lg sm:text-2xl opacity-90 font-serif" style={{ color: suitColor }}>
              {card.suit}
            </span>
            {isCutMatch && (
              <span className="absolute -bottom-1.5 text-[7px] sm:text-[8px] font-black bg-amber-400 text-slate-900 px-0.5 rounded leading-tight">
                WILD
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Right Inverted Rank & Suit */}
      <div className="flex flex-col items-end leading-none pr-0.5 rotate-180" style={{ color: suitColor }}>
        <span className="font-black text-xs sm:text-sm tracking-tighter">{card.rank}</span>
        <span className="text-xs sm:text-sm -mt-0.5">{card.suit}</span>
      </div>
    </div>
  );
};
