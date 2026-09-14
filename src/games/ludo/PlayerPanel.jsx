import React from 'react';
import { Bot, Crown } from 'lucide-react';
import { LudoDice } from './LudoDice.jsx';

/**
 * Integrated Player Panel & Action Dock Component
 * Displays player avatar, name, turn status, 4 token status indicators:
 * ● In Yard (dim ring)
 * ● On Board (pulsing solid color)
 * ★ Reached Home (golden star)
 * And optionally embeds the tactile 3D Ludo dice directly into the player dock.
 */
export const PlayerPanel = ({
  player,
  color = 'blue',
  isActive = false,
  tokens = [],
  showDice = false,
  diceValue = 1,
  isRolling = false,
  canRoll = false,
  onRoll = null,
  showArrow = false,
  dicePosition = 'right', // 'left' | 'right'
  className = ''
}) => {
  if (!player) return null;

  const colorPalettes = {
    red: {
      border: 'border-red-500/40',
      activeBorder: 'border-red-400 ring-2 ring-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      bg: 'from-red-950/80 via-slate-900/90 to-slate-950/90',
      accent: 'bg-red-500',
      badge: 'bg-red-500/20 text-red-300 border-red-500/40',
      dot: 'bg-red-500'
    },
    green: {
      border: 'border-emerald-500/40',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      bg: 'from-emerald-950/80 via-slate-900/90 to-slate-950/90',
      accent: 'bg-emerald-500',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-500'
    },
    yellow: {
      border: 'border-amber-500/40',
      activeBorder: 'border-amber-400 ring-2 ring-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.5)]',
      bg: 'from-amber-950/80 via-slate-900/90 to-slate-950/90',
      accent: 'bg-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400'
    },
    blue: {
      border: 'border-blue-500/40',
      activeBorder: 'border-sky-400 ring-2 ring-sky-500/60 shadow-[0_0_20px_rgba(14,165,233,0.5)]',
      bg: 'from-blue-950/80 via-slate-900/90 to-slate-950/90',
      accent: 'bg-blue-500',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dot: 'bg-blue-500'
    }
  };

  const pal = colorPalettes[color] || colorPalettes.blue;

  // Calculate statuses for the 4 tokens
  const tokenStatuses = tokens.map((tok) => {
    if (tok.steps >= 56) return 'home';
    if (tok.steps >= 0) return 'board';
    return 'yard';
  });

  const diceElement = showDice && (
    <div className="shrink-0 flex items-center pl-1 sm:pl-2">
      <LudoDice
        value={diceValue}
        isRolling={isRolling}
        canRoll={canRoll}
        onRoll={onRoll}
        playerColor={color}
        showArrow={showArrow}
        size="normal"
      />
    </div>
  );

  return (
    <div
      className={`relative flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r ${pal.bg} border backdrop-blur-md transition-all duration-300 shadow-xl ${
        isActive ? pal.activeBorder : pal.border
      } ${className}`}
    >
      {dicePosition === 'left' && diceElement}

      {/* Player Avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border-2 ${
            isActive ? 'border-amber-400' : 'border-slate-700'
          } flex items-center justify-center overflow-hidden shadow`}
        >
          {player.isBot ? (
            <Bot className="w-5 h-5 text-emerald-400" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black text-white text-[11px] sm:text-xs">
              YOU
            </div>
          )}
        </div>
        {/* Color Badge Corner */}
        <div
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${pal.accent} border-2 border-slate-950 shadow`}
        />
      </div>

      {/* Info Column */}
      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
            {player.isBot ? 'BOT' : 'YOU'}
          </span>
          {player.hasFinished && <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
        </div>

        {/* Turn Status Tag */}
        <span
          className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
            isActive ? 'text-amber-300 font-black animate-pulse' : 'text-slate-400'
          }`}
        >
          {isActive ? (player.isBot ? "BOT'S TURN" : 'YOUR TURN') : 'WAITING'}
        </span>

        {/* Token Status Dots: ● ● ● ● */}
        <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
          {tokenStatuses.map((status, idx) => (
            <span key={idx} className="flex items-center justify-center">
              {status === 'home' ? (
                <span className="text-[10px] text-amber-300 font-bold leading-none">★</span>
              ) : status === 'board' ? (
                <span className={`w-2 h-2 rounded-full ${pal.dot} ring-1 ring-white shadow animate-pulse`} />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-800 border border-slate-600 opacity-60" />
              )}
            </span>
          ))}
        </div>
      </div>

      {dicePosition === 'right' && diceElement}
    </div>
  );
};
