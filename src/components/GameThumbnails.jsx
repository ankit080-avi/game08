import React from 'react';
import knifeLogo from '../assets/games/knife-rain/logo.png';
import knifeDefault from '../assets/games/knife-rain/knife_default.png';
import appleImg from '../assets/games/knife-rain/apple.png';

/**
 * 100% Offline, Local Game Visuals for all 17 Games.
 * - Desktop: Existing clean tactical preview with bottom category badge.
 * - Mobile Compact: Vibrant, full-bleed saturated artwork with embedded 3D titles matching reference.
 */

const CardWrapper = ({ children, glowColor = 'amber', compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none ${className}`}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center transition-all duration-300 h-40 sm:h-44 p-2.5 border border-slate-800/80 group-hover:border-${glowColor}-500/50 ${className}`}
    >
      <div
        className={`absolute inset-0 bg-radial from-${glowColor}-500/10 via-transparent to-transparent opacity-70 pointer-events-none`}
      />
      {children}
    </div>
  );
};

// 1. Ludo Classic
export const LudoThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="ludoBgM" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <radialGradient id="lrM" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" /></radialGradient>
            <radialGradient id="lgM" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" /></radialGradient>
            <radialGradient id="lyM" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></radialGradient>
            <radialGradient id="lbM" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" /></radialGradient>
            <linearGradient id="ludoTextGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="vignetteM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#ludoBgM)" />
          {/* Ludo Board Center */}
          <rect x="18" y="14" width="164" height="150" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Quadrants */}
          <rect x="25" y="21" width="60" height="54" rx="8" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="45" cy="40" r="6" fill="url(#lrM)" /><circle cx="65" cy="40" r="6" fill="url(#lrM)" />
          <circle cx="45" cy="58" r="6" fill="url(#lrM)" /><circle cx="65" cy="58" r="6" fill="url(#lrM)" />
          <rect x="115" y="21" width="60" height="54" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
          <circle cx="135" cy="40" r="6" fill="url(#lgM)" /><circle cx="155" cy="40" r="6" fill="url(#lgM)" />
          <circle cx="135" cy="58" r="6" fill="url(#lgM)" /><circle cx="155" cy="58" r="6" fill="url(#lgM)" />
          <rect x="25" y="103" width="60" height="54" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="45" cy="120" r="6" fill="url(#lbM)" /><circle cx="65" cy="120" r="6" fill="url(#lbM)" />
          <circle cx="45" cy="138" r="6" fill="url(#lbM)" /><circle cx="65" cy="138" r="6" fill="url(#lbM)" />
          <rect x="115" y="103" width="60" height="54" rx="8" fill="#854d0e" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="135" cy="120" r="6" fill="url(#lyM)" /><circle cx="155" cy="120" r="6" fill="url(#lyM)" />
          <circle cx="135" cy="138" r="6" fill="url(#lyM)" /><circle cx="155" cy="138" r="6" fill="url(#lyM)" />
          {/* Center Triangles */}
          <polygon points="100,89 85,75 85,103" fill="url(#lrM)" />
          <polygon points="100,89 85,75 115,75" fill="url(#lgM)" />
          <polygon points="100,89 115,75 115,103" fill="url(#lyM)" />
          <polygon points="100,89 85,103 115,103" fill="url(#lbM)" />
          <polygon points="95,91 105,91 108,86 103,88 100,83 97,88 92,86" fill="#fef08a" />
          {/* Bottom Shadow & Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM)" />
          <text x="100" y="180" textAnchor="middle" fill="url(#ludoTextGrad)" fontWeight="900" fontSize="23" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">LUDO</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <defs>
          <radialGradient id="ludoRed" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#dc2626" /></radialGradient>
          <radialGradient id="ludoGreen" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" /></radialGradient>
          <radialGradient id="ludoYellow" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></radialGradient>
          <radialGradient id="ludoBlue" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="100%" stopColor="#2563eb" /></radialGradient>
        </defs>
        <rect x="8" y="8" width="184" height="184" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="3" />
        <rect x="15" y="15" width="68" height="68" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <circle cx="37" cy="37" r="7" fill="url(#ludoRed)" /><circle cx="61" cy="37" r="7" fill="url(#ludoRed)" /><circle cx="37" cy="61" r="7" fill="url(#ludoRed)" /><circle cx="61" cy="61" r="7" fill="url(#ludoRed)" />
        <rect x="117" y="15" width="68" height="68" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
        <circle cx="139" cy="37" r="7" fill="url(#ludoGreen)" /><circle cx="163" cy="37" r="7" fill="url(#ludoGreen)" /><circle cx="139" cy="61" r="7" fill="url(#ludoGreen)" /><circle cx="163" cy="61" r="7" fill="url(#ludoGreen)" />
        <rect x="15" y="117" width="68" height="68" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="37" cy="139" r="7" fill="url(#ludoBlue)" /><circle cx="61" cy="139" r="7" fill="url(#ludoBlue)" /><circle cx="37" cy="163" r="7" fill="url(#ludoBlue)" /><circle cx="61" cy="163" r="7" fill="url(#ludoBlue)" />
        <rect x="117" y="117" width="68" height="68" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="139" cy="139" r="7" fill="url(#ludoYellow)" /><circle cx="163" cy="139" r="7" fill="url(#ludoYellow)" /><circle cx="139" cy="163" r="7" fill="url(#ludoYellow)" /><circle cx="163" cy="163" r="7" fill="url(#ludoYellow)" />
        <polygon points="100,100 83,83 83,117" fill="url(#ludoRed)" />
        <polygon points="100,100 83,83 117,83" fill="url(#ludoGreen)" />
        <polygon points="100,100 117,83 117,117" fill="url(#ludoYellow)" />
        <polygon points="100,100 83,117 117,117" fill="url(#ludoBlue)" />
        <polygon points="95,102 105,102 108,96 103,98 100,93 97,98 92,96" fill="#fef08a" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🎲</span><span>LUDO</span>
      </div>
    </CardWrapper>
  );
};

// 2. Tic-Tac-Toe Blitz
export const TicTacToeThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="tttBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="vignetteM2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#tttBgM)" />
          {/* Neon Grid */}
          <line x1="72" y1="20" x2="72" y2="145" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="128" y1="20" x2="128" y2="145" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="62" x2="180" y2="62" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="104" x2="180" y2="104" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
          {/* Neon X and O */}
          <g stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 6px #0284c7)">
            <line x1="32" y1="28" x2="60" y2="54" /><line x1="60" y1="28" x2="32" y2="54" />
            <line x1="86" y1="70" x2="114" y2="96" /><line x1="114" y1="70" x2="86" y2="96" />
            <line x1="140" y1="112" x2="168" y2="138" /><line x1="168" y1="112" x2="140" y2="138" />
          </g>
          <g stroke="#f43f5e" strokeWidth="5.5" fill="none" filter="drop-shadow(0 0 6px #e11d48)">
            <circle cx="154" cy="41" r="14" />
            <circle cx="46" cy="125" r="14" />
            <circle cx="100" cy="41" r="14" />
          </g>
          {/* Win Streak Slash */}
          <line x1="24" y1="20" x2="176" y2="146" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" filter="drop-shadow(0 0 8px #06b6d4)" />
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM2)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="19" letterSpacing="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">Tic-Tac-Toe</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="cyan" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
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
      <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>⚡</span><span>X / O</span>
      </div>
    </CardWrapper>
  );
};

