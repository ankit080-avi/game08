import React, { useState } from 'react';
import {
  Gamepad2,
  Coins,
  Plus,
  History,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  User,
  Menu,
  X,
  Layers,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

export const Navbar = ({ currentView, onChangeView, onOpenAddCredits, onOpenResetDemo }) => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: History }
  ];

  const handleNavClick = (viewId) => {
    onChangeView(viewId);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          {/* LEFT: Game Logo + Game 08 */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 group cursor-pointer min-h-[44px] min-w-[44px]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Game<span className="text-amber-400">08</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 ml-1 border border-amber-500/30">
                    Demo
                  </span>
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                        isActive
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* RIGHT (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              {/* Demo Wallet Widget */}
              <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 leading-none">
                      Demo Credits
                    </p>
                    <p className="text-sm font-black text-amber-400 leading-tight">
                      {balance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenAddCredits}
                  title="Add Demo Credits"
                  className="ml-1 p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-[10px] text-slate-500">@{user.username}</p>
                </div>
              </div>

              {/* Reset Demo Button */}
              <button
                onClick={onOpenResetDemo}
                title="Reset Demo Data"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* RIGHT (Mobile): Wallet Balance + Menu Hamburger Button */}
          {user && (
            <div className="flex items-center gap-2 md:hidden">
              {/* Compact Mobile Wallet Pill */}
              <button
                onClick={onOpenAddCredits}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-extrabold text-xs min-h-[44px] cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>{balance.toLocaleString()}</span>
                <Plus className="w-3.5 h-3.5 text-amber-300 ml-0.5 stroke-[3]" />
              </button>

              {/* Touch-Friendly Menu Toggle (min 44x44) */}
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer Modal / Overlay */}
        {mobileDrawerOpen && user && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl p-4 space-y-4 animate-fade-in shadow-2xl">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-black text-base">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-black text-white">{user.fullName || user.username}</p>
                <p className="text-xs text-slate-400">@{user.username} • Demo Account</p>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-1.5">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold min-h-[44px] cursor-pointer ${
                  currentView === 'dashboard' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 bg-slate-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard / Games</span>
              </button>
              <button
                onClick={() => handleNavClick('transactions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold min-h-[44px] cursor-pointer ${
                  currentView === 'transactions' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 bg-slate-900/60'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Transaction History</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenAddCredits();
                }}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4" />
                <span>Top Up Demo Credits</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenResetDemo();
                  }}
                  className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (for phones < 768px) */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-inset-bottom">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[52px] cursor-pointer ${
              currentView === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => {
              handleNavClick('dashboard');
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[52px] text-slate-400 hover:text-amber-400 cursor-pointer"
          >
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Games</span>
          </button>

          <button
            onClick={onOpenAddCredits}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[52px] text-amber-400 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-0.5">
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
            </div>
            <span className="text-[10px] font-bold">Wallet</span>
          </button>

          <button
            onClick={() => handleNavClick('transactions')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[52px] cursor-pointer ${
              currentView === 'transactions' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Txns</span>
          </button>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[52px] text-slate-400 hover:text-white cursor-pointer"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </nav>
      )}
    </>
  );
};
