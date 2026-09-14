import React from 'react';

/**
 * LudoGameBackground: Premium Themed Gaming Backdrop
 *
 * Implements:
 * - Deep navy / royal blue-purple atmospheric base
 * - Original 45-degree angled vector pattern featuring Ludo yard quadrants,
 *   4-dot dice pips, center diamond stars, and track grid lines
 * - Multi-layer radial lighting spotlight focusing on the center arena
 * - Soft peripheral vignette preserving high contrast for game board dominance
 * - Lightweight, 100% vector SVG pattern (zero raster assets, zero network delay)
 */
export const LudoGameBackground = ({
  variant = 'viewport', // 'desktop' | 'viewport'
  className = ''
}) => {
  const isDesktop = variant === 'desktop';
  const patternId = isDesktop ? 'ludo-desktop-bg-pattern' : 'ludo-viewport-bg-pattern';

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 1. Base Gradient */}
      <div
        className={`absolute inset-0 ${
          isDesktop
            ? 'bg-gradient-to-br from-[#060a17] via-[#0c1229] to-[#141030]'
            : 'bg-gradient-to-b from-[#091b46] via-[#0d2a6a] to-[#071536]'
        }`}
      />

      {/* 2. Repeating Original Ludo Vector Pattern */}
      <svg
        className={`absolute inset-0 w-full h-full ${isDesktop ? 'opacity-35' : 'opacity-45'}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
            patternTransform={isDesktop ? 'rotate(25)' : 'rotate(30)'}
          >
            {/* Subtle Track Grid Lines */}
            <path
              d="M 0,40 L 160,40 M 0,80 L 160,80 M 0,120 L 160,120 M 40,0 L 40,160 M 80,0 L 80,160 M 120,0 L 120,160"
              stroke="rgba(255,255,255,0.035)"
              strokeWidth="1"
              fill="none"
            />

            {/* Quadrant 1: Red-tinted 4-pip yard square */}
            <rect
              x="8"
              y="8"
              width="48"
              height="48"
              rx="8"
              fill="rgba(239,68,68,0.06)"
              stroke="rgba(239,68,68,0.12)"
              strokeWidth="1"
            />
            <circle cx="20" cy="20" r="4.5" fill="rgba(239,68,68,0.18)" />
            <circle cx="44" cy="20" r="4.5" fill="rgba(239,68,68,0.18)" />
            <circle cx="20" cy="44" r="4.5" fill="rgba(239,68,68,0.18)" />
            <circle cx="44" cy="44" r="4.5" fill="rgba(239,68,68,0.18)" />

            {/* Quadrant 2: Green-tinted 4-pip yard square */}
            <rect
              x="104"
              y="8"
              width="48"
              height="48"
              rx="8"
              fill="rgba(16,185,129,0.06)"
              stroke="rgba(16,185,129,0.12)"
              strokeWidth="1"
            />
            <circle cx="116" cy="20" r="4.5" fill="rgba(16,185,129,0.18)" />
            <circle cx="140" cy="20" r="4.5" fill="rgba(16,185,129,0.18)" />
            <circle cx="116" cy="44" r="4.5" fill="rgba(16,185,129,0.18)" />
            <circle cx="140" cy="44" r="4.5" fill="rgba(16,185,129,0.18)" />

            {/* Quadrant 3: Blue-tinted 4-pip yard square */}
            <rect
              x="8"
              y="104"
              width="48"
              height="48"
              rx="8"
              fill="rgba(59,130,246,0.06)"
              stroke="rgba(59,130,246,0.12)"
              strokeWidth="1"
            />
            <circle cx="20" cy="116" r="4.5" fill="rgba(59,130,246,0.18)" />
            <circle cx="44" cy="116" r="4.5" fill="rgba(59,130,246,0.18)" />
            <circle cx="20" cy="140" r="4.5" fill="rgba(59,130,246,0.18)" />
            <circle cx="44" cy="140" r="4.5" fill="rgba(59,130,246,0.18)" />

            {/* Quadrant 4: Yellow-tinted 4-pip yard square */}
            <rect
              x="104"
              y="104"
              width="48"
              height="48"
              rx="8"
              fill="rgba(245,158,11,0.06)"
              stroke="rgba(245,158,11,0.12)"
              strokeWidth="1"
            />
            <circle cx="116" cy="116" r="4.5" fill="rgba(245,158,11,0.18)" />
            <circle cx="140" cy="116" r="4.5" fill="rgba(245,158,11,0.18)" />
            <circle cx="116" cy="140" r="4.5" fill="rgba(245,158,11,0.18)" />
            <circle cx="140" cy="140" r="4.5" fill="rgba(245,158,11,0.18)" />

            {/* Center Victory Diamond */}
            <polygon
              points="80,66 94,80 80,94 66,80"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            {/* Center Gold Star Emblem */}
            <polygon
              points="80,72 82,77 87,77 83,80 85,85 80,82 75,85 77,80 73,77 78,77"
              fill="rgba(245,158,11,0.18)"
            />

            {/* Micro accent dots */}
            <circle cx="80" cy="24" r="2" fill="rgba(255,255,255,0.06)" />
            <circle cx="24" cy="80" r="2" fill="rgba(255,255,255,0.06)" />
            <circle cx="136" cy="80" r="2" fill="rgba(255,255,255,0.06)" />
            <circle cx="80" cy="136" r="2" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* 3. Soft Ambient Radial Lighting Spotlight */}
      <div
        className={`absolute inset-0 ${
          isDesktop
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.18)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_50%_48%,rgba(59,130,246,0.32)_0%,rgba(30,58,138,0.15)_55%,transparent_80%)]'
        }`}
      />

      {/* 4. Peripheral Vignette (Darkens edges to focus attention on board) */}
      <div
        className={`absolute inset-0 ${
          isDesktop
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]'
        }`}
      />
    </div>
  );
};
