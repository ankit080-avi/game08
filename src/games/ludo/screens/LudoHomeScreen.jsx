import React from 'react';
import { LudoHeroArtwork } from './LudoHeroArtwork.jsx';
import { ludoAudio } from '../ludoAudio.js';
import { Maximize2, Minimize2 } from 'lucide-react';

export const LudoHomeScreen = ({
  username = 'Guest1234',
  balance = 0,
  onOpenAddCredits,
  onOpenSettings,
  onOpenVsComputer,
  onOpenOnlineMultiplayer,
  toggleFullscreen,
  isFullscreen = false,
  onExitToDashboard
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between py-2 px-3 select-none overflow-hidden font-sans">
      {/* ========================================================= */}
      {/* 1. TOP HEADER: Avatar, Username, Coins & More Coins       */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col gap-1 shrink-0 z-20 pt-1">
        <div className="w-full flex items-center justify-between p-1.5 rounded-2xl bg-gradient-to-r from-[#0b2b6b] via-[#0d2a6a] to-[#0b2b6b] border-2 border-amber-400 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)]">
          {/* Left: Avatar Frame + Username + Level Star */}
          <div className="flex items-center gap-2">
            {/* Avatar Frame with Gold Border */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-amber-400 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              {/* Profile Avatar Silhouette */}
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-600 fill-current">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>

              {/* Online indicator dot */}
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>

            {/* User Info & Level Star */}
            <div className="flex flex-col">
              <span className="text-xs font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wide leading-tight truncate max-w-[110px]">
                {username}
              </span>

              {/* Star Level Badge with Mini XP Bar */}
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 border border-amber-600 flex items-center justify-center shadow-sm">
                  <span className="text-[9px] font-black text-slate-950 leading-none">1</span>
                </div>
                <div className="w-12 h-1.5 rounded-full bg-slate-950 border border-amber-400/60 overflow-hidden">
                  <div className="w-3/5 h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Coins Balance + MORE COINS Button */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {/* Coin Balance Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-400/80 shadow-sm">
              <span className="text-sm leading-none">🪙</span>
              <span className="text-xs font-black text-amber-300 tracking-wider">
                {balance.toLocaleString()}
              </span>
            </div>

            {/* MORE COINS Button matching reference */}
            <button
              type="button"
              onClick={() => {
                ludoAudio.playButtonClick();
                onOpenAddCredits?.();
              }}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-sky-600 via-blue-700 to-sky-600 border border-amber-300 text-white font-black text-[10px] uppercase tracking-wider shadow-[0_0_8px_rgba(245,158,11,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:scale-95 hover:scale-105 transition-all cursor-pointer"
            >
              MORE COINS
            </button>
          </div>
        </div>

        {/* Sub-bar: Settings Button on Left, Exit to Dashboard on Right */}
        <div className="flex items-center justify-between pt-1 px-1">
          <button
            type="button"
            onClick={() => {
              ludoAudio.playButtonClick();
              onOpenSettings?.();
            }}
            aria-label="Settings"
            className="w-10 h-10 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Settings"
          >
            {/* Dual Gold Cogs SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 fill-current">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>

          {/* Return to Platform Dashboard Button */}
          {onExitToDashboard && (
            <button
              type="button"
              onClick={() => {
                ludoAudio.playButtonClick();
                onExitToDashboard();
              }}
              title="Return to Dashboard"
              className="w-10 h-10 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-amber-400 stroke-amber-400"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CENTER HERO AREA: 3D LUDO ARTWORK                     */}
      {/* ========================================================= */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-2">
        <LudoHeroArtwork />
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN ACTION BUTTONS: ONLINE MULTIPLAYER & VS COMPUTER  */}
      {/* ========================================================= */}
      <div className="w-full flex flex-col items-center gap-3.5 shrink-0 z-20 pb-2">
        {/* ONLINE MULTIPLAYER Button */}
        <button
          type="button"
          onClick={() => {
            ludoAudio.playButtonClick();
            onOpenOnlineMultiplayer?.();
          }}
          className="w-full max-w-[280px] py-3 rounded-2xl bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-[2.5px] border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.6),0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.6)] active:translate-y-1 active:shadow-[0_0_14px_rgba(245,158,11,0.5),0_2px_0_#78350f] active:scale-[0.97] hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center gap-1.5"
        >
          {/* Connected Phones Icon */}
          <div className="flex items-center gap-1">
            {/* Phone Left */}
            <div className="w-6 h-9 rounded-md bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
              <div className="w-4 h-6 rounded-sm bg-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </div>

            {/* Connecting Chain & Globe */}
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-1 rounded-full bg-amber-300" />
              <span className="text-xs">🌐</span>
              <span className="w-1 h-1 rounded-full bg-amber-300" />
            </div>

            {/* Phone Right */}
            <div className="w-6 h-9 rounded-md bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
              <div className="w-4 h-6 rounded-sm bg-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>

          {/* Button Text */}
          <span className="text-base font-black text-amber-300 drop-shadow-[0_2px_0_#78350f,0_3px_6px_rgba(0,0,0,0.9)] tracking-wider uppercase">
            ONLINE MULTIPLAYER
          </span>
        </button>

        {/* VS COMPUTER Button */}
        <button
          type="button"
          onClick={() => {
            ludoAudio.playButtonClick();
            onOpenVsComputer?.();
          }}
          className="w-full max-w-[280px] py-3 rounded-2xl bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-[2.5px] border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.6),0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.6)] active:translate-y-1 active:shadow-[0_0_14px_rgba(245,158,11,0.5),0_2px_0_#78350f] active:scale-[0.97] hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center gap-1.5"
        >
          {/* Phone with VS Badge Icon */}
          <div className="w-7 h-10 rounded-md bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
            <div className="w-5 h-7 rounded-sm bg-slate-950 flex items-center justify-center">
              <span className="text-[9px] font-black text-amber-300">VS</span>
            </div>
          </div>

          {/* Button Text */}
          <span className="text-base font-black text-amber-300 drop-shadow-[0_2px_0_#78350f,0_3px_6px_rgba(0,0,0,0.9)] tracking-wider uppercase">
            VS COMPUTER
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM BAR: Bonus Reward Button & Fullscreen Button   */}
      {/* ========================================================= */}
      <div className="w-full flex items-center justify-between px-2 pt-1 pb-0.5 shrink-0 z-20">
        {/* Bonus / Coin Stack Rewards Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-amber-400/60 text-amber-300 shadow">
          <span className="text-base">🏆</span>
          <span className="text-[10px] font-black uppercase tracking-wider">LUDO ARENA</span>
        </div>

        {/* Fullscreen Toggle Button with Gold Border */}
        <button
          type="button"
          onClick={() => {
            ludoAudio.playButtonClick();
            toggleFullscreen?.();
          }}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="w-9 h-9 rounded-xl border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
