import React from 'react';
import {
  getTokenCoordinate,
  canTokenMove,
  isCoordinateSafe
} from './ludoLogic.js';
import { LudoHomeArea } from './LudoHomeArea.jsx';
import { LudoToken } from './LudoToken.jsx';

/**
 * Premium 3D Physical Ludo Board Component
 *
 * Implements:
 * - Four perfectly symmetrical Home Areas (Red, Green, Yellow, Blue)
 *   built with reusable <LudoHomeArea> and <LudoTokenSlot>.
 * - Clean neutral token slots with identical 2x2 grid spacing and dimensions.
 * - Sized to ~88-90% of the portrait viewport width with 1:1 aspect ratio.
 * - Dedicated mathematical 15×15 coordinate overlay for active track tokens:
 *   TOKEN_X = (COLUMN + 0.5) / 15 * 100%
 *   TOKEN_Y = (ROW + 0.5) / 15 * 100%
 * - Zero player account name clutter: only clean BOT / YOU labels.
 */
export const getStackOffset = (index, totalCount) => {
  if (totalCount <= 1) return { x: 0, y: 0 };
  if (totalCount === 2) {
    return { x: index === 0 ? -4 : 4, y: 0 };
  }
  if (totalCount === 3) {
    if (index === 0) return { x: 0, y: -4 };
    if (index === 1) return { x: -4, y: 3 };
    return { x: 4, y: 3 };
  }
  // 4 or more tokens (2x2 mini grid)
  return {
    x: index % 2 === 0 ? -3.5 : 3.5,
    y: index < 2 ? -3.5 : 3.5
  };
};

export const QUADRANT_CONFIGS = [
  {
    id: 'red',
    color: 'red',
    gridColumn: '1 / 7',
    gridRow: '1 / 7',
    cssClass: 'ludo-quadrant-red'
  },
  {
    id: 'green',
    color: 'green',
    gridColumn: '10 / 16',
    gridRow: '1 / 7',
    cssClass: 'ludo-quadrant-green',
    label: 'BOT'
  },
  {
    id: 'blue',
    color: 'blue',
    gridColumn: '1 / 7',
    gridRow: '10 / 16',
    cssClass: 'ludo-quadrant-blue',
    label: 'YOU'
  },
  {
    id: 'yellow',
    color: 'yellow',
    gridColumn: '10 / 16',
    gridRow: '10 / 16',
    cssClass: 'ludo-quadrant-yellow'
  }
];

