import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Play } from 'lucide-react';

export const PoolGame = ({ onExit, onWin, user, session, entryFee = 60 }) => {
  const [aimAngle, setAimAngle] = useState(0); // -45 to +45 deg
  const [power, setPower] = useState(65);
  const [shots, setShots] = useState(6);
  const [score, setScore] = useState(0);
  const [isShooting, setIsShooting] = useState(false);
  const [status, setStatus] = useState('Aim cue and shoot the balls into pockets!');

  const [balls, setBalls] = useState([
    { id: 1, x: 60, y: 50, color: '#eab308', num: 1, potted: false },
    { id: 2, x: 75, y: 40, color: '#3b82f6', num: 2, potted: false },
    { id: 3, x: 75, y: 60, color: '#ef4444', num: 3, potted: false },
    { id: 8, x: 90, y: 50, color: '#0f172a', num: 8, potted: false },
    { id: 5, x: 105, y: 40, color: '#f97316', num: 5, potted: false },
    { id: 6, x: 105, y: 60, color: '#10b981', num: 6, potted: false }
  ]);

  const shootCue = () => {
    if (isShooting || shots <= 0) return;
    setIsShooting(true);
    setShots((s) => s - 1);
    setStatus('Cue striking balls...');

    setTimeout(() => {
      const active = balls.filter((b) => !b.potted);
      if (active.length > 0 && Math.random() > 0.25) {
        const target = active[Math.floor(Math.random() * active.length)];
        setBalls((prev) =>
          prev.map((b) => (b.id === target.id ? { ...b, potted: true } : b))
        );
        const pts = target.num === 8 ? 50 : 20;
        const newScore = score + pts;
        setScore(newScore);
        setStatus(`Ball #${target.num} potted! +${pts} pts!`);

        if (target.num === 8 || newScore >= 60) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          if (onWin) onWin(100);
          setStatus('Victory! 8-Ball cleared!');
        }
      } else {
        setStatus('Clean strike but missed pocket. Try another angle!');
      }

      setIsShooting(false);
    }, 600);
  };

  const handleReset = () => {
    setShots(6);
    setScore(0);
    setIsShooting(false);
    setStatus('New pool rack. Aim and break!');
    setBalls([
      { id: 1, x: 60, y: 50, color: '#eab308', num: 1, potted: false },
      { id: 2, x: 75, y: 40, color: '#3b82f6', num: 2, potted: false },
      { id: 3, x: 75, y: 60, color: '#ef4444', num: 3, potted: false },
      { id: 8, x: 90, y: 50, color: '#0f172a', num: 8, potted: false },
      { id: 5, x: 105, y: 40, color: '#f97316', num: 5, potted: false },
      { id: 6, x: 105, y: 60, color: '#10b981', num: 6, potted: false }
    ]);
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:max-w-xl mx-auto flex flex-col justify-between p-2.5 sm:p-4 select-none overflow-hidden overscroll-none touch-manipulation pt-[env(safe-area-inset-top,8px)] pb-[env(safe-area-inset-bottom,8px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 mb-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg">
            🎱
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white leading-tight">8 Ball Pool Blitz</h2>
            <p className="text-[10px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-POOL'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={handleReset} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onExit} className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[38px] flex items-center gap-1 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 min-h-0 rounded-3xl bg-slate-900 border border-slate-800 p-3 shadow-2xl flex flex-col justify-between items-center w-full">
        {/* Pool Table Graphic */}
        <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[16/9] rounded-2xl bg-[#78350f] border-4 sm:border-8 border-[#b45309] p-2 sm:p-3 shadow-2xl overflow-hidden my-auto">
          <div className="w-full h-full rounded-xl bg-[#047857] border-2 border-[#065f46] relative overflow-hidden">
            {/* 6 Pockets */}
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800" />

            {/* Cue Ball */}
            <div
              style={{
                left: isShooting ? '45%' : '20%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute w-5 h-5 rounded-full bg-white border border-slate-300 shadow-md transition-all duration-300"
            />

            {/* Target Balls */}
            {balls.map((b) =>
              !b.potted ? (
                <div
                  key={b.id}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    backgroundColor: b.color,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute w-5 h-5 rounded-full border border-white/60 shadow-md flex items-center justify-center text-[8px] font-bold text-white transition-all"
                >
                  {b.num}
                </div>
              ) : null
            )}

            {/* Cue Stick */}
            {!isShooting && (
              <div
                style={{
                  left: '18%',
                  top: '50%',
                  transform: `translate(-100%, -50%) rotate(${aimAngle}deg)`,
                  transformOrigin: 'right center'
                }}
                className="absolute w-24 h-1.5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-200 rounded-l shadow"
              />
            )}
          </div>
        </div>

        {/* Score & Shots */}
        <div className="w-full mt-4 flex items-center justify-between px-2 text-xs">
          <div className="font-bold text-slate-300">
            Score: <span className="text-amber-400 text-sm font-black">{score}</span>
          </div>
          <div className="font-bold text-slate-300">
            Shots Left: <span className="text-emerald-400 text-sm font-black">{shots}</span>
          </div>
        </div>

        {/* Status prompt */}
        <div className="w-full text-center my-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {status}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 mt-2">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>Aim Cue Angle</span>
              <span>{aimAngle}°</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              value={aimAngle}
              disabled={isShooting || shots <= 0}
              onChange={(e) => setAimAngle(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={shootCue}
            disabled={isShooting || shots <= 0}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isShooting ? 'STRIKING...' : 'STRIKE CUE BALL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
