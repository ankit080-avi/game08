import React from 'react';
import { LudoTokenSlot } from './LudoTokenSlot.jsx';
import { LudoToken } from './LudoToken.jsx';

/**
 * LudoHomeArea Component (Production)
 *
 * Implements the standard 6×6 home quadrant for a Ludo board.
 * Enforces identical geometry, padding, inner white panel, and 2×2 grid
 * across all four player corners (RED, GREEN, BLUE, YELLOW).
 *
 * Architecture:
 * <LudoHomeArea playerColor="red">
 *   <LudoTokenSlot><LudoToken ... /></LudoTokenSlot>
 *   <LudoTokenSlot><LudoToken ... /></LudoTokenSlot>
 *   <LudoTokenSlot><LudoToken ... /></LudoTokenSlot>
 *   <LudoTokenSlot><LudoToken ... /></LudoTokenSlot>
 * </LudoHomeArea>
 */
export const LudoHomeArea = ({
  playerColor,
  color = 'red',
  tokens = [],
  isTokenSelectable,
  onTokenClick,
  label = null,
  isActiveTurn = false,
  turnCount = 0,
  animatingToken = null,
  children = null,
  className = ''
}) => {
  const effectiveColor = playerColor || color || 'red';

  const config = {
    red: {
      gridClass: 'col-start-1 col-end-7 row-start-1 row-end-7',
      cssClass: 'ludo-quadrant-red',
      gridColumn: '1 / 7',
      gridRow: '1 / 7',
      borderClass: 'border-r-2 border-b-2 border-slate-900',
      bg: 'bg-gradient-to-br from-[#ef4444] via-[#dc2626] to-[#b91c1c]',
      badgeBorder: 'border-red-400/60 text-red-300'
    },
    green: {
      gridClass: 'col-start-10 col-end-16 row-start-1 row-end-7',
      cssClass: 'ludo-quadrant-green',
      gridColumn: '10 / 16',
      gridRow: '1 / 7',
      borderClass: 'border-l-2 border-b-2 border-slate-900',
      bg: 'bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857]',
      badgeBorder: 'border-emerald-400/60 text-emerald-300'
    },
    blue: {
      gridClass: 'col-start-1 col-end-7 row-start-10 row-end-16',
      cssClass: 'ludo-quadrant-blue',
      gridColumn: '1 / 7',
      gridRow: '10 / 16',
      borderClass: 'border-r-2 border-t-2 border-slate-900',
      bg: 'bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8]',
      badgeBorder: 'border-sky-400/60 text-sky-300'
    },
    yellow: {
      gridClass: 'col-start-10 col-end-16 row-start-10 row-end-16',
      cssClass: 'ludo-quadrant-yellow',
      gridColumn: '10 / 16',
      gridRow: '10 / 16',
      borderClass: 'border-l-2 border-t-2 border-slate-900',
      bg: 'bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309]',
      badgeBorder: 'border-amber-400/60 text-amber-300'
    }
  };

  const activeTurnStyles = {
    red: {
      pulseBg: 'bg-red-400',
      glow: 'shadow-[inset_0_0_24px_rgba(239,68,68,0.75)]'
    },
    green: {
      pulseBg: 'bg-emerald-400',
      glow: 'shadow-[inset_0_0_24px_rgba(16,185,129,0.75)]'
    },
    blue: {
      pulseBg: 'bg-sky-400',
      glow: 'shadow-[inset_0_0_24px_rgba(59,130,246,0.75)]'
    },
    yellow: {
      pulseBg: 'bg-amber-400',
      glow: 'shadow-[inset_0_0_24px_rgba(245,158,11,0.75)]'
    }
  };

  const current = config[effectiveColor] || config.red;
  const currentActive = activeTurnStyles[effectiveColor] || activeTurnStyles.red;

  return (
    <div
      style={{
        gridColumn: current.gridColumn,
        gridRow: current.gridRow
      }}
      className={`${current.cssClass} ${current.gridClass} ${current.borderClass} ${current.bg} p-5 flex items-center justify-center relative shadow-inner select-none ${className}`}
    >
      {/* 3-Cycle Soft Active Turn Pulse & Subtle Breathing Indicator */}
      {isActiveTurn && (
        <>
          {/* Initial 2-3 pulse cycles when turn begins */}
          <div
            key={`pulse-${effectiveColor}-${turnCount}`}
            className={`absolute inset-0 pointer-events-none z-10 ${currentActive.pulseBg} animate-turn-pulse mix-blend-screen`}
          />
          {/* Subtle lingering active-turn breathing glow */}
          <div
            className={`absolute inset-0 pointer-events-none z-10 ${currentActive.glow} animate-turn-breath`}
          />
        </>
      )}

      {/* Clean inner white panel with identical 2×2 grid across all 4 homes */}
      <div className="w-full h-full bg-white rounded-none shadow-sm border border-slate-800 p-2 grid grid-cols-2 grid-rows-2 place-items-center relative z-20">
        {children ? (
          children
        ) : (
          [0, 1, 2, 3].map((idx) => {
            const tok = tokens?.[idx];
            const selectable = tok && isTokenSelectable?.(effectiveColor, tok);
            const isLeaving = Boolean(animatingToken && tok && animatingToken.id === tok.id && animatingToken.isLeavingYard);

            return (
              <LudoTokenSlot
                key={`${effectiveColor}-slot-${idx}`}
                token={tok}
                color={effectiveColor}
                tokenIndex={idx}
                isSelectable={selectable}
                isLeaving={isLeaving}
                onTokenClick={onTokenClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
