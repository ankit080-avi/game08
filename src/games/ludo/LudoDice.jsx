import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ludoAudio } from './ludoAudio.js';

/**
 * Senior-Grade Physical 3D Tactile Ludo Dice Component
 *
 * Implements:
 * - True physical 3D appearance: ivory ceramic body, beveled edge extrusion, specular gloss arc, and ground shadow
 * - Interactive Lifecycle: IDLE (float & shadow breathing) -> PRESS (compression) -> LIFT -> ROLL (3D tumbling on X/Y/Z) -> SETTLE (landing bounce)
 * - Dynamic Ground Shadow that contracts on press, diffuses on lift/roll, and tightens on landing
 * - High-contrast carved recessed pips with authentic layout and center gem pip for 1
 * - Reusable for both Human Player and Bot with unified 3D physics
 * - 100% authoritative game result preservation
 */
export const LudoDice = ({
  value = 1,
  isRolling = false,
  canRoll = false,
  onRoll,
  playerColor = 'blue',
  showArrow = false,
  size = 'normal', // 'compact' | 'normal' | 'large'
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [justSettled, setJustSettled] = useState(false);
  const wasRollingRef = useRef(isRolling);
  const isInputLockedRef = useRef(false);

  // Settle Bounce detection on roll completion
  useEffect(() => {
    if (wasRollingRef.current && !isRolling) {
      setJustSettled(true);
      const timer = setTimeout(() => {
        setJustSettled(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    wasRollingRef.current = isRolling;
  }, [isRolling]);

  // Keep input lock in sync with authoritative canRoll & isRolling props
  useEffect(() => {
    if (!canRoll || isRolling) {
      isInputLockedRef.current = true;
    } else {
      isInputLockedRef.current = false;
    }
  }, [canRoll, isRolling]);

  // Handle Physical Press -> Lift -> Roll Sequence with synchronous input locking
  const handlePress = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Strict synchronous check: immediately drop all rapid/duplicate taps
    if (!canRoll || isRolling || isInputLockedRef.current) return;

    // Synchronously lock input immediately before any timers or callbacks
    isInputLockedRef.current = true;

    // 1. Physical Press compression feedback
    setIsPressed(true);
    ludoAudio.playButtonClick();

    // 2. Authoritative roll triggered immediately so engine locks synchronously
    onRoll?.();

    setTimeout(() => {
      setIsPressed(false);
    }, 85);
  }, [canRoll, isRolling, onRoll]);

  // Dimensions
  const sizeClasses = {
    compact: 'w-10 h-10 rounded-xl',
    normal: 'w-14 h-14 rounded-2xl',
    large: 'w-16 h-16 rounded-2xl'
  }[size] || 'w-14 h-14 rounded-2xl';

  const pipSizes = {
    compact: 'w-2 h-2',
    normal: 'w-2.5 h-2.5',
    large: 'w-3 h-3'
  }[size] || 'w-2.5 h-2.5';

  const pipClass = `${pipSizes} rounded-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.95),0_0.5px_1px_rgba(255,255,255,0.7)]`;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)'
  };

  const renderPips = (val) => {
    switch (val) {
      case 1:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span
              style={{ gridColumn: 2, gridRow: 2 }}
              className={`m-auto ${size === 'compact' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} rounded-full bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#020617] border border-slate-700/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.95),0_1px_1.5px_rgba(255,255,255,0.8)]`}
            />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span style={{ gridColumn: 1, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 3 }} className={`m-auto ${pipClass}`} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span style={{ gridColumn: 1, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 2, gridRow: 2 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 3 }} className={`m-auto ${pipClass}`} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span style={{ gridColumn: 1, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 1, gridRow: 3 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 3 }} className={`m-auto ${pipClass}`} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span style={{ gridColumn: 1, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 2, gridRow: 2 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 1, gridRow: 3 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 3 }} className={`m-auto ${pipClass}`} />
          </div>
        );
      case 6:
      default:
        return (
          <div className="w-full h-full p-2.5" style={gridStyle}>
            <span style={{ gridColumn: 1, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 1 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 1, gridRow: 2 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 2 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 1, gridRow: 3 }} className={`m-auto ${pipClass}`} />
            <span style={{ gridColumn: 3, gridRow: 3 }} className={`m-auto ${pipClass}`} />
          </div>
        );
    }
  };

  // Determine Dynamic Shadow State
  let shadowClass = 'scale-x-90 opacity-40';
  if (isPressed) {
    shadowClass = 'scale-x-75 scale-y-75 opacity-70';
  } else if (isRolling) {
    shadowClass = 'animate-shadow-roll-3d';
  } else if (justSettled) {
    shadowClass = 'animate-shadow-landing-3d';
  } else if (canRoll) {
    shadowClass = 'animate-shadow-idle-3d';
  }

  // Determine 3D Dice Body State
  let bodyStateClass = '';
  if (isPressed) {
    bodyStateClass = 'scale-[0.93] translate-y-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_1px_0_#94a3b8]';
  } else if (isRolling) {
    bodyStateClass = 'animate-dice-roll-3d cursor-wait ring-2 ring-amber-300 shadow-[0_0_22px_rgba(245,158,11,0.85)]';
  } else if (justSettled) {
    bodyStateClass = 'animate-dice-landing-3d ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.8)]';
  } else if (canRoll) {
    bodyStateClass = 'animate-dice-idle-3d cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(15,23,42,0.1),0_4px_0_#d97706,0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.45)]';
  } else {
    bodyStateClass = 'opacity-80 cursor-default ring-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_3px_0_#cbd5e1,0_4px_0_#94a3b8,0_6px_10px_rgba(0,0,0,0.25)]';
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ perspective: '600px' }}
    >
      {/* Dynamic Ground Shadow */}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-11 h-2.5 rounded-full bg-slate-950/70 blur-[2.5px] pointer-events-none transition-all duration-200 ${shadowClass}`}
      />

      {/* Animated Pointing Arrow Indicator */}
      {showArrow && canRoll && !isRolling && (
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center z-30 pointer-events-none animate-bounce-left">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] fill-amber-400 stroke-amber-600 stroke-[1.5]"
          >
            <polygon points="20,9 10,9 10,4 2,12 10,20 10,15 20,15" />
          </svg>
        </div>
      )}

      {/* 3D Physical Ivory Dice Tile */}
      <button
        type="button"
        onClick={handlePress}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        disabled={!canRoll || isRolling}
        aria-label={`Dice face ${value}. ${canRoll ? 'Click to roll' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative ${sizeClasses} shrink-0 bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] border-[1.5px] border-white/95 flex items-center justify-center transition-all ${
          !canRoll || isRolling ? 'pointer-events-none ' : ''
        }${bodyStateClass}`}
      >
        {/* Specular Curved Sheen Gloss Arc */}
        <div className="absolute top-1 left-1.5 right-1.5 h-2.5 bg-gradient-to-b from-white/95 via-white/40 to-transparent rounded-t-xl pointer-events-none" />

        {/* Dice Pips */}
        {renderPips(value)}
      </button>
    </div>
  );
};