// 3. Snakes & Ladders
export const SnakesLaddersThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="snakesBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#03254c" />
            </radialGradient>
            <linearGradient id="ladderGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" /><stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="vignetteM3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#snakesBgM)" />
          {/* Subtle Grid Lines */}
          <g stroke="#38bdf8" strokeWidth="1" opacity="0.3">
            <line x1="15" y1="45" x2="185" y2="45" /><line x1="15" y1="85" x2="185" y2="85" /><line x1="15" y1="125" x2="185" y2="125" />
            <line x1="60" y1="15" x2="60" y2="145" /><line x1="105" y1="15" x2="105" y2="145" /><line x1="150" y1="15" x2="150" y2="145" />
          </g>
          {/* Golden Ladder */}
          <g stroke="url(#ladderGold)" strokeWidth="4.5" strokeLinecap="round" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.6))">
            <line x1="65" y1="140" x2="140" y2="30" />
            <line x1="85" y1="152" x2="160" y2="42" />
            <line x1="75" y1="125" x2="95" y2="137" strokeWidth="3.5" />
            <line x1="90" y1="103" x2="110" y2="115" strokeWidth="3.5" />
            <line x1="105" y1="81" x2="125" y2="93" strokeWidth="3.5" />
            <line x1="120" y1="59" x2="140" y2="71" strokeWidth="3.5" />
          </g>
          {/* 3D Green Snake with Yellow Belly */}
          <path d="M 40,30 Q 75,15 70,55 Q 65,95 105,100 Q 145,105 130,145" fill="none" stroke="#16a34a" strokeWidth="9" strokeLinecap="round" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))" />
          <path d="M 40,30 Q 75,15 70,55 Q 65,95 105,100 Q 145,105 130,145" fill="none" stroke="#86efac" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          {/* Snake Head */}
          <circle cx="38" cy="30" r="7.5" fill="#15803d" />
          <circle cx="36" cy="28" r="2.5" fill="#fef08a" /><circle cx="35" cy="28" r="1.2" fill="#000" />
          {/* 3D White Dice */}
          <g transform="translate(142, 92) rotate(14)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))">
            <rect x="0" y="0" width="34" height="34" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3.2" fill="#dc2626" /><circle cx="24" cy="24" r="3.2" fill="#dc2626" /><circle cx="17" cy="17" r="3.2" fill="#dc2626" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM3)" />
          <text x="100" y="166" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="15" letterSpacing="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">SNAKE &amp;</text>
          <text x="100" y="184" textAnchor="middle" fill="#38bdf8" fontWeight="900" fontSize="15" letterSpacing="1.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">LADDER</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="emerald" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={25 + c * 38} y={25 + r * 38} width={34} height={34} rx="4" fill={(r + c) % 2 === 0 ? '#1e293b' : '#0f172a'} />
          ))
        )}
        <line x1="50" y1="155" x2="135" y2="45" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="62" y1="165" x2="147" y2="55" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="56" y1="145" x2="68" y2="155" stroke="#d97706" strokeWidth="3" />
        <line x1="78" y1="117" x2="90" y2="127" stroke="#d97706" strokeWidth="3" />
        <line x1="100" y1="89" x2="112" y2="99" stroke="#d97706" strokeWidth="3" />
        <line x1="122" y1="61" x2="134" y2="71" stroke="#d97706" strokeWidth="3" />
        <path d="M 155,40 Q 120,65 140,105 Q 160,145 105,150 Q 80,152 75,170" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
        <circle cx="158" cy="38" r="5.5" fill="#059669" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🐍</span><span>LADDERS</span>
      </div>
    </CardWrapper>
  );
};

