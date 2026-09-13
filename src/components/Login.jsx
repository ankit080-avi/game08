import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Shield,
  Coins,
  ArrowRight,
  UserPlus,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, register, quickDemoLogin, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegisterMode) {
        if (!username.trim()) {
          setError('Please choose a username.');
          return;
        }
        await register({ username, fullName });
      } else {
        if (!username.trim()) {
          setError('Please enter your username.');
          return;
        }
        await login(username);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleQuickDemo = async () => {
    setError('');
    try {
      await quickDemoLogin();
    } catch (err) {
      setError(err.message || 'Failed to initialize demo session.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Showcase */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 p-0.5 shadow-xl shadow-indigo-500/25 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Game<span className="text-amber-400">08</span> Prototype
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Modular Web Gaming Platform demonstration with virtual demo credits and playable Ludo.
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Quick Demo Login Option */}
          <div className="mb-6">
            <button
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>1-Click Instant Demo Login</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              Instantly grants <strong>500 Demo Credits</strong> without registration
            </p>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              or create custom dummy profile
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. champion08"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Hunter"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Demo Profile</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Enter Platform</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setError('');
                setIsRegisterMode(!isRegisterMode);
              }}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              {isRegisterMode
                ? 'Already created a profile? Sign In'
                : "Want a custom profile? Create one here"}
            </button>
          </div>
        </div>

        {/* Security / Prototype Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>No password needed • Session cached locally</span>
        </div>
      </div>
    </div>
  );
};
