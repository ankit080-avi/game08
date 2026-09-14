import React from 'react';
import { ArrowLeft, Settings, Volume2, VolumeX } from 'lucide-react';

/**
 * Minimal Professional Top Game HUD
 * Features:
 * - Top-left: ← Exit
 * - Top-center: LUDO title & match status
 * - Top-right: Audio toggle & ⚙ Settings
 */
export const GameHUD = ({
  title = 'LUDO',
  entryFee = 100,
  soundOn = true,
  onToggleSound,
  onOpenSettings,
  onExit
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-3 py-2 select-none z-30">
      {/* Top-Left: Exit Button */}
      <button
        type="button"
        onClick={onExit}
        className="h-9 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow active:scale-95 cursor-pointer"
        title="Exit to Dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Exit</span>
      </button>

      {/* Top-Center: Game Title & Entry Pill */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400">
          Match • {entryFee} Credits
        </span>
      </div>

      {/* Top-Right: Sound & Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onToggleSound}
          className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
          title={soundOn ? 'Mute' : 'Unmute'}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