// 4. Carrom Clash
export const CarromThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="woodSurfaceM" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
            <linearGradient id="vignetteM4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="#451a03" />
          {/* Wood Board */}
          <rect x="12" y="10" width="176" height="154" rx="10" fill="url(#woodSurfaceM)" stroke="#78350f" strokeWidth="4" />
          {/* Corner Pockets */}
          <circle cx="28" cy="26" r="10" fill="#0f172a" /><circle cx="172" cy="26" r="10" fill="#0f172a" />
          <circle cx="28" cy="148" r="10" fill="#0f172a" /><circle cx="172" cy="148" r="10" fill="#0f172a" />
          {/* Baseline */}
          <line x1="50" y1="132" x2="150" y2="132" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="50" cy="132" r="6" fill="#ef4444" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="150" cy="132" r="6" fill="#ef4444" stroke="#78350f" strokeWidth="1.5" />
          {/* Center Patterns */}
          <circle cx="100" cy="80" r="34" fill="none" stroke="#78350f" strokeWidth="2.5" strokeDasharray="5,3" />
          <circle cx="100" cy="80" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          {/* Carrom Men */}
          <circle cx="100" cy="80" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.5))" />{/* Queen */}
          <circle cx="89" cy="74" r="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="111" cy="74" r="6" fill="#1e293b" stroke="#000" strokeWidth="1" />
          <circle cx="100" cy="93" r="6" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="100" cy="67" r="6" fill="#1e293b" stroke="#000" strokeWidth="1" />
          {/* Striker */}
          <circle cx="92" cy="132" r="9" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2.5" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.6))" />
          <circle cx="92" cy="132" r="3.5" fill="#ef4444" />
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM4)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="23" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">CARROM</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#fed7aa" stroke="#78350f" strokeWidth="8" />
        <circle cx="34" cy="34" r="10" fill="#0f172a" /><circle cx="166" cy="34" r="10" fill="#0f172a" />
        <circle cx="34" cy="166" r="10" fill="#0f172a" /><circle cx="166" cy="166" r="10" fill="#0f172a" />
        <circle cx="100" cy="100" r="32" fill="none" stroke="#9a3412" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="100" cy="100" r="12" fill="#ffedd5" stroke="#c2410c" strokeWidth="2" />
        <circle cx="100" cy="100" r="5" fill="#dc2626" />
        <circle cx="94" cy="94" r="4.5" fill="#1e293b" /><circle cx="106" cy="94" r="4.5" fill="#ffffff" stroke="#94a3b8" />
        <circle cx="94" cy="106" r="4.5" fill="#ffffff" stroke="#94a3b8" /><circle cx="106" cy="106" r="4.5" fill="#1e293b" />
        <circle cx="100" cy="142" r="7.5" fill="#f8fafc" stroke="#f59e0b" strokeWidth="2" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🎯</span><span>CARROM</span>
      </div>
    </CardWrapper>
  );
};

// 5. Chess Master
export const ChessThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="chessBgM" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>
            <linearGradient id="goldKingGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" /><stop offset="50%" stopColor="#eab308" /><stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="vignetteM5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#chessBgM)" />
          {/* Checkered Tiles Perspective */}
          <g opacity="0.6">
            <rect x="25" y="25" width="38" height="38" fill="#475569" /><rect x="63" y="25" width="38" height="38" fill="#1e293b" />
            <rect x="101" y="25" width="38" height="38" fill="#475569" /><rect x="139" y="25" width="38" height="38" fill="#1e293b" />
            <rect x="25" y="63" width="38" height="38" fill="#1e293b" /><rect x="63" y="63" width="38" height="38" fill="#475569" />
            <rect x="101" y="63" width="38" height="38" fill="#1e293b" /><rect x="139" y="63" width="38" height="38" fill="#475569" />
            <rect x="25" y="101" width="38" height="38" fill="#475569" /><rect x="63" y="101" width="38" height="38" fill="#1e293b" />
            <rect x="101" y="101" width="38" height="38" fill="#475569" /><rect x="139" y="101" width="38" height="38" fill="#1e293b" />
          </g>
          {/* Golden King Piece */}
          <g transform="translate(100, 75)" filter="drop-shadow(0 6px 8px rgba(0,0,0,0.9))">
            {/* Cross */}
            <line x1="0" y1="-38" x2="0" y2="-26" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
            <line x1="-5" y1="-32" x2="5" y2="-32" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
            {/* Crown Head */}
            <circle cx="0" cy="-20" r="7" fill="url(#goldKingGrad)" stroke="#fef08a" strokeWidth="1" />
            {/* Body */}
            <path d="M -10,-12 Q -18,10 -15,22 L 15,22 Q 18,10 10,-12 Z" fill="url(#goldKingGrad)" stroke="#ca8a04" strokeWidth="1" />
            {/* Base */}
            <rect x="-22" y="22" width="44" height="9" rx="3" fill="url(#goldKingGrad)" stroke="#78350f" strokeWidth="1" />
          </g>
          {/* Black Queen & Knight Flanking */}
          <g transform="translate(58, 88)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))">
            <circle cx="0" cy="-14" r="5.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
            <path d="M -8,-6 Q -12,12 -10,18 L 10,18 Q 12,12 8,-6 Z" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <rect x="-14" y="18" width="28" height="7" rx="2" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          </g>
          <g transform="translate(142, 88)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))">
            <circle cx="0" cy="-14" r="5.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M -8,-6 Q -12,12 -10,18 L 10,18 Q 12,12 8,-6 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="-14" y="18" width="28" height="7" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM5)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="23" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">CHESS</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="indigo" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2.5" />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={25 + c * 38} y={25 + r * 38} width={38} height={38} fill={(r + c) % 2 === 0 ? '#334155' : '#0f172a'} />
          ))
        )}
        <g transform="translate(82, 60)">
          <path d="M 18,12 L 18,18 L 8,36 L 28,36 L 18,18 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="18" cy="10" r="5" fill="#ffffff" />
          <rect x="4" y="36" width="28" height="6" rx="2" fill="#ffffff" />
        </g>
        <g transform="translate(110, 95)">
          <circle cx="10" cy="8" r="4" fill="#6366f1" />
          <path d="M 10,12 L 5,26 L 15,26 Z" fill="#6366f1" />
          <rect x="3" y="26" width="14" height="4" rx="1" fill="#6366f1" />
        </g>
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>♟️</span><span>CHESS</span>
      </div>
    </CardWrapper>
  );
};

