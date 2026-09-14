import React from 'react';
import knifeLogo from '../assets/games/knife-rain/logo.png';
import knifeDefault from '../assets/games/knife-rain/knife_default.png';
import appleImg from '../assets/games/knife-rain/apple.png';

/**
 * 100% Offline, Local SVG/CSS Game Visuals for all 16 Games.
 * Mobile-ready, touch-friendly, zero external dependencies.
 */

const CardWrapper = ({ children, glowColor = 'amber', compact = false, className = '' }) => (
  <div
    className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center transition-all duration-300 ${
      compact
        ? 'aspect-square p-1.5 border border-slate-800/80 shadow-md'
        : `h-40 sm:h-44 p-2.5 border border-slate-800/80 group-hover:border-${glowColor}-500/50`
    } ${className}`}
  >
    <div
      className={`absolute inset-0 bg-radial from-${glowColor}-500/${compact ? '20' : '10'} via-transparent to-transparent opacity-70 pointer-events-none`}
    />
    {children}
  </div>
);

// 1. Ludo Classic
export const LudoThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <defs>
        <radialGradient id="ludoRed" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" /></radialGradient>
        <radialGradient id="ludoGreen" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" /></radialGradient>
        <radialGradient id="ludoYellow" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></radialGradient>
        <radialGradient id="ludoBlue" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" /></radialGradient>
      </defs>
      <rect x="8" y="8" width="184" height="184" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="3" />
      <rect x="15" y="15" width="68" height="68" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
      <circle cx="37" cy="37" r="7" fill="url(#ludoRed)" />
      <circle cx="61" cy="37" r="7" fill="url(#ludoRed)" />
      <circle cx="37" cy="61" r="7" fill="url(#ludoRed)" />
      <circle cx="61" cy="61" r="7" fill="url(#ludoRed)" />
      <rect x="117" y="15" width="68" height="68" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
      <circle cx="139" cy="37" r="7" fill="url(#ludoGreen)" />
      <circle cx="163" cy="37" r="7" fill="url(#ludoGreen)" />
      <circle cx="139" cy="61" r="7" fill="url(#ludoGreen)" />
      <circle cx="163" cy="61" r="7" fill="url(#ludoGreen)" />
      <rect x="15" y="117" width="68" height="68" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
      <circle cx="37" cy="139" r="7" fill="url(#ludoBlue)" />
      <circle cx="61" cy="139" r="7" fill="url(#ludoBlue)" />
      <circle cx="37" cy="163" r="7" fill="url(#ludoBlue)" />
      <circle cx="61" cy="163" r="7" fill="url(#ludoBlue)" />
      <rect x="117" y="117" width="68" height="68" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="139" cy="139" r="7" fill="url(#ludoYellow)" />
      <circle cx="163" cy="139" r="7" fill="url(#ludoYellow)" />
      <circle cx="139" cy="163" r="7" fill="url(#ludoYellow)" />
      <circle cx="163" cy="163" r="7" fill="url(#ludoYellow)" />
      <polygon points="100,100 83,83 83,117" fill="url(#ludoRed)" />
      <polygon points="100,100 83,83 117,83" fill="url(#ludoGreen)" />
      <polygon points="100,100 117,83 117,117" fill="url(#ludoYellow)" />
      <polygon points="100,100 83,117 117,117" fill="url(#ludoBlue)" />
      <polygon points="95,102 105,102 108,96 103,98 100,93 97,98 92,96" fill="#fef08a" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🎲</span><span>LUDO</span>
    </div>
    )}
  </CardWrapper>
);

// 2. Tic-Tac-Toe Blitz
export const TicTacToeThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="cyan" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
      <line x1="72" y1="28" x2="72" y2="172" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <line x1="128" y1="28" x2="128" y2="172" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <line x1="28" y1="72" x2="172" y2="72" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <line x1="28" y1="128" x2="172" y2="128" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      <g stroke="#38bdf8" strokeWidth="6" strokeLinecap="round">
        <line x1="36" y1="36" x2="58" y2="58" /><line x1="58" y1="36" x2="36" y2="58" />
        <line x1="36" y1="142" x2="58" y2="164" /><line x1="58" y1="142" x2="36" y2="164" />
      </g>
      <circle cx="100" cy="100" r="16" fill="none" stroke="#f43f5e" strokeWidth="5" />
      <line x1="28" y1="172" x2="172" y2="28" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,4" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>⚡</span><span>X / O</span>
    </div>
    )}
  </CardWrapper>
);

// 3. Snakes & Ladders
export const SnakesLaddersThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="emerald" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={25 + c * 37.5} y={25 + r * 37.5} width="35" height="35" rx="4" fill={(r + c) % 2 === 0 ? '#1e293b' : '#0f172a'} stroke="#334155" strokeWidth="0.8" />
        ))
      )}
      <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
        <line x1="45" y1="165" x2="135" y2="45" />
        <line x1="58" y1="172" x2="148" y2="52" />
        <line x1="52" y1="156" x2="65" y2="163" />
        <line x1="72" y1="130" x2="85" y2="137" />
        <line x1="92" y1="104" x2="105" y2="111" />
        <line x1="112" y1="78" x2="125" y2="85" />
      </g>
      <path d="M 160 38 Q 175 65 145 85 T 125 125 T 155 155" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" />
      <circle cx="160" cy="38" r="6" fill="#047857" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🐍</span><span>LADDERS</span>
    </div>
    )}
  </CardWrapper>
);

// 4. Carrom
export const CarromThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="15" width="170" height="170" rx="16" fill="#78350f" stroke="#b45309" strokeWidth="4" />
      <rect x="25" y="25" width="150" height="150" rx="6" fill="#fed7aa" stroke="#9a3412" strokeWidth="2" />
      <circle cx="34" cy="34" r="8" fill="#1e293b" />
      <circle cx="166" cy="34" r="8" fill="#1e293b" />
      <circle cx="34" cy="166" r="8" fill="#1e293b" />
      <circle cx="166" cy="166" r="8" fill="#1e293b" />
      <circle cx="100" cy="100" r="28" fill="none" stroke="#dc2626" strokeWidth="2" />
      <circle cx="100" cy="100" r="8" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      <circle cx="90" cy="95" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="110" cy="95" r="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <circle cx="90" cy="108" r="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <circle cx="110" cy="108" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="100" cy="142" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🎯</span><span>CARROM</span>
    </div>
    )}
  </CardWrapper>
);

// 5. Chess
export const ChessThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="indigo" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="15" width="170" height="170" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="3" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={25 + c * 37.5} y={25 + r * 37.5} width="37.5" height="37.5" fill={(r + c) % 2 === 0 ? '#cbd5e1' : '#334155'} />
        ))
      )}
      <g transform="translate(76, 52) scale(1.6)">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1l.5 6h2.5a1 1 0 0 1 1 1v2H5v-2a1 1 0 0 1 1-1H8.5l.5-6H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3V5.73A2 2 0 0 1 12 2z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
      </g>
      <g transform="translate(112, 90) scale(1.3)">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" fill="#0f172a" stroke="#f8fafc" strokeWidth="1.2" />
        <circle cx="12" cy="7" r="4" fill="#0f172a" stroke="#f8fafc" strokeWidth="1.2" />
      </g>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>♟️</span><span>CHESS</span>
    </div>
    )}
  </CardWrapper>
);

// 6. Checkers
export const CheckersThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="rose" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="15" width="170" height="170" rx="12" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={25 + c * 37.5} y={25 + r * 37.5} width="37.5" height="37.5" fill={(r + c) % 2 === 0 ? '#e2e8f0' : '#0f172a'} />
        ))
      )}
      <circle cx="62" cy="62" r="14" fill="#dc2626" stroke="#fca5a5" strokeWidth="2.5" />
      <circle cx="137" cy="62" r="14" fill="#dc2626" stroke="#fca5a5" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
      <circle cx="62" cy="137" r="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
      <circle cx="137" cy="137" r="14" fill="#dc2626" stroke="#fca5a5" strokeWidth="2.5" />
      <text x="58" y="66" fill="#fef08a" fontSize="11" fontWeight="bold">★</text>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🔴</span><span>CHECKERS</span>
    </div>
    )}
  </CardWrapper>
);

// 7. 8 Ball Pool
export const PoolThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="emerald" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="15" y="30" width="170" height="140" rx="16" fill="#78350f" stroke="#b45309" strokeWidth="4" />
      <rect x="25" y="40" width="150" height="120" rx="8" fill="#047857" stroke="#065f46" strokeWidth="2" />
      <circle cx="34" cy="48" r="7" fill="#0f172a" />
      <circle cx="100" cy="44" r="6" fill="#0f172a" />
      <circle cx="166" cy="48" r="7" fill="#0f172a" />
      <circle cx="34" cy="152" r="7" fill="#0f172a" />
      <circle cx="100" cy="156" r="6" fill="#0f172a" />
      <circle cx="166" cy="152" r="7" fill="#0f172a" />
      <circle cx="70" cy="100" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="130" cy="100" r="10" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
      <text x="127" y="104" fill="#ffffff" fontSize="9" fontWeight="bold">8</text>
      <circle cx="146" cy="90" r="9" fill="#eab308" stroke="#ffffff" strokeWidth="1" />
      <circle cx="146" cy="110" r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
      <line x1="30" y1="120" x2="60" y2="105" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🎱</span><span>8 BALL</span>
    </div>
    )}
  </CardWrapper>
);

// 8. Archery
export const ArcheryThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <circle cx="100" cy="100" r="65" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="100" cy="100" r="50" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="35" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="20" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="8" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
      <g stroke="#f8fafc" strokeWidth="3" strokeLinecap="round">
        <line x1="25" y1="165" x2="100" y2="100" stroke="#f59e0b" strokeWidth="3.5" />
        <polygon points="104,96 100,105 95,101" fill="#f8fafc" />
        <polygon points="20,170 30,170 25,160" fill="#dc2626" />
      </g>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🏹</span><span>ARCHERY</span>
    </div>
    )}
  </CardWrapper>
);

// 9. Knife Rain
export const KnifeTargetThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <img
        src={knifeLogo}
        alt="Knife Rain"
        className={`${compact ? 'w-14 sm:w-16' : 'w-28 sm:w-32'} h-auto object-contain filter drop-shadow-lg mb-1 group-hover:scale-105 transition-transform`}
      />
      <div className="flex items-center gap-1.5">
        <img src={knifeDefault} alt="" className={`${compact ? 'w-2.5 h-7' : 'w-4 h-11'} object-contain -rotate-12 drop-shadow`} />
        <img src={appleImg} alt="" className={`${compact ? 'w-3.5 h-4' : 'w-5 h-6'} object-contain drop-shadow`} />
      </div>
    </div>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🗡️</span><span>KNIFE RAIN</span>
    </div>
    )}
  </CardWrapper>
);

// 10. Memory Match
export const MemoryMatchThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="indigo" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="25" y="30" width="65" height="65" rx="10" fill="#4338ca" stroke="#6366f1" strokeWidth="2.5" />
      <text x="47" y="73" fill="#ffffff" fontSize="28">💎</text>
      <rect x="110" y="30" width="65" height="65" rx="10" fill="#1e1b4b" stroke="#3730a3" strokeWidth="2" />
      <text x="135" y="72" fill="#a5b4fc" fontSize="26" fontWeight="bold">?</text>
      <rect x="25" y="105" width="65" height="65" rx="10" fill="#1e1b4b" stroke="#3730a3" strokeWidth="2" />
      <text x="50" y="147" fill="#a5b4fc" fontSize="26" fontWeight="bold">?</text>
      <rect x="110" y="105" width="65" height="65" rx="10" fill="#4338ca" stroke="#6366f1" strokeWidth="2.5" />
      <text x="132" y="148" fill="#ffffff" fontSize="28">💎</text>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🧠</span><span>MEMORY</span>
    </div>
    )}
  </CardWrapper>
);

// 11. Sudoku
export const SudokuThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="cyan" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="20" y="20" width="160" height="160" rx="10" fill="#090d16" stroke="#38bdf8" strokeWidth="3" />
      <line x1="73" y1="20" x2="73" y2="180" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="126" y1="20" x2="126" y2="180" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="20" y1="73" x2="180" y2="73" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="20" y1="126" x2="180" y2="126" stroke="#38bdf8" strokeWidth="2.5" />
      <text x="40" y="55" fill="#f8fafc" fontSize="20" fontWeight="bold" fontFamily="monospace">5</text>
      <text x="93" y="55" fill="#38bdf8" fontSize="20" fontWeight="bold" fontFamily="monospace">3</text>
      <text x="146" y="108" fill="#fbbf24" fontSize="20" fontWeight="bold" fontFamily="monospace">9</text>
      <text x="40" y="162" fill="#34d399" fontSize="20" fontWeight="bold" fontFamily="monospace">7</text>
      <text x="93" y="162" fill="#f8fafc" fontSize="20" fontWeight="bold" fontFamily="monospace">1</text>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🔢</span><span>SUDOKU</span>
    </div>
    )}
  </CardWrapper>
);

// 12. Mines
export const MinesThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="rose" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="20" y="20" width="160" height="160" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="30" y="30" width="40" height="40" rx="6" fill="#10b981" />
      <text x="43" y="58" fill="#ffffff" fontSize="18">💎</text>
      <rect x="80" y="30" width="40" height="40" rx="6" fill="#1e293b" />
      <rect x="130" y="30" width="40" height="40" rx="6" fill="#10b981" />
      <text x="143" y="58" fill="#ffffff" fontSize="18">💎</text>
      <rect x="30" y="80" width="40" height="40" rx="6" fill="#1e293b" />
      <rect x="80" y="80" width="40" height="40" rx="6" fill="#ef4444" />
      <text x="92" y="108" fill="#ffffff" fontSize="18">💣</text>
      <rect x="130" y="80" width="40" height="40" rx="6" fill="#1e293b" />
      <rect x="30" y="130" width="40" height="40" rx="6" fill="#10b981" />
      <text x="43" y="158" fill="#ffffff" fontSize="18">💎</text>
      <rect x="80" y="130" width="40" height="40" rx="6" fill="#1e293b" />
      <rect x="130" y="130" width="40" height="40" rx="6" fill="#1e293b" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>💣</span><span>MINES</span>
    </div>
    )}
  </CardWrapper>
);

// 13. Bubble Shooter
export const BubbleShooterThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="cyan" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="20" y="15" width="160" height="170" rx="12" fill="#090d16" stroke="#334155" strokeWidth="2" />
      <circle cx="45" cy="40" r="14" fill="#38bdf8" />
      <circle cx="75" cy="40" r="14" fill="#f43f5e" />
      <circle cx="105" cy="40" r="14" fill="#f43f5e" />
      <circle cx="135" cy="40" r="14" fill="#34d399" />
      <circle cx="60" cy="65" r="14" fill="#fbbf24" />
      <circle cx="90" cy="65" r="14" fill="#38bdf8" />
      <circle cx="120" cy="65" r="14" fill="#38bdf8" />
      <circle cx="100" cy="155" r="15" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
      <line x1="100" y1="155" x2="100" y2="100" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4,4" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🫧</span><span>BUBBLE</span>
    </div>
    )}
  </CardWrapper>
);

// 14. Fruit Slice
export const FruitSliceThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <circle cx="85" cy="85" r="45" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
      <circle cx="85" cy="85" r="35" fill="#fca5a5" />
      <circle cx="85" cy="85" r="3" fill="#0f172a" />
      <circle cx="75" cy="80" r="2.5" fill="#0f172a" />
      <circle cx="95" cy="80" r="2.5" fill="#0f172a" />
      <circle cx="80" cy="95" r="2.5" fill="#0f172a" />
      <circle cx="95" cy="95" r="2.5" fill="#0f172a" />
      {/* Blade Slice Line */}
      <line x1="20" y1="170" x2="180" y2="30" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      <line x1="20" y1="170" x2="180" y2="30" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🍉</span><span>FRUIT SLICE</span>
    </div>
    )}
  </CardWrapper>
);

// 15. Connect Four
export const ConnectFourThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="indigo" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <rect x="20" y="30" width="160" height="135" rx="12" fill="#1d4ed8" stroke="#1e40af" strokeWidth="3" />
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => {
          let dotColor = '#0f172a';
          if (r === 2) dotColor = c % 2 === 0 ? '#ef4444' : '#eab308';
          if (r === 1 && c === 1) dotColor = '#ef4444';
          return (
            <circle key={`${r}-${c}`} cx={45 + c * 36} cy={55 + r * 38} r="13" fill={dotColor} stroke="#1e3a8a" strokeWidth="2" />
          );
        })
      )}
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🔵</span><span>CONNECT 4</span>
    </div>
    )}
  </CardWrapper>
);

// 16. Rock Paper Scissors
export const RPSThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="amber" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <circle cx="60" cy="70" r="32" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
      <text x="43" y="79" fontSize="28">✊</text>
      <circle cx="140" cy="70" r="32" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
      <text x="123" y="79" fontSize="28">✋</text>
      <circle cx="100" cy="140" r="32" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.5" />
      <text x="83" y="149" fontSize="28">✌️</text>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>✊</span><span>RPS CLASH</span>
    </div>
    )}
  </CardWrapper>
);

// 17. Indian Rummy (RummyCircle Classic)
export const RummyThumbnail = ({ compact = false }) => (
  <CardWrapper glowColor="emerald" compact={compact}>
    <svg viewBox="0 0 200 200" className={compact ? "w-full h-full max-w-[85%] max-h-[85%] drop-shadow-md" : "w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl"}>
      <defs>
        <radialGradient id="feltGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#0a5c32" />
          <stop offset="100%" stopColor="#042a16" />
        </radialGradient>
      </defs>
      {/* Oval Felt Table */}
      <ellipse cx="100" cy="100" rx="90" ry="70" fill="url(#feltGrad)" stroke="#d97706" strokeWidth="3" />
      <ellipse cx="100" cy="100" rx="84" ry="64" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />

      {/* Fanned Cards */}
      {/* Card 1: 10 Spades (tilted left) */}
      <g transform="translate(60, 65) rotate(-18)">
        <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="4" y="14" fontSize="10" fontWeight="900" fill="#0f172a">10</text>
        <text x="4" y="24" fontSize="10" fill="#0f172a">♠</text>
        <text x="14" y="36" fontSize="16" fill="#0f172a">♠</text>
      </g>

      {/* Card 2: J Spades (tilted slight left) */}
      <g transform="translate(75, 58) rotate(-6)">
        <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="4" y="14" fontSize="11" fontWeight="900" fill="#0f172a">J</text>
        <text x="4" y="24" fontSize="10" fill="#0f172a">♠</text>
        <text x="14" y="36" fontSize="16" fill="#0f172a">♠</text>
      </g>

      {/* Card 3: Q Hearts (tilted slight right) */}
      <g transform="translate(92, 58) rotate(8)">
        <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <text x="4" y="14" fontSize="11" fontWeight="900" fill="#dc2626">Q</text>
        <text x="4" y="24" fontSize="10" fill="#dc2626">♥</text>
        <text x="14" y="36" fontSize="16" fill="#dc2626">♥</text>
      </g>

      {/* Card 4: K Hearts / Cut Wild Joker (tilted right) */}
      <g transform="translate(108, 65) rotate(22)">
        <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
        <text x="4" y="14" fontSize="11" fontWeight="900" fill="#dc2626">K</text>
        <text x="4" y="24" fontSize="10" fill="#dc2626">♥</text>
        <text x="14" y="36" fontSize="16" fill="#dc2626">♥</text>
        {/* Wild Star badge */}
        <circle cx="28" cy="10" r="6" fill="#f59e0b" />
        <text x="25" y="13" fontSize="8" fontWeight="900" fill="#000">★</text>
      </g>

      {/* Pure Sec Badge on table */}
      <rect x="62" y="128" width="76" height="18" rx="9" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
      <text x="100" y="140" fontSize="9" fontWeight="900" fill="#6ee7b7" textAnchor="middle" letterSpacing="1">PURE SEC ✓</text>
    </svg>
    {!compact && (
    <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
      <span>🎴</span><span>RUMMY</span>
    </div>
    )}
  </CardWrapper>
);

