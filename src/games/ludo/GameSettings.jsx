import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Zap, RotateCcw, LogOut, X, Play } from 'lucide-react';

/**
 * Game Settings Modal
 * Provides:
 * - Sound ON / OFF
 * - Music ON / OFF
 * - Animations ON / OFF
 * - [ Resume Game ]
 * - [ Exit Game ]
 */
export const GameSettings = ({
  isOpen = false,
  onClose,
  soundOn = true,
  onToggleSound,
  musicOn = true,
  onToggleMusic,
  animationsOn = true,
  onToggleAnimations,
  onRestartMatch,
  onExitGame
}) => {
  const [confirmExit, setConfirmExit] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl p-5 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="text-base font-black text-white tracking-wide uppercase">Settings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Sound</span>
                <span className="text-[10px] text-slate-400">Dice roll & token step effects</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                soundOn
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {soundOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Music className={`w-4 h-4 ${musicOn ? 'text-amber-400' : 'text-slate-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Music</span>
                <span className="text-[10px] text-slate-400">Background atmosphere</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleMusic}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                musicOn
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {musicOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Zap className={`w-4 h-4 ${animationsOn ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Animations</span>
                <span className="text-[10px] text-slate-400">Smooth step hops & particle effects</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleAnimations}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                animationsOn
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {animationsOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Resume Game Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all mt-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Resume Game</span>
          </button>

          {/* Exit Game Button */}
          {confirmExit ? (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
              <p className="text-xs font-bold text-rose-300">Exit game and return to dashboard?</p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmExit(false);
                    onExitGame?.();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer active:scale-95"
                >
                  Exit Now
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmExit(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmExit(true)}
              className="w-full py-2.5 px-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Exit Game</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