// 6. Checkers Pro
export const CheckersThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="checkersBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#2b0606" />
            </radialGradient>
            <linearGradient id="vignetteM6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#checkersBgM)" />
          {/* Checkered Grid */}
          <g opacity="0.4">
            <rect x="25" y="25" width="38" height="38" fill="#000" /><rect x="63" y="25" width="38" height="38" fill="#7f1d1d" />
            <rect x="101" y="25" width="38" height="38" fill="#000" /><rect x="139" y="25" width="38" height="38" fill="#7f1d1d" />
            <rect x="25" y="63" width="38" height="38" fill="#7f1d1d" /><rect x="63" y="63" width="38" height="38" fill="#000" />
            <rect x="101" y="63" width="38" height="38" fill="#7f1d1d" /><rect x="139" y="63" width="38" height="38" fill="#000" />
            <rect x="25" y="101" width="38" height="38" fill="#000" /><rect x="63" y="101" width="38" height="38" fill="#7f1d1d" />
            <rect x="101" y="101" width="38" height="38" fill="#000" /><rect x="139" y="101" width="38" height="38" fill="#7f1d1d" />
          </g>
          {/* Crowned Checkers Pieces */}
          <circle cx="82" cy="70" r="22" fill="#ef4444" stroke="#fca5a5" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))" />
          <circle cx="82" cy="70" r="14" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
          <polygon points="76,73 88,73 90,66 85,68 82,63 79,68 74,66" fill="#fef08a" />
          <circle cx="125" cy="98" r="20" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))" />
          <circle cx="125" cy="98" r="13" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
          <polygon points="120,101 130,101 132,95 128,97 125,93 122,97 118,95" fill="#f59e0b" />
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM6)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="20" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">CHECKERS</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="rose" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2.5" />
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={25 + c * 38} y={25 + r * 38} width={38} height={38} fill={(r + c) % 2 === 0 ? '#1e293b' : '#334155'} />
          ))
        )}
        <circle cx="63" cy="63" r="13" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
        <circle cx="139" cy="63" r="13" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
        <circle cx="101" cy="101" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="63" cy="139" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="139" cy="139" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🔴</span><span>CHECKERS</span>
      </div>
    </CardWrapper>
  );
};

// 7. 8 Ball Pool
export const PoolThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="poolBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <radialGradient id="ball8Grad" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            <linearGradient id="vignetteM7" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#poolBgM)" />
          {/* Background Balls */}
          <circle cx="48" cy="62" r="22" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" opacity="0.85" />
          <circle cx="152" cy="62" r="22" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" opacity="0.85" />
          {/* Giant Glossy 8-Ball */}
          <g filter="drop-shadow(0 8px 12px rgba(0,0,0,0.9))">
            <circle cx="100" cy="80" r="46" fill="url(#ball8Grad)" stroke="#334155" strokeWidth="2" />
            {/* Specular curved highlight */}
            <ellipse cx="88" cy="55" rx="16" ry="8" fill="#ffffff" opacity="0.35" transform="rotate(-25 88 55)" />
            {/* White circle and 8 */}
            <circle cx="100" cy="80" r="20" fill="#ffffff" />
            <text x="100" y="88" textAnchor="middle" fill="#000000" fontWeight="900" fontSize="24" fontFamily="sans-serif">8</text>
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM7)" />
          <text x="100" y="166" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="16" letterSpacing="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">8 BALL</text>
          <text x="100" y="184" textAnchor="middle" fill="#60a5fa" fontWeight="900" fontSize="16" letterSpacing="1.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">POOL</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="emerald" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="25" width="170" height="150" rx="16" fill="#064e3b" stroke="#78350f" strokeWidth="7" />
        <circle cx="28" cy="38" r="8" fill="#022c22" /><circle cx="100" cy="36" r="7" fill="#022c22" /><circle cx="172" cy="38" r="8" fill="#022c22" />
        <circle cx="28" cy="162" r="8" fill="#022c22" /><circle cx="100" cy="164" r="7" fill="#022c22" /><circle cx="172" cy="162" r="8" fill="#022c22" />
        <circle cx="80" cy="100" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="120" cy="100" r="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <circle cx="120" cy="100" r="6" fill="#ffffff" />
        <text x="120" y="103" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0f172a">8</text>
        <line x1="45" y1="140" x2="72" y2="108" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🎱</span><span>POOL</span>
      </div>
    </CardWrapper>
  );
};

