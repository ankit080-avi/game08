import React from 'react';

/**
 * Premium 3D Glossy Circular Ludo Game Piece
 *
 * Visually matches authentic commercial 3D Ludo game pawns:
 * - Circular 3D tactile game piece with cylindrical bevel & carved groove
 * - Domed glossy surface with radial gradient depth
 * - Specular reflection arc & center gem crown
 * - Ground drop shadow
 * - Consistent visual styling across all 4 player colors (Red, Green, Blue, Yellow)
 * - Animated selection indicator when movable
 */
export const LudoToken = ({
  color = 'blue',
  isMovable = false,
  onClick = null,
  size = 'normal', // 'compact' | 'normal' | 'large' | 'slot'
  tokenIndex = 0,
  stackCount = 1,
  className = ''
}) => {
  const sizeMap = {
    compact: 'w-[17px] h-[17px]',
    slot: 'w-[22px] h-[22px]',
    normal: 'w-[23px] h-[23px]',
    large: 'w-[28px] h-[28px]'
  };

  const dimClass = sizeMap[size] || sizeMap.normal;

  const colorPalettes = {
    blue: {
      outerRim: '#1e3a8a',
      topStart: '#60a5fa',
      topMid: '#2563eb',
      topEnd: '#172554',
      groove: '#0f172a',
      accent: '#bfdbfe',
      glow: 'rgba(59, 130, 246, 0.85)'
    },
    green: {
      outerRim: '#064e3b',
      topStart: '#34d399',
      topMid: '#059669',
      topEnd: '#022c22',
      groove: '#022c22',
      accent: '#a7f3d0',
      glow: 'rgba(16, 185, 129, 0.85)'
    },
    red: {
      outerRim: '#991b1b',
      topStart: '#f87171',
      topMid: '#dc2626',
      topEnd: '#7f1d1d',
      groove: '#450a0a',
      accent: '#fecaca',
      glow: 'rgba(239, 68, 68, 0.85)'
    },
    yellow: {
      outerRim: '#78350f',
      topStart: '#fde047',
      topMid: '#d97706',
      topEnd: '#451a03',
      groove: '#451a03',
      accent: '#fef08a',
      glow: 'rgba(245, 158, 11, 0.85)'
    }
  };

  const pal = colorPalettes[color] || colorPalettes.blue;

  const gradId = `token-face-${color}-${tokenIndex}`;
  const rimGradId = `token-rim-${color}-${tokenIndex}`;

  return (
    <div
      onClick={isMovable && onClick ? onClick : undefined}
      className={`relative inline-flex items-center justify-center select-none shrink-0 transition-transform ${dimClass} ${
        isMovable
          ? 'cursor-pointer z-40'
          : 'cursor-default'
      } ${className}`}
    >
      {/* Movable Pulsing Indicator Ring */}
      {isMovable && (
        <span className="absolute -inset-1.5 rounded-full border-2 border-amber-400 animate-ping pointer-events-none opacity-80" />
      )}

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: isMovable
            ? `drop-shadow(0 0 6px ${pal.glow}) drop-shadow(0 4px 6px rgba(0,0,0,0.65))`
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
        }}
      >
        <defs>
          {/* Top Face Radial Depth Gradient */}
          <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor={pal.topStart} />
            <stop offset="70%" stopColor={pal.topMid} />
            <stop offset="100%" stopColor={pal.topEnd} />
          </radialGradient>

          {/* Outer Bevel Rim Gradient */}
          <linearGradient id={rimGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="30%" stopColor={pal.topMid} />
            <stop offset="100%" stopColor={pal.outerRim} />
          </linearGradient>
        </defs>

        {/* 1. Ground Drop Shadow */}
        <ellipse cx="50" cy="85" rx="42" ry="12" fill="#000000" opacity="0.45" />

        {/* 2. Outer Beveled Rim */}
        <circle
          cx="50"
          cy="52"
          r="44"
          fill={`url(#${rimGradId})`}
          stroke="#000000"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />

        {/* 3. Outer Carved Groove */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={pal.groove}
          strokeWidth="2"
          opacity="0.65"
        />

        {/* 4. Raised Domed Center Face */}
        <circle
          cx="50"
          cy="48"
          r="35"
          fill={`url(#${gradId})`}
          stroke="#000000"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {/* 5. Inner Concentric Ridge */}
        <circle
          cx="50"
          cy="48"
          r="23"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />

        {/* 6. Center Gem Crown */}
        <circle
          cx="50"
          cy="48"
          r="14"
          fill={pal.topStart}
          stroke={pal.outerRim}
          strokeWidth="1"
          opacity="0.9"
        />
        <circle cx="46" cy="44" r="4.5" fill="#ffffff" opacity="0.85" />

        {/* 7. Curved Specular Gloss Arc */}
        <path
          d="M 27 34 A 28 28 0 0 1 73 34"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>

      {/* Multi-token Stack Badge */}
      {stackCount > 1 && (
        <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-slate-950 border border-white text-[8px] font-black text-white flex items-center justify-center shadow-md">
          {stackCount}
        </span>
      )}
    </div>
  );
};

