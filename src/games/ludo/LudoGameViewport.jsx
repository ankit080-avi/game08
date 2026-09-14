import React, { useRef, useState, useEffect } from 'react';
import { LudoGameBackground } from './LudoGameBackground.jsx';

/**
 * LudoGameViewport: Dedicated Portrait Mobile Game Viewport
 *
 * Design Spec:
 * - On desktop: centered 9:16 portrait mobile-shaped viewport (approx 540x960, dynamically scaled).
 * - Outside viewport: dark premium gaming background filling the entire browser.
 * - On mobile: full-screen 100vw x 100dvh while maintaining portrait composition.
 * - Never becomes landscape on desktop.
 * - Supports browser Fullscreen API.
 */
export const LudoGameViewport = ({
  children,
  className = ''
}) => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const elem = containerRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 w-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex items-center justify-center bg-[#060a17] select-none font-sans"
    >
      {/* ========================================================= */}
      {/* 1. DESKTOP BACKGROUND (Fills entire browser outside game) */}
      {/* ========================================================= */}
      <LudoGameBackground variant="desktop" />

      {/* ========================================================= */}
      {/* 2. CENTERED PORTRAIT MOBILE-SHAPED GAME VIEWPORT          */}
      {/* ========================================================= */}
      <div
        ref={viewportRef}
        id="ludo-game-viewport"
        className={`relative flex flex-col justify-between overflow-hidden bg-[#091b46] w-full h-full max-h-[100dvh] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] md:aspect-[9/16] md:w-[min(100vw,calc(100dvh*9/16),540px)] md:h-[min(100dvh,calc(100vw*16/9),960px)] md:rounded-3xl md:border md:border-amber-500/30 md:p-0 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_30px_rgba(30,58,138,0.4)] transition-all ${className}`}
      >
        {/* Internal rich game wallpaper pattern */}
        <LudoGameBackground variant="viewport" />

        {/* Viewport Children (Header, Board, Controls) with Fullscreen context */}
        {typeof children === 'function'
          ? children({ isFullscreen, toggleFullscreen })
          : children}
      </div>
    </div>
  );
};