// 8. Archery World
export const ArcheryThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="archeryBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
            <linearGradient id="vignetteM8" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#archeryBgM)" />
          {/* Target Rings */}
          <g filter="drop-shadow(0 6px 10px rgba(0,0,0,0.8))">
            <circle cx="100" cy="78" r="54" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="100" cy="78" r="44" fill="#0f172a" />
            <circle cx="100" cy="78" r="33" fill="#0284c7" />
            <circle cx="100" cy="78" r="22" fill="#dc2626" />
            <circle cx="100" cy="78" r="11" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
            <circle cx="100" cy="78" r="2.5" fill="#78350f" />
          </g>
          {/* Incoming Arrow */}
          <g transform="translate(100, 78) rotate(-35)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))">
            <line x1="-50" y1="0" x2="4" y2="0" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="5,-3 12,0 5,3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <line x1="-50" y1="0" x2="-62" y2="-6" stroke="#ef4444" strokeWidth="3" />
            <line x1="-50" y1="0" x2="-62" y2="6" stroke="#ef4444" strokeWidth="3" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM8)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="21" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">ARCHERY</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="120" cy="80" r="50" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="120" cy="80" r="40" fill="#0f172a" />
        <circle cx="120" cy="80" r="30" fill="#38bdf8" />
        <circle cx="120" cy="80" r="20" fill="#ef4444" />
        <circle cx="120" cy="80" r="10" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
        <line x1="30" y1="170" x2="114" y2="86" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
        <polygon points="112,82 120,80 118,88" fill="#f59e0b" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🏹</span><span>ARCHERY</span>
      </div>
    </CardWrapper>
  );
};

// 9. Knife Rain
export const KnifeTargetThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <div className="relative w-full h-full flex flex-col items-center justify-between p-1.5 overflow-hidden bg-gradient-to-b from-[#2a0e05] via-[#1a0803] to-[#0a0301]">
          <div className="absolute inset-0 bg-radial from-amber-500/25 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center mt-1">
            <img src={knifeLogo} alt="Knife Rain" className="w-16 h-auto object-contain drop-shadow-md" />
            <div className="flex items-center gap-2 mt-1">
              <img src={knifeDefault} alt="" className="w-3 h-10 object-contain -rotate-12 drop-shadow" />
              <img src={appleImg} alt="" className="w-5 h-6 object-contain drop-shadow" />
            </div>
          </div>
          <div className="relative z-10 w-full text-center pb-0.5">
            <span className="text-[13px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] tracking-wider">
              KNIFE RAIN
            </span>
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <img
          src={knifeLogo}
          alt="Knife Rain"
          className="w-28 sm:w-32 h-auto object-contain filter drop-shadow-lg mb-1 group-hover:scale-105 transition-transform"
        />
        <div className="flex items-center gap-1.5">
          <img src={knifeDefault} alt="" className="w-4 h-11 object-contain -rotate-12 drop-shadow" />
          <img src={appleImg} alt="" className="w-5 h-6 object-contain drop-shadow" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🗡️</span><span>KNIFE RAIN</span>
      </div>
    </CardWrapper>
  );
};

// 10. Memory Match
export const MemoryMatchThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="memBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#1e053a" />
            </radialGradient>
            <linearGradient id="vignetteM10" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#memBgM)" />
          {/* 4 Memory Cards */}
          <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))">
            <rect x="30" y="24" width="62" height="56" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <polygon points="61,40 73,52 61,64 49,52" fill="#38bdf8" />
            <rect x="108" y="24" width="62" height="56" rx="8" fill="#311042" stroke="#d946ef" strokeWidth="2" />
            <text x="139" y="60" textAnchor="middle" fill="#f472b6" fontWeight="900" fontSize="24">?</text>
            <rect x="30" y="90" width="62" height="56" rx="8" fill="#311042" stroke="#d946ef" strokeWidth="2" />
            <text x="61" y="126" textAnchor="middle" fill="#f472b6" fontWeight="900" fontSize="24">?</text>
            <rect x="108" y="90" width="62" height="56" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
            <polygon points="139,106 151,118 139,130 127,118" fill="#38bdf8" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM10)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="20" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">MEMORY</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="indigo" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="30" y="30" width="60" height="60" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
        <polygon points="60,45 72,60 60,75 48,60" fill="#38bdf8" />
        <rect x="110" y="30" width="60" height="60" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
        <text x="140" y="70" fontSize="26" fontWeight="bold" fill="#818cf8" textAnchor="middle">?</text>
        <rect x="30" y="110" width="60" height="60" rx="8" fill="#1e1b4b" stroke="#4338ca" strokeWidth="1.5" />
        <text x="60" y="150" fontSize="26" fontWeight="bold" fill="#818cf8" textAnchor="middle">?</text>
        <rect x="110" y="110" width="60" height="60" rx="8" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
        <polygon points="140,125 152,140 140,155 128,140" fill="#38bdf8" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🧠</span><span>MEMORY</span>
      </div>
    </CardWrapper>
  );
};

