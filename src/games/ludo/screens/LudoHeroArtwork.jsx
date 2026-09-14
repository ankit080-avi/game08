import React from 'react';

export const LudoHeroArtwork = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Ambient Golden Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top "LUDO" 3D Title Letters & Crown */}
      <div className="relative z-20 flex flex-col items-center mb-1">
        {/* Golden Royal Crown above 'L' */}
        <div className="relative w-full flex items-center justify-between px-5 -mb-2.5 z-30">
          <div className="relative -rotate-12 translate-x-2 -translate-y-1 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]">
            <svg viewBox="0 0 64 48" className="w-11 h-8 fill-none">
              <defs>
                <linearGradient id="crown-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <filter id="crown-shadow">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000" floodOpacity="0.8" />
                </filter>
              </defs>
              <path
                d="M 6,36 L 58,36 L 54,16 L 40,26 L 32,8 L 24,26 L 10,16 Z"
                fill="url(#crown-grad)"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinejoin="round"
                filter="url(#crown-shadow)"
              />
              <rect x="8" y="36" width="48" height="6" rx="2" fill="url(#crown-grad)" stroke="#78350f" strokeWidth="2" />
              <circle cx="32" cy="8" r="3" fill="#ef4444" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="10" cy="16" r="2.5" fill="#3b82f6" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="54" cy="16" r="2.5" fill="#10b981" stroke="#78350f" strokeWidth="1.5" />
              <circle cx="20" cy="39" r="1.5" fill="#ffffff" />
              <circle cx="32" cy="39" r="1.5" fill="#ffffff" />
              <circle cx="44" cy="39" r="1.5" fill="#ffffff" />
            </svg>
          </div>

          <span className="text-[10px] font-black tracking-widest text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase pr-3 font-serif">
            CLASSIC
          </span>
        </div>

        {/* 3D Glossy "L U D O" Letters */}
        <div className="flex items-center gap-1.5 drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)]">
          {/* L - Sky Blue */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-[2.5px] border-white/95 flex items-center justify-center shadow-[0_4px_0_#075985,0_8px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <span className="text-2xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tighter">
              L
            </span>
            <div className="absolute top-1 left-1.5 right-1.5 h-3 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl pointer-events-none" />
          </div>

          {/* U - Ruby Red */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#f87171] via-[#dc2626] to-[#991b1b] border-[2.5px] border-white/95 flex items-center justify-center shadow-[0_4px_0_#7f1d1d,0_8px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <span className="text-2xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tighter">
              U
            </span>
            <div className="absolute top-1 left-1.5 right-1.5 h-3 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl pointer-events-none" />
          </div>

          {/* D - Emerald Green */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#166534] border-[2.5px] border-white/95 flex items-center justify-center shadow-[0_4px_0_#14532d,0_8px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <span className="text-2xl font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] tracking-tighter">
              D
            </span>
            <div className="absolute top-1 left-1.5 right-1.5 h-3 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl pointer-events-none" />
          </div>

          {/* O - Sunburst Yellow */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#ca8a04] border-[2.5px] border-white/95 flex items-center justify-center shadow-[0_4px_0_#854d0e,0_8px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.9)]">
            <span className="text-2xl font-black text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] tracking-tighter">
              O
            </span>
            <div className="absolute top-1 left-1.5 right-1.5 h-3 bg-gradient-to-b from-white/95 to-transparent rounded-t-xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Central 3D Isometric Ludo Board with Pawns & Dice */}
      <div className="relative w-68 h-40 flex items-center justify-center mt-0.5">
        <div className="absolute bottom-2 w-52 h-12 bg-slate-950/70 rounded-full blur-md pointer-events-none" />

        <div
          className="relative w-48 h-30 rounded-xl border-2 border-amber-400/90 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_3px_rgba(255,255,255,0.4)] overflow-hidden bg-slate-900"
          style={{
            transform: 'perspective(480px) rotateX(28deg) rotateZ(-1deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-1 gap-1 bg-[#0a1435]">
            <div className="rounded-md bg-gradient-to-br from-red-600 to-red-800 border border-red-400/60 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded bg-white/90 grid grid-cols-2 p-0.5 gap-0.5 shadow-inner">
                <div className="rounded-full bg-red-600 shadow-sm" />
                <div className="rounded-full bg-red-600 shadow-sm" />
                <div className="rounded-full bg-red-600 shadow-sm" />
                <div className="rounded-full bg-red-600 shadow-sm" />
              </div>
            </div>

            <div className="rounded-md bg-gradient-to-br from-emerald-600 to-emerald-800 border border-emerald-400/60 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded bg-white/90 grid grid-cols-2 p-0.5 gap-0.5 shadow-inner">
                <div className="rounded-full bg-emerald-600 shadow-sm" />
                <div className="rounded-full bg-emerald-600 shadow-sm" />
                <div className="rounded-full bg-emerald-600 shadow-sm" />
                <div className="rounded-full bg-emerald-600 shadow-sm" />
              </div>
            </div>

            <div className="rounded-md bg-gradient-to-br from-sky-600 to-sky-800 border border-sky-400/60 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded bg-white/90 grid grid-cols-2 p-0.5 gap-0.5 shadow-inner">
                <div className="rounded-full bg-sky-600 shadow-sm" />
                <div className="rounded-full bg-sky-600 shadow-sm" />
                <div className="rounded-full bg-sky-600 shadow-sm" />
                <div className="rounded-full bg-sky-600 shadow-sm" />
              </div>
            </div>

            <div className="rounded-md bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-300/60 p-0.5 flex items-center justify-center">
              <div className="w-full h-full rounded bg-white/90 grid grid-cols-2 p-0.5 gap-0.5 shadow-inner">
                <div className="rounded-full bg-amber-500 shadow-sm" />
                <div className="rounded-full bg-amber-500 shadow-sm" />
                <div className="rounded-full bg-amber-500 shadow-sm" />
                <div className="rounded-full bg-amber-500 shadow-sm" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rotate-45 border border-amber-400/90 bg-amber-300/30 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </div>
        </div>

        {/* 4 3D Standing Gotis */}
        <div className="absolute left-2.5 bottom-2.5 z-30 drop-shadow-[0_6px_8px_rgba(0,0,0,0.85)]">
          <svg viewBox="0 0 40 60" className="w-10 h-15">
            <defs>
              <radialGradient id="goti-blue" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="40%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="14" r="10" fill="url(#goti-blue)" stroke="#082f49" strokeWidth="1.5" />
            <ellipse cx="17" cy="11" rx="4" ry="2.5" fill="#ffffff" opacity="0.65" />
            <ellipse cx="20" cy="24" rx="7" ry="2.5" fill="#38bdf8" stroke="#082f49" strokeWidth="1.2" />
            <path
              d="M 14,24 C 15,35 6,48 5,54 C 12,56 28,56 35,54 C 34,48 25,35 26,24 Z"
              fill="url(#goti-blue)"
              stroke="#082f49"
              strokeWidth="1.5"
            />
            <ellipse cx="20" cy="54" rx="15" ry="3.5" fill="#0284c7" stroke="#082f49" strokeWidth="1.5" />
            <ellipse cx="18" cy="53" rx="10" ry="1.5" fill="#ffffff" opacity="0.4" />
          </svg>
        </div>

        <div className="absolute left-14 top-1 z-20 drop-shadow-[0_5px_6px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 40 60" className="w-7 h-11">
            <defs>
              <radialGradient id="goti-red" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="40%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="14" r="10" fill="url(#goti-red)" stroke="#450a0a" strokeWidth="1.5" />
            <ellipse cx="17" cy="11" rx="4" ry="2.5" fill="#ffffff" opacity="0.6" />
            <ellipse cx="20" cy="24" rx="7" ry="2.5" fill="#f87171" stroke="#450a0a" strokeWidth="1.2" />
            <path
              d="M 14,24 C 15,35 6,48 5,54 C 12,56 28,56 35,54 C 34,48 25,35 26,24 Z"
              fill="url(#goti-red)"
              stroke="#450a0a"
              strokeWidth="1.5"
            />
            <ellipse cx="20" cy="54" rx="15" ry="3.5" fill="#dc2626" stroke="#450a0a" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="absolute right-14 top-1 z-20 drop-shadow-[0_5px_6px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 40 60" className="w-7 h-11">
            <defs>
              <radialGradient id="goti-green" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="40%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#14532d" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="14" r="10" fill="url(#goti-green)" stroke="#052e16" strokeWidth="1.5" />
            <ellipse cx="17" cy="11" rx="4" ry="2.5" fill="#ffffff" opacity="0.6" />
            <ellipse cx="20" cy="24" rx="7" ry="2.5" fill="#4ade80" stroke="#052e16" strokeWidth="1.2" />
            <path
              d="M 14,24 C 15,35 6,48 5,54 C 12,56 28,56 35,54 C 34,48 25,35 26,24 Z"
              fill="url(#goti-green)"
              stroke="#052e16"
              strokeWidth="1.5"
            />
            <ellipse cx="20" cy="54" rx="15" ry="3.5" fill="#16a34a" stroke="#052e16" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="absolute right-2.5 bottom-2.5 z-30 drop-shadow-[0_6px_8px_rgba(0,0,0,0.85)]">
          <svg viewBox="0 0 40 60" className="w-10 h-15">
            <defs>
              <radialGradient id="goti-yellow" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="14" r="10" fill="url(#goti-yellow)" stroke="#422006" strokeWidth="1.5" />
            <ellipse cx="17" cy="11" rx="4" ry="2.5" fill="#ffffff" opacity="0.75" />
            <ellipse cx="20" cy="24" rx="7" ry="2.5" fill="#fde047" stroke="#422006" strokeWidth="1.2" />
            <path
              d="M 14,24 C 15,35 6,48 5,54 C 12,56 28,56 35,54 C 34,48 25,35 26,24 Z"
              fill="url(#goti-yellow)"
              stroke="#422006"
              strokeWidth="1.5"
            />
            <ellipse cx="20" cy="54" rx="15" ry="3.5" fill="#eab308" stroke="#422006" strokeWidth="1.5" />
            <ellipse cx="18" cy="53" rx="10" ry="1.5" fill="#ffffff" opacity="0.4" />
          </svg>
        </div>

        {/* Center 3D Ivory Dice */}
        <div
          className="absolute z-25 drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)]"
          style={{
            transform: 'perspective(300px) rotateX(15deg) rotateY(-20deg) rotateZ(5deg)'
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white via-slate-100 to-slate-300 border-2 border-slate-300/90 shadow-[inset_0_2px_3px_rgba(255,255,255,1),0_4px_0_#94a3b8,0_6px_10px_rgba(0,0,0,0.4)] flex items-center justify-center p-1.5">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 m-auto" />
              <span />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 m-auto" />
              <span />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 m-auto" />
              <span />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 m-auto" />
              <span />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 m-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
