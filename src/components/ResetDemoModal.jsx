import React from 'react';
import { AlertOctagon, X, RotateCcw } from 'lucide-react';
import { storageService } from '../services/storageService';

export const ResetDemoModal = ({ isOpen, onClose, onResetConfirmed }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    // Clear all game08 platform data
    storageService.clearPlatformData();
    onClose();
    if (onResetConfirmed) {
      onResetConfirmed();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Reset Demo Data</h3>
            <p className="text-xs text-rose-400 font-semibold">Action Cannot Be Undone</p>
          </div>
        </div>

        <div className="p-4 mb-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-rose-300">
            This will permanently erase all local demo session data:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Reset active user session and profiles</li>
            <li>Reset virtual wallet balance to initial state</li>
            <li>Erase all demo transaction logs</li>
            <li>Reset any active game states</li>
          </ul>
          <p className="text-[11px] text-slate-500 pt-1">
            You will be returned to the initial login / registration screen.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yes, Reset Everything</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