// 11. Speed Sudoku
export const SudokuThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="sudokuBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#021a36" />
            </radialGradient>
            <linearGradient id="vignetteM11" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#sudokuBgM)" />
          {/* Grid Box */}
          <rect x="25" y="18" width="150" height="135" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
          <line x1="75" y1="18" x2="75" y2="153" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="125" y1="18" x2="125" y2="153" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="25" y1="63" x2="175" y2="63" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="25" y1="108" x2="175" y2="108" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Numbers */}
          <text x="50" y="52" textAnchor="middle" fill="#facc15" fontWeight="900" fontSize="26">5</text>
          <text x="100" y="52" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="26">3</text>
          <text x="150" y="97" textAnchor="middle" fill="#facc15" fontWeight="900" fontSize="26">9</text>
          <text x="50" y="142" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="26">7</text>
          <text x="100" y="142" textAnchor="middle" fill="#38bdf8" fontWeight="900" fontSize="26">1</text>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM11)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="21" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">SUDOKU</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="cyan" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="25" y="25" width="150" height="150" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1="75" y1="25" x2="75" y2="175" stroke="#38bdf8" strokeWidth="2" />
        <line x1="125" y1="25" x2="125" y2="175" stroke="#38bdf8" strokeWidth="2" />
        <line x1="25" y1="75" x2="175" y2="75" stroke="#38bdf8" strokeWidth="2" />
        <line x1="25" y1="125" x2="175" y2="125" stroke="#38bdf8" strokeWidth="2" />
        <text x="50" y="60" fontSize="20" fontWeight="bold" fill="#facc15" textAnchor="middle">5</text>
        <text x="100" y="60" fontSize="20" fontWeight="bold" fill="#94a3b8" textAnchor="middle">3</text>
        <text x="150" y="110" fontSize="20" fontWeight="bold" fill="#facc15" textAnchor="middle">9</text>
        <text x="50" y="160" fontSize="20" fontWeight="bold" fill="#94a3b8" textAnchor="middle">7</text>
        <text x="100" y="160" fontSize="20" fontWeight="bold" fill="#38bdf8" textAnchor="middle">1</text>
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🔢</span><span>SUDOKU</span>
      </div>
    </CardWrapper>
  );
};

// 12. Minesweeper Blitz
export const MinesThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="minesBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#1a0729" />
            </radialGradient>
            <linearGradient id="vignetteM12" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#minesBgM)" />
          {/* Grid with Gems & Bomb */}
          <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))">
            <rect x="25" y="24" width="44" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <polygon points="47,32 55,44 47,56 39,44" fill="#34d399" />
            <rect x="78" y="24" width="44" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="131" y="24" width="44" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <polygon points="153,32 161,44 153,56 145,44" fill="#38bdf8" />
            <rect x="25" y="72" width="44" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="78" y="72" width="44" height="40" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
            <circle cx="100" cy="92" r="11" fill="#000000" />
            <line x1="100" y1="78" x2="100" y2="106" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="86" y1="92" x2="114" y2="92" stroke="#ef4444" strokeWidth="2.5" />
            <rect x="131" y="72" width="44" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="25" y="120" width="44" height="30" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <polygon points="47,126 55,135 47,144 39,135" fill="#34d399" />
            <rect x="78" y="120" width="44" height="30" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <rect x="131" y="120" width="44" height="30" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
            <polygon points="153,126 161,135 153,144 145,135" fill="#f43f5e" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM12)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="22" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">MINES</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="rose" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 3 }).map((__, c) => (
            <rect key={`${r}-${c}`} x={35 + c * 46} y={35 + r * 46} width={38} height={38} rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
          ))
        )}
        <circle cx="54" cy="54" r="9" fill="#10b981" />
        <circle cx="146" cy="54" r="9" fill="#10b981" />
        <circle cx="100" cy="100" r="10" fill="#ef4444" />
        <line x1="100" y1="86" x2="100" y2="114" stroke="#ef4444" strokeWidth="2.5" />
        <line x1="86" y1="100" x2="114" y2="100" stroke="#ef4444" strokeWidth="2.5" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>💣</span><span>MINES</span>
      </div>
    </CardWrapper>
  );
};

// 13. Bubble Shooter
export const BubbleShooterThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="bubbleBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>
            <radialGradient id="bCyan" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#67e8f9" /><stop offset="100%" stopColor="#0891b2" /></radialGradient>
            <radialGradient id="bMag" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#db2777" /></radialGradient>
            <radialGradient id="bYel" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#fef08a" /><stop offset="100%" stopColor="#d97706" /></radialGradient>
            <radialGradient id="bGrn" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#86efac" /><stop offset="100%" stopColor="#16a34a" /></radialGradient>
            <linearGradient id="vignetteM13" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#bubbleBgM)" />
          {/* Glossy Rainbow Bubbles */}
          <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))">
            <circle cx="50" cy="38" r="16" fill="url(#bMag)" /><circle cx="50" cy="38" r="16" fill="none" stroke="#fbcfe8" strokeWidth="1" />
            <circle cx="84" cy="38" r="16" fill="url(#bYel)" /><circle cx="84" cy="38" r="16" fill="none" stroke="#fef9c3" strokeWidth="1" />
            <circle cx="118" cy="38" r="16" fill="url(#bCyan)" /><circle cx="118" cy="38" r="16" fill="none" stroke="#cffafe" strokeWidth="1" />
            <circle cx="152" cy="38" r="16" fill="url(#bGrn)" /><circle cx="152" cy="38" r="16" fill="none" stroke="#dcfce7" strokeWidth="1" />
            <circle cx="67" cy="68" r="16" fill="url(#bCyan)" />
            <circle cx="101" cy="68" r="16" fill="url(#bMag)" />
            <circle cx="135" cy="68" r="16" fill="url(#bYel)" />
            <circle cx="84" cy="98" r="16" fill="url(#bGrn)" />
            <circle cx="118" cy="98" r="16" fill="url(#bCyan)" />
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM13)" />
          <text x="100" y="166" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="15" letterSpacing="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">BUBBLE</text>
          <text x="100" y="184" textAnchor="middle" fill="#38bdf8" fontWeight="900" fontSize="15" letterSpacing="1.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">SHOOTER</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="cyan" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="58" cy="45" r="14" fill="#38bdf8" /><circle cx="86" cy="45" r="14" fill="#ef4444" />
        <circle cx="114" cy="45" r="14" fill="#facc15" /><circle cx="142" cy="45" r="14" fill="#10b981" />
        <circle cx="72" cy="70" r="14" fill="#a855f7" /><circle cx="100" cy="70" r="14" fill="#38bdf8" />
        <circle cx="128" cy="70" r="14" fill="#ef4444" />
        <circle cx="100" cy="155" r="13" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
        <line x1="100" y1="140" x2="100" y2="90" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🫧</span><span>BUBBLES</span>
      </div>
    </CardWrapper>
  );
};

