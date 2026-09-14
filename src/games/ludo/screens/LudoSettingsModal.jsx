import React, { useState } from 'react';
import { ludoAudio } from '../ludoAudio.js';

export const LudoSettingsModal = ({
  isOpen = false,
  onClose,
  soundOn = true,
  onToggleSound,
  musicOn = true,
  onToggleMusic
}) => {
  const [activeSubModal, setActiveSubModal] = useState(null); // 'privacy' | 'feedback' | null

  if (!isOpen) return null;

  const handleClose = () => {
    ludoAudio.playButtonClick();
    setActiveSubModal(null);
    onClose?.();
  };

  const handleSoundToggle = () => {
    onToggleSound?.();
  };

  const handleMusicToggle = () => {
    ludoAudio.playButtonClick();
    onToggleMusic?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-[3px] flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="flex flex-col items-center w-full max-w-[320px] gap-5">
        {/* Main Blue Settings Panel */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0b2b6b] via-[#0d2a6a] to-[#071536] border-[2.5px] border-amber-400 p-6 shadow-[0_0_35px_rgba(245,158,11,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.4)] flex flex-col items-center gap-6">
          {/* Title Header */}
          <h2 className="text-2xl font-black text-amber-300 drop-shadow-[0_2px_0_#78350f,0_4px_8px_rgba(0,0,0,0.9)] tracking-wider uppercase">
            SETTINGS
          </h2>

          {/* Controls List */}
          <div className="w-full flex flex-col gap-4">
            {/* Music Row */}
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-lg font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                Music
              </span>

              {/* Game-style Toggle Switch matching reference */}
              <button
                type="button"
                onClick={handleMusicToggle}
                className="relative w-20 h-8 rounded-full border-2 border-amber-400 overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.6)] cursor-pointer active:scale-95 transition-transform"
              >
                {musicOn ? (
                  <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-end px-1">
                    <span className="mr-auto pl-2 text-[9px] font-black text-white uppercase tracking-wider">ON</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-b from-sky-400 to-blue-700 border border-white shadow flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">On</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-red-600 to-rose-700 flex items-center justify-start px-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-b from-sky-400 to-blue-700 border border-white shadow flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">Off</span>
                    </div>
                    <span className="ml-auto pr-2 text-[9px] font-black text-white uppercase tracking-wider">OFF</span>
                  </div>
                )}
              </button>
            </div>

            {/* Sound Row */}
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-lg font-black text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                Sound
              </span>

              {/* Game-style Toggle Switch matching reference */}
              <button
                type="button"
                onClick={handleSoundToggle}
                className="relative w-20 h-8 rounded-full border-2 border-amber-400 overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.6)] cursor-pointer active:scale-95 transition-transform"
              >
                {soundOn ? (
                  <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-end px-1">
                    <span className="mr-auto pl-2 text-[9px] font-black text-white uppercase tracking-wider">ON</span>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-b from-sky-400 to-blue-700 border border-white shadow flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">On</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-red-600 to-rose-700 flex items-center justify-start px-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-b from-sky-400 to-blue-700 border border-white shadow flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">Off</span>
                    </div>
                    <span className="ml-auto pr-2 text-[9px] font-black text-white uppercase tracking-wider">OFF</span>
                  </div>
                )}
              </button>
            </div>

            {/* Privacy & Feedback Pill Buttons */}
            <div className="w-full flex items-center justify-between gap-3 pt-2">
              {/* Privacy Button */}
              <button
                type="button"
                onClick={() => {
                  ludoAudio.playButtonClick();
                  setActiveSubModal('privacy');
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_14px_rgba(245,158,11,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.7)] active:scale-95 hover:scale-105 transition-all cursor-pointer text-center"
              >
                Privacy
              </button>

              {/* Feedback Button */}
              <button
                type="button"
                onClick={() => {
                  ludoAudio.playButtonClick();
                  setActiveSubModal('feedback');
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_14px_rgba(245,158,11,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.7)] active:scale-95 hover:scale-105 transition-all cursor-pointer text-center"
              >
                Feedback
              </button>
            </div>
          </div>

          {/* Sub-Modal Overlay for Privacy & Feedback */}
          {activeSubModal && (
            <div className="w-full p-3 rounded-2xl bg-slate-950/95 border border-amber-400/80 text-center space-y-2 animate-in fade-in duration-150">
              {activeSubModal === 'privacy' ? (
                <>
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">Privacy Notice</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed text-left">
                    All game data, audio settings, and demo balances are stored locally in your browser storage. Zero tracking cookies or third-party advertising analytics are used.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">Player Feedback</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed text-left">
                    We are dedicated to crafting the ultimate board game experience. Suggestions or bug reports are welcomed by the platform team!
                  </p>
                </>
              )}
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="px-4 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-[10px] uppercase cursor-pointer"
              >
                Got It
              </button>
            </div>
          )}
        </div>

        {/* Circular Back Button (↩) */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleClose}
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

          {/* Version text matching reference */}
          <span className="text-[11px] font-bold text-slate-400 tracking-wider">
            v1.0.8
          </span>
        </div>
      </div>
    </div>
  );
};
