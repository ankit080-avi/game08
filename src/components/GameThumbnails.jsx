import React from 'react';

/**
 * High-quality, 100% offline, local SVG/CSS game illustrations.
 * Zero external image dependencies - works seamlessly offline!
 */

export const LudoThumbnail = () => {
  return (
    <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-amber-500/40 transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-60" />

      {/* SVG Ludo Board Illustration */}
      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 sm:w-40 sm:h-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <radialGradient id="redGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>
          <radialGradient id="greenGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="yellowGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="blueGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Board base border */}
        <rect x="5" y="5" width="190" height="190" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="3" />

        {/* 4 Player Bases / Yards */}
        {/* Red Yard (Top Left) */}
        <rect x="12" y="12" width="70" height="70" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <rect x="22" y="22" width="50" height="50" rx="6" fill="#1e293b" />
        <circle cx="34" cy="34" r="7" fill="url(#redGrad)" filter="url(#glow)" />
        <circle cx="60" cy="34" r="7" fill="url(#redGrad)" filter="url(#glow)" />
        <circle cx="34" cy="60" r="7" fill="url(#redGrad)" filter="url(#glow)" />
        <circle cx="60" cy="60" r="7" fill="url(#redGrad)" filter="url(#glow)" />

        {/* Green Yard (Top Right) */}
        <rect x="118" y="12" width="70" height="70" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
        <rect x="128" y="22" width="50" height="50" rx="6" fill="#1e293b" />
        <circle cx="140" cy="34" r="7" fill="url(#greenGrad)" filter="url(#glow)" />
        <circle cx="166" cy="34" r="7" fill="url(#greenGrad)" filter="url(#glow)" />
        <circle cx="140" cy="60" r="7" fill="url(#greenGrad)" filter="url(#glow)" />
        <circle cx="166" cy="60" r="7" fill="url(#greenGrad)" filter="url(#glow)" />

        {/* Blue Yard (Bottom Left) */}
        <rect x="12" y="118" width="70" height="70" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
        <rect x="22" y="128" width="50" height="50" rx="6" fill="#1e293b" />
        <circle cx="34" cy="140" r="7" fill="url(#blueGrad)" filter="url(#glow)" />
        <circle cx="60" cy="140" r="7" fill="url(#blueGrad)" filter="url(#glow)" />
        <circle cx="34" cy="166" r="7" fill="url(#blueGrad)" filter="url(#glow)" />
        <circle cx="60" cy="166" r="7" fill="url(#blueGrad)" filter="url(#glow)" />

        {/* Yellow Yard (Bottom Right) */}
        <rect x="118" y="118" width="70" height="70" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
        <rect x="128" y="128" width="50" height="50" rx="6" fill="#1e293b" />
        <circle cx="140" cy="140" r="7" fill="url(#yellowGrad)" filter="url(#glow)" />
        <circle cx="166" cy="140" r="7" fill="url(#yellowGrad)" filter="url(#glow)" />
        <circle cx="140" cy="166" r="7" fill="url(#yellowGrad)" filter="url(#glow)" />
        <circle cx="166" cy="166" r="7" fill="url(#yellowGrad)" filter="url(#glow)" />

        {/* Center Home Triangles */}
        <polygon points="100,100 82,82 82,118" fill="url(#redGrad)" />
        <polygon points="100,100 82,82 118,82" fill="url(#greenGrad)" />
        <polygon points="100,100 118,82 118,118" fill="url(#yellowGrad)" />
        <polygon points="100,100 82,118 118,118" fill="url(#blueGrad)" />

        {/* Center Crown / Trophy */}
        <polygon points="95,103 105,103 108,97 103,99 100,94 97,99 92,97" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Track Cross & Safe Stars */}
        <rect x="85" y="14" width="30" height="66" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        <rect x="85" y="120" width="30" height="66" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        <rect x="14" y="85" width="66" height="30" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
        <rect x="120" y="85" width="66" height="30" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />

        {/* Red Home Run */}
        <rect x="25" y="93" width="55" height="14" fill="#ef4444" opacity="0.85" rx="2" />
        {/* Green Home Run */}
        <rect x="93" y="25" width="14" height="55" fill="#10b981" opacity="0.85" rx="2" />
      </svg>

      {/* 3D Dice Floating Badge */}
      <div className="absolute bottom-2.5 right-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-2 shadow-xl shadow-amber-500/30 border border-amber-300/40 flex items-center gap-1 transform rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all">
        <span className="text-xl leading-none">🎲</span>
        <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider">Playable</span>
      </div>
    </div>
  );
};