// 14. Fruit Slice Blitz
export const FruitSliceThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="fruitBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#052e16" />
            </radialGradient>
            <linearGradient id="vignetteM14" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#fruitBgM)" />
          {/* Watermelon Sliced */}
          <g transform="translate(100, 78) rotate(-15)" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.8))">
            <path d="M -60,0 A 60,60 0 0,0 60,0 Z" fill="#15803d" stroke="#166534" strokeWidth="3" />
            <path d="M -54,0 A 54,54 0 0,0 54,0 Z" fill="#fef08a" />
            <path d="M -48,0 A 48,48 0 0,0 48,0 Z" fill="#ef4444" />
            <circle cx="-25" cy="20" r="3" fill="#000" /><circle cx="0" cy="28" r="3" fill="#000" /><circle cx="25" cy="20" r="3" fill="#000" />
            <circle cx="-12" cy="12" r="2.5" fill="#000" /><circle cx="12" cy="12" r="2.5" fill="#000" />
          </g>
          {/* Katana Slash Light Trail */}
          <line x1="20" y1="115" x2="180" y2="40" stroke="#fde047" strokeWidth="4.5" strokeLinecap="round" filter="drop-shadow(0 0 8px #f59e0b)" />
          {/* Splash Particles */}
          <circle cx="65" cy="70" r="3.5" fill="#ef4444" /><circle cx="135" cy="85" r="4" fill="#ef4444" /><circle cx="100" cy="45" r="3" fill="#fde047" />
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM14)" />
          <text x="100" y="166" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="16" letterSpacing="1" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">FRUIT</text>
          <text x="100" y="184" textAnchor="middle" fill="#4ade80" fontWeight="900" fontSize="16" letterSpacing="1.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.95))">SLICE</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="45" fill="#ef4444" stroke="#22c55e" strokeWidth="6" />
        <circle cx="90" cy="90" r="3.5" fill="#000000" /><circle cx="110" cy="90" r="3.5" fill="#000000" /><circle cx="100" cy="110" r="3.5" fill="#000000" />
        <line x1="40" y1="160" x2="160" y2="40" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🍉</span><span>FRUIT SLICE</span>
      </div>
    </CardWrapper>
  );
};

// 15. Connect Four
export const ConnectFourThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="c4BgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#081438" />
            </radialGradient>
            <linearGradient id="vignetteM15" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#c4BgM)" />
          {/* Blue Board Grid */}
          <rect x="22" y="24" width="156" height="126" rx="12" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="3" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.8))" />
          {/* Slots with Discs */}
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 4 }).map((__, c) => {
              const fill = (r === 2 && (c === 1 || c === 2)) ? '#eab308' : (r === 1 && c === 2) ? '#ef4444' : '#0f172a';
              return (
                <circle key={`${r}-${c}`} cx={45 + c * 36} cy={45 + r * 38} r="13" fill={fill} stroke="#1e3a8a" strokeWidth="2" />
              );
            })
          )}
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM15)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="19" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">CONNECT 4</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="indigo" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <rect x="30" y="40" width="140" height="120" rx="10" fill="#1e3a8a" stroke="#2563eb" strokeWidth="2" />
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={50 + c * 33} cy={60 + r * 35} r="11" fill={(r === 2 && c === 1) || (r === 1 && c === 2) ? '#ef4444' : (r === 2 && c === 2) ? '#facc15' : '#0f172a'} />
          ))
        )}
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🔵</span><span>CONNECT 4</span>
      </div>
    </CardWrapper>
  );
};

// 16. Rock Paper Scissors
export const RPSThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="rpsBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="100%" stopColor="#1e1003" />
            </radialGradient>
            <linearGradient id="vignetteM16" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#rpsBgM)" />
          {/* 3 Circular Badges in Triangle */}
          <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.8))">
            <circle cx="70" cy="52" r="22" fill="#78350f" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="70" y="60" textAnchor="middle" fontSize="22">✊</text>
            <circle cx="130" cy="52" r="22" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="130" y="60" textAnchor="middle" fontSize="22">✋</text>
            <circle cx="100" cy="104" r="24" fill="#991b1b" stroke="#ef4444" strokeWidth="3" />
            <text x="100" y="112" textAnchor="middle" fontSize="24">✌️</text>
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM16)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="19" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">RPS CLASH</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="amber" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <rect x="15" y="15" width="170" height="170" rx="14" fill="#090d16" stroke="#1e293b" strokeWidth="2.5" />
        <circle cx="70" cy="70" r="20" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
        <text x="70" y="78" fontSize="20" textAnchor="middle">✊</text>
        <circle cx="130" cy="70" r="20" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
        <text x="130" y="78" fontSize="20" textAnchor="middle">✋</text>
        <circle cx="100" cy="130" r="22" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
        <text x="100" y="139" fontSize="22" textAnchor="middle">✌️</text>
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>✊</span><span>RPS</span>
      </div>
    </CardWrapper>
  );
};

