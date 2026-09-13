import React from 'react';
import { AlertCircle, Coins, X, ArrowRight } from 'lucide-react';

export const InsufficientBalanceModal = ({ isOpen, onClose, game, currentBalance, onAddCredits }) => {
  if (!isOpen || !game) return null;

  const shortage = Math.max(0, game.entryFee - currentBalance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Insufficient Balance</h3>
            <p className="text-xs text-slate-400">Demo Credits Required</p>
          </div>
        </div>

        <div className="p-4 mb-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Game:</span>
            <span className="font-semibold text-white">{game.title}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Required Entry Fee:</span>
            <span className="font-bold text-amber-400">{game.entryFee} Demo Credits</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Your Current Balance:</span>
            <span className="font-semibold text-slate-300">{currentBalance} Demo Credits</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
            <span className="text-rose-400 font-semibold">Shortage:</span>
            <span className="font-bold text-rose-400">-{shortage} Demo Credits</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          You don't have enough demo credits to join this match. You can replenish your virtual wallet anytime with 1-click free demo credits!
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              onAddCredits();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>Top Up Demo Credits</span>
            <ArrowRight className="w-4 h-4" />
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
