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
      {/* 2. CENTERED PORTRAIT MOBILE-SHAPED GAME VIEWPORT (9:16)   */}
      {/* ========================================================= */}
      <div
        ref={viewportRef}
        id="ludo-game-viewport"
        style={{
          aspectRatio: '9 / 16',
          width: 'min(100vw, calc(100dvh * 9 / 16), 540px)',
          height: 'min(100dvh, calc(100vw * 16 / 9), 960px)',
          maxWidth: '100vw',
          maxHeight: '100dvh'
        }}
        className={`relative flex flex-col justify-between overflow-hidden bg-[#091b46] md:rounded-3xl md:border md:border-amber-500/30 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_30px_rgba(30,58,138,0.4)] transition-all ${className}`}
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