// 17. Indian Rummy (RummyCircle Classic)
export const RummyThumbnail = ({ compact = false }) => {
  if (compact) {
    return (
      <CardWrapper compact={true}>
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="rummyBgM" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </radialGradient>
            <linearGradient id="vignetteM17" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" /><stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#rummyBgM)" />
          {/* Oval Felt Ring */}
          <ellipse cx="100" cy="78" rx="85" ry="58" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" opacity="0.6" />
          {/* Fanned Cards */}
          <g filter="drop-shadow(0 6px 10px rgba(0,0,0,0.8))">
            <g transform="translate(46, 52) rotate(-20)">
              <rect x="0" y="0" width="38" height="58" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="5" y="14" fontSize="11" fontWeight="900" fill="#0f172a">A</text>
              <text x="5" y="25" fontSize="11" fill="#0f172a">♠</text>
              <text x="14" y="38" fontSize="18" fill="#0f172a">♠</text>
            </g>
            <g transform="translate(68, 44) rotate(-7)">
              <rect x="0" y="0" width="38" height="58" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="5" y="14" fontSize="11" fontWeight="900" fill="#dc2626">K</text>
              <text x="5" y="25" fontSize="11" fill="#dc2626">♥</text>
              <text x="14" y="38" fontSize="18" fill="#dc2626">♥</text>
            </g>
            <g transform="translate(92, 44) rotate(7)">
              <rect x="0" y="0" width="38" height="58" rx="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="5" y="14" fontSize="11" fontWeight="900" fill="#0f172a">Q</text>
              <text x="5" y="25" fontSize="11" fill="#0f172a">♣</text>
              <text x="14" y="38" fontSize="18" fill="#0f172a">♣</text>
            </g>
            <g transform="translate(116, 52) rotate(20)">
              <rect x="0" y="0" width="38" height="58" rx="5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
              <text x="5" y="14" fontSize="11" fontWeight="900" fill="#dc2626">J</text>
              <text x="5" y="25" fontSize="11" fill="#dc2626">♦</text>
              <circle cx="28" cy="11" r="6" fill="#f59e0b" />
              <text x="25" y="14" fontSize="9" fontWeight="900" fill="#000">★</text>
              <text x="14" y="38" fontSize="18" fill="#dc2626">♦</text>
            </g>
          </g>
          {/* Bottom Title */}
          <rect y="125" width="200" height="75" fill="url(#vignetteM17)" />
          <text x="100" y="180" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="23" letterSpacing="1.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))">RUMMY</text>
        </svg>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper glowColor="emerald" compact={false}>
      <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-xl">
        <defs>
          <radialGradient id="feltGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0a5c32" />
            <stop offset="100%" stopColor="#042a16" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="90" ry="70" fill="url(#feltGrad)" stroke="#d97706" strokeWidth="3" />
        <ellipse cx="100" cy="100" rx="84" ry="64" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
        <g transform="translate(60, 65) rotate(-18)">
          <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="4" y="14" fontSize="10" fontWeight="900" fill="#0f172a">10</text>
          <text x="4" y="24" fontSize="10" fill="#0f172a">♠</text>
          <text x="14" y="36" fontSize="16" fill="#0f172a">♠</text>
        </g>
        <g transform="translate(75, 58) rotate(-6)">
          <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="4" y="14" fontSize="11" fontWeight="900" fill="#0f172a">J</text>
          <text x="4" y="24" fontSize="10" fill="#0f172a">♠</text>
          <text x="14" y="36" fontSize="16" fill="#0f172a">♠</text>
        </g>
        <g transform="translate(92, 58) rotate(8)">
          <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="4" y="14" fontSize="11" fontWeight="900" fill="#dc2626">Q</text>
          <text x="4" y="24" fontSize="10" fill="#dc2626">♥</text>
          <text x="14" y="36" fontSize="16" fill="#dc2626">♥</text>
        </g>
        <g transform="translate(108, 65) rotate(22)">
          <rect x="0" y="0" width="38" height="56" rx="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
          <text x="4" y="14" fontSize="11" fontWeight="900" fill="#dc2626">K</text>
          <text x="4" y="24" fontSize="10" fill="#dc2626">♥</text>
          <text x="14" y="36" fontSize="16" fill="#dc2626">♥</text>
          <circle cx="28" cy="10" r="6" fill="#f59e0b" />
          <text x="25" y="13" fontSize="8" fontWeight="900" fill="#000">★</text>
        </g>
        <rect x="62" y="128" width="76" height="18" rx="9" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
        <text x="100" y="140" fontSize="9" fontWeight="900" fill="#6ee7b7" textAnchor="middle" letterSpacing="1">PURE SEC ✓</text>
      </svg>
      <div className="absolute bottom-2 right-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
        <span>🎴</span><span>RUMMY</span>
      </div>
    </CardWrapper>
  );
};
