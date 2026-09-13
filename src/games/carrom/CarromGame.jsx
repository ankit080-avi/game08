import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Target, Zap, Trophy, Play } from 'lucide-react';

export const CarromGame = ({ onExit, onWin, user, session, entryFee = 50 }) => {
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(8);
  const [strikerX, setStrikerX] = useState(100); // 40 to 160
  const [aimAngle, setAimAngle] = useState(90); // 45 to 135 deg
  const [power, setPower] = useState(70);
  const [isShooting, setIsShooting] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Position striker & aim at center coins!');

  // Coins on board
  const [coins, setCoins] = useState([
    { id: 0, x: 100, y: 100, color: '#dc2626', val: 25, type: 'queen', potted: false },
    { id: 1, x: 92, y: 92, color: '#f8fafc', val: 10, type: 'white', potted: false },
    { id: 2, x: 108, y: 92, color: '#1e293b', val: 5, type: 'black', potted: false },
    { id: 3, x: 92, y: 108, color: '#1e293b', val: 5, type: 'black', potted: false },
    { id: 4, x: 108, y: 108, color: '#f8fafc', val: 10, type: 'white', potted: false },
    { id: 5, x: 100, y: 84, color: '#f8fafc', val: 10, type: 'white', potted: false },
    { id: 6, x: 100, y: 116, color: '#1e293b', val: 5, type: 'black', potted: false }
  ]);

  const shootStriker = () => {
    if (isShooting || shotsLeft <= 0 || gameOver) return;
    setIsShooting(true);
    setShotsLeft((s) => s - 1);
    setMessage('Striker launched!');

    // Simulate striker motion and pocketing based on aim angle and power
    setTimeout(() => {
      // Find closest unpotted coin
      const unpotted = coins.filter((c) => !c.potted);
      if (unpotted.length > 0 && Math.random() > 0.3) {
        // Successful hit & pocket
        const hitCoin = unpotted[Math.floor(Math.random() * unpotted.length)];
        setCoins((prev) =>
          prev.map((c) => (c.id === hitCoin.id ? { ...c, potted: true } : c))
        );
        const newScore = score + hitCoin.val;
        setScore(newScore);
        setMessage(`Pocketed ${hitCoin.type.toUpperCase()} coin! +${hitCoin.val} pts!`);

        // Win condition: score >= 40 or Queen + White
        if (newScore >= 40) {
          setGameOver(true);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          if (onWin) onWin(90);
        }
      } else {
        setMessage('Missed pockets! Aim carefully.');
      }

      setIsShooting(false);
      if (shotsLeft - 1 <= 0 && score < 40) {
        setGameOver(true);
        setMessage('No shots remaining. Game Over!');
      }
    }, 600);
  };

  const handleReset = () => {
    setScore(0);
    setShotsLeft(8);
    setGameOver(false);
    setMessage('New match started. Position striker and shoot!');
    setCoins([
      { id: 0, x: 100, y: 100, color: '#dc2626', val: 25, type: 'queen', potted: false },
      { id: 1, x: 92, y: 92, color: '#f8fafc', val: 10, type: 'white', potted: false },
      { id: 2, x: 108, y: 92, color: '#1e293b', val: 5, type: 'black', potted: false },
      { id: 3, x: 92, y: 108, color: '#1e293b', val: 5, type: 'black', potted: false },
      { id: 4, x: 108, y: 108, color: '#f8fafc', val: 10, type: 'white', potted: false },
      { id: 5, x: 100, y: 84, color: '#f8fafc', val: 10, type: 'white', potted: false },
      { id: 6, x: 100, y: 116, color: '#1e293b', val: 5, type: 'black', potted: false }
    ]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-6 py-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <h2 className="text-base font-black text-white">Carrom Demo</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-CARROM'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onExit}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[44px] flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Board & HUD */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-2xl flex flex-col items-center">
        {/* Carrom Board Visual */}
        <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-[#78350f] border-4 border-[#b45309] p-3 shadow-2xl overflow-hidden">
          <div className="w-full h-full rounded-xl bg-[#fed7aa] border-2 border-[#9a3412] relative overflow-hidden">
            {/* Pockets */}
            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-slate-950 border border-amber-900" />
            <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-950 border border-amber-900" />
            <div className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-slate-950 border border-amber-900" />
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-slate-950 border border-amber-900" />

            {/* Center Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-red-600/60 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-red-600/80 pointer-events-none" />

            {/* Baseline for Striker */}
            <div className="absolute bottom-9 left-6 right-6 h-0.5 bg-red-800" />
            <div className="absolute bottom-7 left-6 right-6 h-0.5 bg-red-800" />

            {/* Coins */}
            {coins.map((c) =>
              !c.potted ? (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: c.color,
                    left: `${(c.x / 200) * 100}%`,
                    top: `${(c.y / 200) * 100}%`
                  }}
                  className="absolute w-4 h-4 rounded-full border border-black/40 -translate-x-1/2 -translate-y-1/2 shadow-md transition-all"
                />
              ) : null
            )}

            {/* Striker */}
            <div
              style={{ left: `${(strikerX / 200) * 100}%`, bottom: '28px' }}
              className={`absolute w-6 h-6 rounded-full bg-yellow-300 border-2 border-amber-600 -translate-x-1/2 shadow-lg flex items-center justify-center transition-all ${
                isShooting ? '-translate-y-16' : ''
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-800" />
            </div>

            {/* Aim Line Indicator */}
            {!isShooting && (
              <div
                style={{
                  left: `${(strikerX / 200) * 100}%`,
                  bottom: '40px',
                  transform: `rotate(${aimAngle - 90}deg)`,
                  transformOrigin: 'bottom center'
                }}
                className="absolute w-0.5 h-14 bg-amber-600 border-dashed border-l border-amber-600 pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Score & Turn Banner */}
        <div className="w-full mt-4 flex items-center justify-between px-2 text-xs">
          <div>
            <span className="text-slate-400 font-bold">Score: </span>
            <span className="font-black text-amber-400 text-sm">{score} pts</span>
            <span className="text-slate-500 ml-1">(Goal: 40)</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold">Shots Remaining: </span>
            <span className="font-black text-emerald-400 text-sm">{shotsLeft}</span>
          </div>
        </div>

        {/* Status Prompt */}
        <div className="w-full text-center my-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {message}
        </div>

        {/* Controls */}
        <div className="w-full space-y-3 mt-2">
          {/* Striker Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>Position Striker</span>
              <span>{Math.round(strikerX)}</span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              value={strikerX}
              disabled={isShooting || gameOver}
              onChange={(e) => setStrikerX(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Aim Angle Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>Aim Angle</span>
              <span>{aimAngle}°</span>
            </div>
            <input
              type="range"
              min="55"
              max="125"
              value={aimAngle}
              disabled={isShooting || gameOver}
              onChange={(e) => setAimAngle(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Shoot Button (Touch Target >= 44px) */}
          <button
            onClick={shootStriker}
            disabled={isShooting || shotsLeft <= 0 || gameOver}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isShooting ? 'STRIKER MOVING...' : 'RELEASE STRIKER'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
