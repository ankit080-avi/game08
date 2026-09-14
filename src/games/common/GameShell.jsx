import React, { useState, useEffect } from 'react';

/**
 * Reusable GameShell Component
 * Ensures games take full viewport (100vw x 100dvh desktop, 100% x 100dvh mobile)
 * Provides ambient gaming atmosphere and handles screen orientation & scaling.
 */
export const GameShell = ({
  children,
  hud,
  overlays,
  className = '',
  tableColor = 'indigo' // 'indigo' | 'emerald' | 'amber' | 'neutral'
}) => {
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
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const tableGradients = {
    indigo: 'from-[#0a1128] via-[#0d1b3e] to-[#060b19]',
    emerald: 'from-[#062419] via-[#0b3b2b] to-[#041710]',
    amber: 'from-[#241505] via-[#3d240a] to-[#140b03]',
    neutral: 'from-[#0f172a] via-[#1e293b] to-[#090d16]'
  };

  const gradient = tableGradients[tableColor] || tableGradients.indigo;

  return (
    <div
      className={`fixed inset-0 z-40 w-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-gradient-to-b ${gradient} text-slate-100 select-none ${className}`}
    >
      {/* Ambient subtle felt pattern overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Ambient lighting vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Top HUD slot */}
      {hud && <div className="relative z-20 w-full shrink-0">{hud}</div>}

      {/* Main Play Arena slot */}
      <div className="relative z-10 flex-1 w-full h-full flex flex-col items-center justify-center min-h-0 overflow-hidden px-2 sm:px-4 py-1 sm:py-2">
        {children}
      </div>

      {/* Modals & Overlays slot */}
      {overlays && <div className="relative z-50">{overlays}</div>}
    </div>
  );
};