export const TicTacToeThumbnail = () => {
  return (
    <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-cyan-500/40 transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-60" />

      {/* SVG 3x3 Grid with Neon Marks */}
      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 sm:w-40 sm:h-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <filter id="cyanGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" />
          </filter>
          <filter id="roseGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" />
          </filter>
        </defs>

        {/* Card base */}
        <rect x="10" y="10" width="180" height="180" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />

        {/* Grid lines */}
        <line x1="72" y1="25" x2="72" y2="175" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <line x1="128" y1="25" x2="128" y2="175" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <line x1="25" y1="72" x2="175" y2="72" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        <line x1="25" y1="128" x2="175" y2="128" stroke="#334155" strokeWidth="5" strokeLinecap="round" />

        {/* Neon X (Top-Left) */}
        <g filter="url(#cyanGlow)" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round">
          <line x1="33" y1="33" x2="57" y2="57" />
          <line x1="57" y1="33" x2="33" y2="57" />
        </g>

        {/* Neon O (Center) */}
        <circle cx="100" cy="100" r="16" fill="none" stroke="#f43f5e" strokeWidth="5.5" filter="url(#roseGlow)" />

        {/* Neon X (Center-Right) */}
        <g stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" opacity="0.6">
          <line x1="145" y1="89" x2="169" y2="113" />
          <line x1="169" y1="89" x2="145" y2="113" />
        </g>

        {/* Neon O (Top-Right) */}
        <circle cx="156" cy="45" r="14" fill="none" stroke="#f43f5e" strokeWidth="5" opacity="0.6" />

        {/* Winning Strike Line (Diagonal) */}
        <line x1="25" y1="175" x2="175" y2="25" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" filter="url(#cyanGlow)" strokeDasharray="5,3" />

        {/* Neon X (Bottom-Left winning mark) */}
        <g filter="url(#cyanGlow)" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round">
          <line x1="33" y1="145" x2="57" y2="169" />
          <line x1="57" y1="145" x2="33" y2="169" />
        </g>
      </svg>

      {/* Lightning Quick Badge */}
      <div className="absolute bottom-2.5 right-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-2 shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex items-center gap-1 transform -rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all">
        <span className="text-xl leading-none">⚡</span>
        <span className="text-[10px] font-black text-white uppercase tracking-wider">Fast Play</span>
      </div>
    </div>
  );
};

export const SnakesLaddersThumbnail = () => {
  return (
    <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-indigo-500/40 transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-60" />

      {/* SVG Board with Snake & Ladder */}
      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 sm:w-40 sm:h-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Board base */}
        <rect x="10" y="10" width="180" height="180" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />

        {/* Checkerboard tile grid (4x4 tiles) */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => {
            const isLight = (row + col) % 2 === 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={25 + col * 37.5}
                y={25 + row * 37.5}
                width="36.5"
                height="36.5"
                rx="4"
                fill={isLight ? '#1e293b' : '#0f172a'}
                stroke="#334155"
                strokeWidth="0.8"
              />
            );
          })
        )}

        {/* Goal 100 Trophy at Top-Left Tile */}
        <text x="32" y="42" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">100</text>
        <polygon points="40,55 48,55 50,49 46,51 44,47 42,51 38,49" fill="#fef08a" />

        {/* Golden Wooden Ladder climbing across board */}
        <g stroke="url(#ladderGrad)" strokeWidth="3" strokeLinecap="round">
          {/* Rails */}
          <line x1="50" y1="165" x2="135" y2="45" />
          <line x1="62" y1="172" x2="147" y2="52" />
          {/* Rungs */}
          <line x1="56" y1="156" x2="68" y2="163" />
          <line x1="73" y1="132" x2="85" y2="139" />
          <line x1="90" y1="108" x2="102" y2="115" />
          <line x1="107" y1="84" x2="119" y2="91" />
          <line x1="124" y1="60" x2="136" y2="67" />
        </g>

        {/* Winding Snake slithering from top right to bottom left */}
        <path
          d="M 160 38 Q 175 65 145 85 T 125 125 T 155 155"
          fill="none"
          stroke="url(#snakeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Snake Head with eyes & tongue */}
        <circle cx="160" cy="38" r="6" fill="#059669" />
        <circle cx="161" cy="36" r="1.5" fill="#fef08a" />
        <path d="M 163 34 L 168 30 M 168 30 L 171 28 M 168 30 L 172 32" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Coming Soon Badge */}
      <div className="absolute bottom-2.5 right-3 bg-slate-800/90 rounded-xl p-2 border border-slate-700 flex items-center gap-1">
        <span className="text-xl leading-none">🐍</span>
        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Preview</span>
      </div>
    </div>
  );
};