export const LudoBoard = ({
  tokens = { red: [], green: [], yellow: [], blue: [] },
  activeColor = 'blue',
  diceValue = 1,
  turnState = 'need_roll',
  validMoveTokenIds = [],
  isBotTurn = false,
  movingTokenId = null,
  animatingToken = null,
  captureImpact = null,
  safeLandingImpact = null,
  turnCount = 0,
  onTokenClick,
  className = ''
}) => {
  const isTokenSelectable = (color, token) => {
    if (color !== activeColor) return false;
    if (isBotTurn) return false;
    if (validMoveTokenIds && validMoveTokenIds.length > 0) {
      return validMoveTokenIds.includes(token.id);
    }
    if (turnState !== 'need_move') return false;
    return canTokenMove(token, diceValue);
  };

  // Safe 5-Point Outline Star Emblem matching reference
  const renderSafeStar = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 pointer-events-none">
      <polygon
        points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
        fill="none"
        stroke="#334155"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Collect active tokens on track/runway/home (steps >= 0) OR in flight leaving yard
  const activeTokensList = [];
  Object.entries(tokens).forEach(([color, list]) => {
    (list || []).forEach((tok, idx) => {
      const isLeavingFlight = Boolean(animatingToken && animatingToken.id === tok.id && animatingToken.isLeavingYard);
      if (tok.steps >= 0 || isLeavingFlight) {
        activeTokensList.push({ ...tok, color, idx, isLeavingFlight });
      }
    });
  });

  // Group active tokens by (r, c) cell coordinate to detect clustering
  const activeTokensByCell = {};
  activeTokensList.forEach((tok) => {
    const coord = (tok.isLeavingFlight && tok.steps === -1)
      ? getTokenCoordinate(tok.color, tok.idx, -1)
      : getTokenCoordinate(tok.color, tok.idx, tok.steps);
    const key = `${coord.r}-${coord.c}`;
    if (!activeTokensByCell[key]) activeTokensByCell[key] = [];
    activeTokensByCell[key].push(tok);
  });

  return (
    <div
      className={`relative w-full aspect-square mx-auto bg-[#0b1329] border-[3px] border-amber-400 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_2px_12px_rgba(245,158,11,0.25)] rounded-lg overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* 15x15 Inner Grid Arena */}
      <div className="relative w-full h-full bg-white overflow-hidden grid grid-cols-15 grid-rows-15 border-0 border-slate-900 shadow-inner">
        {/* ========================================================= */}
        {/* FOUR IDENTICAL HOME QUADRANTS (DATA-DRIVEN)               */}
        {/* ========================================================= */}
        {QUADRANT_CONFIGS.map((quad) => (
          <LudoHomeArea
            key={quad.id}
            color={quad.color}
            label={quad.label}
            tokens={tokens[quad.color] || []}
            isTokenSelectable={isTokenSelectable}
            isActiveTurn={activeColor === quad.color}
            turnCount={turnCount}
            animatingToken={animatingToken}
            onTokenClick={onTokenClick}
          />
        ))}

        {/* ========================================================= */}
        {/* 5. CENTER FINISH TRIANGLES (Rows 7-9, Cols 7-9, 3x3)      */}
        {/* ========================================================= */}
        <div
          style={{ gridColumn: '7 / 10', gridRow: '7 / 10' }}
          className="ludo-center-finish col-start-7 col-end-10 row-start-7 row-end-10 bg-white border border-slate-900 relative overflow-hidden flex items-center justify-center shadow-inner"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Red Left Triangle */}
            <polygon points="0,0 50,50 0,100" fill="#dc2626" stroke="#0f172a" strokeWidth="1" />
            {/* Green Top Triangle */}
            <polygon points="0,0 50,50 100,0" fill="#16a34a" stroke="#0f172a" strokeWidth="1" />
            {/* Yellow Right Triangle */}
            <polygon points="100,0 50,50 100,100" fill="#eab308" stroke="#0f172a" strokeWidth="1" />
            {/* Blue Bottom Triangle */}
            <polygon points="0,100 50,50 100,100" fill="#2563eb" stroke="#0f172a" strokeWidth="1" />

            {/* Subtle Center Finish Emblem */}
            <circle cx="50" cy="50" r="15" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
            <circle cx="50" cy="50" r="11" fill="#1e293b" />
            <polygon
              points="50,44.5 51.8,48.2 56,48.6 52.8,51.4 53.8,55.5 50,53.2 46.2,55.5 47.2,51.4 44,48.6 48.2,48.2"
              fill="#fbbf24"
            />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* 6. INDIVIDUAL TRACK CELLS (15x15)                         */}
        {/* ========================================================= */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((_, c) => {
            if (r < 6 && c < 6) return null;
            if (r < 6 && c > 8) return null;
            if (r > 8 && c < 6) return null;
            if (r > 8 && c > 8) return null;
            if (r >= 6 && r <= 8 && c >= 6 && c <= 8) return null;

            // Home Run Rows
            const isRedHome = r === 7 && c >= 1 && c <= 5;
            const isGreenHome = c === 7 && r >= 1 && r <= 5;
            const isYellowHome = r === 7 && c >= 9 && c <= 13;
            const isBlueHome = c === 7 && r >= 9 && r <= 13;

            // Start Cells
            const isRedStart = r === 6 && c === 1;
            const isGreenStart = r === 1 && c === 8;
            const isYellowStart = r === 8 && c === 13;
            const isBlueStart = r === 13 && c === 6;

            // Directional Entry Arrow Cells
            const isRedArrow = r === 6 && c === 0;
            const isGreenArrow = r === 0 && c === 7;
            const isYellowArrow = r === 7 && c === 14;
            const isBlueArrow = r === 14 && c === 7;

            // Safe Emblem Cells
            const isSafe = isCoordinateSafe(r, c);

            let cellBg = 'bg-white';
            let cellBorder = 'border-slate-300';

            if (isRedHome) {
              cellBg = 'bg-[#dc2626]';
              cellBorder = 'border-red-700';
            } else if (isGreenHome) {
              cellBg = 'bg-[#16a34a]';
              cellBorder = 'border-green-700';
            } else if (isYellowHome) {
              cellBg = 'bg-[#eab308]';
              cellBorder = 'border-yellow-600';
            } else if (isBlueHome) {
              cellBg = 'bg-[#2563eb]';
              cellBorder = 'border-blue-700';
            } else if (isRedStart) {
              cellBg = 'bg-[#dc2626]';
              cellBorder = 'border-red-700';
            } else if (isGreenStart) {
              cellBg = 'bg-[#16a34a]';
              cellBorder = 'border-green-700';
            } else if (isYellowStart) {
              cellBg = 'bg-[#eab308]';
              cellBorder = 'border-yellow-600';
            } else if (isBlueStart) {
              cellBg = 'bg-[#2563eb]';
              cellBorder = 'border-blue-700';
            }

            return (
              <div
                key={`cell-${r}-${c}`}
                style={{ gridColumnStart: c + 1, gridRowStart: r + 1 }}
                className={`relative aspect-square border ${cellBorder} ${cellBg} flex items-center justify-center select-none overflow-visible`}
              >
                {/* Entry Directional Arrows */}
                {isRedArrow && (
                  <span className="text-xs font-black text-red-600 pointer-events-none">→</span>
                )}
                {isGreenArrow && (
                  <span className="text-xs font-black text-emerald-600 pointer-events-none">↓</span>
                )}
                {isYellowArrow && (
                  <span className="text-xs font-black text-amber-600 pointer-events-none">←</span>
                )}
                {isBlueArrow && (
                  <span className="text-xs font-black text-blue-600 pointer-events-none">↑</span>
                )}

                {/* Safe Star Tile */}
                {isSafe && !isRedStart && !isGreenStart && !isYellowStart && !isBlueStart && (
                  renderSafeStar()
                )}
              </div>
            );
          })
        )}

        {/* ========================================================= */}
        {/* 7. DEDICATED MATHEMATICAL 15×15 TRACK TOKEN LAYER         */}
        {/* Exact cell center: X = (c + 0.5) / 15, Y = (r + 0.5) / 15 */}
        {/* ========================================================= */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {activeTokensList.map((tok) => {
            const coord = (tok.isLeavingFlight && tok.steps === -1)
              ? getTokenCoordinate(tok.color, tok.idx, -1)
              : getTokenCoordinate(tok.color, tok.idx, tok.steps);

            const isSelectable = isTokenSelectable(tok.color, tok);

            // Check if this token is currently in motion
            const isThisTokenMoving = Boolean(animatingToken && animatingToken.id === tok.id);
            const isLeavingYard = isThisTokenMoving && animatingToken.isLeavingYard;
            const isEnteringYard = isThisTokenMoving && animatingToken.isEnteringYard;
            const isCaptureHighlight = isThisTokenMoving && animatingToken.isCaptureHighlight;
            const isCaptureRewind = isThisTokenMoving && animatingToken.isCaptureRewind;
            const isSettling = isThisTokenMoving && animatingToken.isSettling;
            const isMoving = isThisTokenMoving && !isSettling && !isCaptureHighlight && !isCaptureRewind;
            const stepDuration = animatingToken?.stepDuration || 120;
            const stepNumber = animatingToken?.stepNumber || 0;

            // Directional tilt calculation
            const dr = animatingToken?.direction?.dr || 0;
            const dc = animatingToken?.direction?.dc || 0;
            let tiltDeg = 0;
            if (isCaptureRewind) {
              tiltDeg = 0; // Grounded & upright while smoothly sliding backwards
            } else if (dc > 0 && dr === 0) tiltDeg = 2.5;
            else if (dc < 0 && dr === 0) tiltDeg = -2.5;
            else if (dr > 0 && dc === 0) tiltDeg = 1.2;
            else if (dr < 0 && dc === 0) tiltDeg = -1.2;
            else if (dc > 0 && dr > 0) tiltDeg = 2;
            else if (dc < 0 && dr > 0) tiltDeg = -2;
            else if (dc < 0 && dr < 0) tiltDeg = -2;
            else if (dc > 0 && dr < 0) tiltDeg = 2;

            // Clustering & offset
            const cluster = activeTokensByCell[`${coord.r}-${coord.c}`] || [];
            const clusterIndex = cluster.findIndex((t) => t.id === tok.id);
            const isStacked = cluster.length > 1;
            const offset = isThisTokenMoving ? { x: 0, y: 0 } : getStackOffset(clusterIndex, cluster.length);
            const isTopToken = clusterIndex === cluster.length - 1;

            return (
              <div
                key={tok.id}
                style={{
                  position: 'absolute',
                  left: `${((coord.c + 0.5) / 15) * 100}%`,
                  top: `${((coord.r + 0.5) / 15) * 100}%`,
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  zIndex: isThisTokenMoving ? 100 : isSelectable ? 50 : 30 + clusterIndex,
                  transition: isCaptureRewind
                    ? (isEnteringYard
                        ? `left ${stepDuration}ms cubic-bezier(0.25, 1, 0.5, 1), top ${stepDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`
                        : `left ${stepDuration}ms linear, top ${stepDuration}ms linear`)
                    : isThisTokenMoving
                    ? `left ${stepDuration}ms cubic-bezier(0.25, 1, 0.5, 1), top ${stepDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`
                    : undefined,
                  willChange: isThisTokenMoving ? 'left, top' : undefined
                }}
                className="pointer-events-auto flex items-center justify-center"
              >
                {/* Inner Physical Hop/Slide Stage */}
                <div
                  key={
                    isCaptureHighlight
                      ? 'cap-highlight'
                      : isCaptureRewind
                      ? 'cap-rewind'
                      : isLeavingYard
                      ? 'yard-exit'
                      : isMoving
                      ? `hop-${stepNumber}`
                      : isSettling
                      ? 'settle'
                      : 'idle'
                  }
                  className={`relative flex items-center justify-center ${
                    isCaptureHighlight
                      ? 'animate-capture-highlight'
                      : isCaptureRewind
                      ? 'animate-token-slide'
                      : isLeavingYard
                      ? 'animate-yard-exit'
                      : isMoving
                      ? 'animate-cell-hop'
                      : isSettling
                      ? 'animate-cell-settle'
                      : ''
                  }`}
                  style={{
                    '--token-tilt': `rotate(${tiltDeg}deg)`,
                    '--hop-duration': `${stepDuration}ms`,
                    '--yard-duration': `${stepDuration}ms`
                  }}
                >
                  {/* Dynamic Ground Shadow */}
                  <div
                    className={`absolute -bottom-1 w-[80%] h-[26%] rounded-full bg-black/65 pointer-events-none ${
                      isCaptureRewind
                        ? 'animate-token-slide-shadow'
                        : isLeavingYard
                        ? 'animate-yard-exit-shadow'
                        : isMoving
                        ? 'animate-cell-hop-shadow'
                        : isSettling
                        ? 'animate-shadow-settle'
                        : ''
                    }`}
                    style={{
                      filter: 'blur(1.5px)',
                      '--hop-duration': `${stepDuration}ms`,
                      '--yard-duration': `${stepDuration}ms`
                    }}
                  />

                  {/* Physical Token Body */}
                  <LudoToken
                    color={tok.color}
                    tokenIndex={tok.idx}
                    isMovable={isSelectable}
                    onClick={() => onTokenClick?.(tok.color, tok.id)}
                    size={isStacked && !isThisTokenMoving ? 'compact' : 'normal'}
                    stackCount={isStacked && isTopToken && !isThisTokenMoving ? cluster.length : 1}
                  />
                </div>
              </div>
            );
          })}

          {/* Visual Capture Shockwave Ripple at Capture Tile */}
          {captureImpact && (
            <div
              key={`capture-${captureImpact.timestamp}`}
              style={{
                position: 'absolute',
                left: `${((captureImpact.c + 0.5) / 15) * 100}%`,
                top: `${((captureImpact.r + 0.5) / 15) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 60
              }}
              className="pointer-events-none flex items-center justify-center"
            >
              <span className="absolute w-12 h-12 rounded-full border-2 border-rose-500 bg-rose-500/30 animate-capture-ripple" />
              <span className="absolute text-base animate-ping">💥</span>
            </div>
          )}

          {/* Visual Safe Zone Landing Subtle Golden Pulse */}
          {safeLandingImpact && (
            <div
              key={`safe-${safeLandingImpact.timestamp}`}
              style={{
                position: 'absolute',
                left: `${((safeLandingImpact.c + 0.5) / 15) * 100}%`,
                top: `${((safeLandingImpact.r + 0.5) / 15) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 60
              }}
              className="pointer-events-none flex items-center justify-center"
            >
              <span className="absolute w-9 h-9 rounded-full border border-amber-300/80 bg-amber-400/20 animate-ping" />
              <span className="absolute w-6 h-6 rounded-full border border-amber-200/90 bg-amber-300/30" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
