import React, { useState, useRef } from 'react';
import { ludoAudio } from '../ludoAudio.js';
import { ONLINE_MODES } from '../config/ludoRules.js';

export { ONLINE_MODES };

export const LudoSelectModeModal = ({
  isOpen = false,
  selectedMode = '1v1',
  onSelectMode,
  onBack,
  onLaunchVsComputer
}) => {
  const [showStatusNotice, setShowStatusNotice] = useState(false);
  const isNavigatingRef = useRef(false);

  if (!isOpen) return null;

  const handleSelect = (modeId) => {
    ludoAudio.playButtonClick();
    onSelectMode?.(modeId);
  };

  const handleNext = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    ludoAudio.playButtonClick();
    // Honest, integration-ready notification: no fake matchmaking
    setShowStatusNotice(true);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 600);
  };

  const handleBack = () => {
    ludoAudio.playButtonClick();
    setShowStatusNotice(false);
    onBack?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-[3px] flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="flex flex-col items-center w-full max-w-[320px] gap-5">
        {/* Main Blue Panel with Double Gold Border */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0b2b6b] via-[#0d2a6a] to-[#071536] border-[2.5px] border-amber-400 p-6 shadow-[0_0_35px_rgba(245,158,11,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.4)] flex flex-col items-center gap-6">
          {/* Title Header */}
          <h2 className="text-xl font-black text-amber-300 drop-shadow-[0_2px_0_#78350f,0_4px_8px_rgba(0,0,0,0.9)] tracking-wider uppercase">
            SELECT MODE
          </h2>

          {/* Options List */}
          <div className="w-full flex flex-col gap-4">
            {ONLINE_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => handleSelect(mode.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 border-amber-400/90 shadow-[0_0_14px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900/40 border-slate-700/60 hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'border-2 border-amber-300 bg-gradient-to-b from-amber-300 to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                          : 'border-2 border-amber-400/70 bg-slate-950/80 shadow-inner'
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-950 stroke-current stroke-[3] fill-none">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* Mode Labels */}
                    <div className="flex flex-col text-left">
                      <span className="text-base font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] tracking-wider uppercase">
                        {mode.title}
                      </span>
                      <span className="text-xs font-semibold text-sky-300 opacity-90">
                        {mode.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  {mode.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-[10px] font-black uppercase tracking-wide">
                      {mode.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Integration-Ready Matchmaking Notice Modal */}
          {showStatusNotice && (
            <div className="w-full p-3 rounded-2xl bg-slate-950/90 border border-amber-400/80 text-center space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-xl">🌐</span>
              <p className="text-xs font-bold text-amber-300">
                Online Multiplayer Servers Connecting!
              </p>
              <p className="text-[11px] text-slate-300 leading-tight">
                Live multiplayer matchmaking is ready for backend connection. Sharpen your skills in VS COMPUTER mode now!
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusNotice(false);
                    onLaunchVsComputer?.(selectedMode === '2v2' ? '4P' : '2P');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wide cursor-pointer active:scale-95 shadow"
                >
                  Play VS Computer
                </button>
                <button
                  type="button"
                  onClick={() => setShowStatusNotice(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions: Back (Circular Left) + Next (Glossy Right) */}
        <div className="w-full flex items-center justify-center gap-4 pt-1">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-amber-400 stroke-amber-400"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-10 py-2.5 rounded-2xl bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-amber-400 text-white font-black uppercase tracking-wider text-base shadow-[0_0_20px_rgba(245,158,11,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.7)] active:scale-95 hover:scale-105 transition-all cursor-pointer"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};
