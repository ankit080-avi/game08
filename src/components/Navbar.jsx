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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

export const Navbar = ({ currentView, onChangeView, onOpenAddCredits, onOpenResetDemo }) => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: History }
  ];

  const handleNavClick = (viewId) => {
    onChangeView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Game<span className="text-amber-400">08</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 ml-1 border border-amber-500/30">
                  Demo
                </span>
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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

        {/* Right Actions */}
        {user ? (
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
                className="ml-1 p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
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
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}

        {/* Mobile menu hamburger button */}
        {user && (
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick Balance for mobile */}
            <button
              onClick={onOpenAddCredits}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{balance}</span>
              <Plus className="w-3 h-3 text-amber-300 ml-0.5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300 font-bold">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.fullName || user.username}</p>
              <p className="text-xs text-slate-400">Demo User</p>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    currentView === item.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddCredits();
              }}
              className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Add Credits</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResetDemo();
              }}
              className="py-2 px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
