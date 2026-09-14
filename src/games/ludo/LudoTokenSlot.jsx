import React from 'react';
import { LudoToken } from './LudoToken.jsx';

export const LudoTokenSlot = ({
  children = null,
  token = null,
  color = 'blue',
  tokenIndex = 0,
  isSelectable = false,
  isLeaving = false,
  onTokenClick = null,
  className = ''
}) => {
  const content = children || (token && token.steps === -1 && !isLeaving ? (
    <LudoToken
      color={color}
      tokenIndex={tokenIndex}
      isMovable={isSelectable}
      onClick={() => onTokenClick?.(color, token.id)}
      size="slot"
    />
  ) : null);

  const slotBorderColorMap = {
    red: 'border-red-400/50',
    green: 'border-emerald-400/50',
    yellow: 'border-amber-400/50',
    blue: 'border-sky-400/50'
  };

  const slotInnerColorMap = {
    red: 'bg-red-500/25',
    green: 'bg-emerald-500/25',
    yellow: 'bg-amber-500/25',
    blue: 'bg-blue-500/25'
  };

  return (
    <div
      className={`relative aspect-square w-8 h-8 rounded-full bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-2 border-slate-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.18),0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center select-none ${className}`}
    >
      {/* Subtle recessed inner slot circle */}
      <div
        className={`w-3.5 h-3.5 rounded-full ${slotInnerColorMap[color] || 'bg-slate-300/70'} border ${
          slotBorderColorMap[color] || 'border-slate-400/60'
        } shadow-inner pointer-events-none`}
      />

      {/* Real 3D Token sits centered ON TOP of the slot */}
      {content && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-center w-full h-full">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

