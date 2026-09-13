import React, { useState } from 'react';
import { X, PlusCircle, Coins, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const AddCreditsModal = ({ isOpen, onClose }) => {
  const { addCredits, isProcessing } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const presetAmounts = [100, 500, 1000, 2500];

  const handlePresetSelect = (amt) => {
    setIsCustom(false);
    setSelectedAmount(amt);
    setCustomAmount('');
    setError('');
  };

  const handleCustomChange = (e) => {
    setIsCustom(true);
    const val = e.target.value;
    setCustomAmount(val);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const finalAmount = isCustom ? Number(customAmount) : Number(selectedAmount);

    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!Number.isInteger(finalAmount)) {
      setError('Amount must be a whole number.');
      return;
    }

    if (finalAmount > 50000) {
      setError('Maximum top-up limit is 50,000 Demo Credits per request.');
      return;
    }

    try {
      await addCredits(finalAmount, `Added ${finalAmount} Demo Credits`);
      setSuccessMsg(`Successfully added +${finalAmount} Demo Credits!`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to add demo credits.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Add Demo Credits</h3>
            <p className="text-xs text-slate-400">100% Free Virtual Demo Currency</p>
          </div>
        </div>

        {/* Demo Disclaimer Box */}
        <div className="p-3 mb-5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <p className="leading-relaxed">
            Credits added here are <strong>simulated virtual tokens</strong> strictly for testing the platform and games. No actual payment is collected.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Select Preset Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((amt) => {
                const isSelected = !isCustom && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetSelect(amt)}
                    className={`py-2.5 px-2 rounded-xl text-sm font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    +{amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="50000"
                placeholder="e.g. 200"
                value={customAmount}
                onChange={handleCustomChange}
                className={`w-full py-3 px-4 rounded-xl bg-slate-950/80 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  isCustom
                    ? 'border-amber-500 focus:ring-amber-500/40'
                    : 'border-slate-800 focus:ring-slate-700'
                }`}
              />
              <span className="absolute right-4 top-3 text-xs font-semibold text-slate-500 pointer-events-none">
                Credits
              </span>
            </div>
          </div>

          {/* Error / Success Feedback */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Adding Credits...'
                : `Add ${isCustom ? (customAmount || 0) : selectedAmount} Demo Credits`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
