import React from 'react';

export const LudoPawn = ({
  color = 'blue',
  isMovable = false,
  onClick = null,
  size = 'normal', // 'small', 'normal', 'large'
  className = ''
}) => {
  const sizeMap = {
    small: 'w-5 h-7',
    normal: 'w-6 h-8 sm:w-7 sm:h-9',
    large: 'w-8 h-11'
  };

  const dim = sizeMap[size] || sizeMap.normal;

  // Exact color palettes from Ludo King
  const colorMap = {
    blue: {
      light: '#38bdf8',
      main: '#0284c7',
      dark: '#0369a1',
      baseRing: '#075985',
      glow: 'rgba(56, 189, 248, 0.6)'
    },
    green: {
      light: '#4ade80',
      main: '#16a34a',
      dark: '#15803d',
      baseRing: '#166534',
      glow: 'rgba(74, 222, 128, 0.6)'
    },
    red: {
      light: '#f87171',
      main: '#dc2626',
      dark: '#b91c1c',
      baseRing: '#991b1b',
      glow: 'rgba(248, 113, 113, 0.6)'
    },
    yellow: {
      light: '#fde047',
      main: '#eab308',
      dark: '#ca8a04',
      baseRing: '#854d0e',
      glow: 'rgba(253, 224, 71, 0.6)'
    }
  };

  const pal = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={isMovable && onClick ? onClick : undefined}
      className={`relative ${dim} flex items-center justify-center select-none transition-all duration-150 ${
        isMovable
          ? 'cursor-pointer animate-bounce z-40 drop-shadow-[0_4px_8px_rgba(234,179,8,0.7)]'
          : 'cursor-default'
      } ${className}`}
    >
      <svg
        viewBox="0 0 32 44"
        className="w-full h-full filter drop-shadow-md overflow-visible"
      >
        <defs>
          {/* 3D Body Gradient */}
          <radialGradient id={`pawnGrad-${color}`} cx="38%" cy="30%" r="70%">
            <stop offset="0%" stopColor={pal.light} />
            <stop offset="55%" stopColor={pal.main} />
            <stop offset="100%" stopColor={pal.dark} />
          </radialGradient>

          {/* Base Ring Gradient */}
          <linearGradient id={`baseGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="40%" stopColor={pal.main} />
            <stop offset="100%" stopColor={pal.baseRing} />
          </linearGradient>

          {/* Drop Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Base Ellipse Shadow */}
        <ellipse cx="16" cy="40" rx="11" ry="3.5" fill="#000000" opacity="0.35" />

        {/* Base Colored Ring */}
        <ellipse cx="16" cy="38" rx="10" ry="3" fill={`url(#baseGrad-${color})`} stroke="#1e293b" strokeWidth="0.8" />

        {/* Teardrop / Pin Pawn Body (Classic Ludo King shape) */}
        <path
          d="M 16,3 C 9,3 4,9 4,16 C 4,22 10,28 13,34 C 14,36 14.5,38 16,38 C 17.5,38 18,36 19,34 C 22,28 28,22 28,16 C 28,9 23,3 16,3 Z"
          fill={`url(#pawnGrad-${color})`}
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Specular 3D Highlight Arc */}
        <path
          d="M 10,8 C 13,5 19,5 22,8"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />

        {/* Iconic Pure White Center Circle (Ludo King hallmark) */}
        <circle cx="16" cy="16" r="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
      </svg>

      {/* Movable Pulsing Indicator Ring */}
      {isMovable && (
        <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping pointer-events-none opacity-80" />
      )}
    </div>
  );
};
