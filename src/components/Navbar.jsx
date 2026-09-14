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
  Wallet,
  Bell
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
          {/* ========================================================= */}
          {/* DESKTOP HEADER (>= 768px / hidden md:flex)                */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* LEFT: Game Logo + Game 08 + Nav Links */}
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
                <nav className="flex items-center gap-1">
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

            {/* RIGHT: Desktop Wallet Widget + User Pill + Reset + Logout */}
            {user && (
              <div className="flex items-center gap-3">
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

                <button
                  onClick={onOpenResetDemo}
                  title="Reset Demo Data"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* COMPACT MOBILE HEADER (< 768px / flex md:hidden)          */}
          {/* ========================================================= */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* LEFT: Avatar / Profile button + Game 08 Branding */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/80 shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                title="Profile & Menu"
              >
                <div className="w-full h-full rounded-full flex items-center justify-center text-xs font-black text-slate-200">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4 text-slate-300" />}
                </div>
              </button>

              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-baseline gap-1 cursor-pointer"
              >
                <span className="text-xl font-black tracking-tight text-white">Game</span>
                <span className="text-xl font-black text-amber-400">08</span>
              </button>
            </div>

            {/* RIGHT: Current Balance Pill + Add Button + Bell Notification Control */}
            {user && (
              <div className="flex items-center gap-2">
                {/* Credit / Wallet Balance Pill with '+' button */}
                <button
                  onClick={onOpenAddCredits}
                  className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-[#0c1322] border border-slate-800/90 shadow-sm cursor-pointer active:scale-95 transition-transform"
                  title="Add Demo Credits"
                >
                  <span className="text-sm leading-none">🪙</span>
                  <span className="text-xs font-black text-amber-400 tracking-wide leading-none">
                    {balance.toLocaleString()}
                  </span>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-slate-950 font-bold ml-0.5">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>

                {/* Notification / Menu Bell */}
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="relative w-9 h-9 rounded-full bg-[#0c1322] border border-slate-800/90 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-transform"
                  aria-label="Open Navigation Menu"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-slate-950" />
                </button>
              </div>
            )}
          </div>
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-6 py-2 flex items-center justify-around shadow-2xl pb-[max(env(safe-area-inset-bottom,0px),10px)]">
          {/* Games Tab */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl min-h-[44px] cursor-pointer transition-colors active:scale-95 ${
              currentView === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-bold">Games</span>
          </button>

          {/* Wallet Tab */}
          <button
            onClick={onOpenAddCredits}
            className="flex flex-col items-center justify-center py-1 px-4 rounded-xl min-h-[44px] text-slate-400 hover:text-amber-400 cursor-pointer transition-colors active:scale-95"
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-bold">Wallet</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-4 rounded-xl min-h-[44px] text-slate-400 hover:text-slate-200 cursor-pointer transition-colors active:scale-95"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-bold">Profile</span>
          </button>
        </nav>
      )}
    </>
  );
};
