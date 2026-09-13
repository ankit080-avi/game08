import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, LogOut, Play, Zap, Trophy } from 'lucide-react';

export const KnifeTargetGame = ({ onExit, onWin, user, session, entryFee = 40 }) => {
  const [rotation, setRotation] = useState(0);
  const [knivesInTarget, setKnivesInTarget] = useState([0, 120, 240]); // Initial stuck angles
  const [knivesLeft, setKnivesLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('Tap THROW KNIFE to stick into the rotating target!');

  const animRef = useRef(null);

  // Smooth rotation animation loop
  useEffect(() => {
    let currentAngle = 0;
    const speed = 1.2 + level * 0.4;

    const loop = () => {
      currentAngle = (currentAngle + speed) % 360;
      setRotation(currentAngle);
      animRef.current = requestAnimationFrame(loop);
    };

    if (!gameOver) {
      animRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [level, gameOver]);

  const throwKnife = () => {
    if (gameOver || knivesLeft <= 0) return;

    // Angle relative to rotating log
    // Target is at bottom (90 deg), so relative angle on log is (90 - rotation + 360) % 360
    const hitAngle = Math.round((90 - rotation + 720) % 360);

    // Collision check: within 18 degrees of an existing knife
    const hasCollided = knivesInTarget.some((angle) => {
      const diff = Math.abs(angle - hitAngle);
      return diff < 20 || diff > 340;
    });

    if (hasCollided) {
      setGameOver(true);
      setStatus('Clash! Knife hit another blade. Game Over!');
      return;
    }

    // Successful stick
    const nextKnives = [...knivesInTarget, hitAngle];
    setKnivesInTarget(nextKnives);
    const nextLeft = knivesLeft - 1;
    setKnivesLeft(nextLeft);
    const newScore = score + 15;
    setScore(newScore);

    if (nextLeft === 0) {
      // Level Cleared
      if (level >= 2) {
        setGameOver(true);
        setStatus('Stage Master! You cleared all target levels!');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        if (onWin) onWin(80);
      } else {
        setLevel((lvl) => lvl + 1);
        setKnivesLeft(6);
        setKnivesInTarget([45, 180]);
        setStatus('Level 1 Cleared! Speed increased for Level 2.');
      }
    } else {
      setStatus(`Target hit! ${nextLeft} knives remaining.`);
    }
  };

  const handleReset = () => {
    setKnivesInTarget([0, 120, 240]);
    setKnivesLeft(5);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setStatus('Ready! Tap THROW KNIFE to strike.');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-xl">
            🗡️
          </div>
          <div>
            <h2 className="text-base font-black text-white">Knife Target Arcade</h2>
            <p className="text-[11px] text-slate-400">
              Session: <span className="font-mono text-amber-400">{session?.sessionId || 'GSESS-KNIFE'}</span> • Entry: {entryFee} Credits
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={onExit} className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 min-h-[44px] flex items-center gap-1 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Target Arena Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col items-center">
        {/* Arena Header */}
        <div className="w-full flex items-center justify-between px-2 mb-4 text-xs font-bold">
          <div>
            Level: <span className="text-amber-400 text-sm">{level}</span>
          </div>
          <div>
            Score: <span className="text-emerald-400 text-sm">{score} pts</span>
          </div>
          <div>
            Knives: <span className="text-cyan-400 text-sm">{knivesLeft}</span>
          </div>
        </div>

        {/* Target Board Area */}
        <div className="relative w-64 h-72 flex flex-col items-center justify-between my-2 select-none overflow-hidden">
          {/* Rotating Target Log */}
          <div
            style={{ transform: `rotate(${rotation}deg)` }}
            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#78350f] via-[#9a3412] to-[#451a03] border-4 border-[#ea580c] shadow-2xl flex items-center justify-center"
          >
            {/* Center target ring */}
            <div className="w-20 h-20 rounded-full border-2 border-amber-500/50 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-amber-500 shadow" />
            </div>

            {/* Embedded Knives */}
            {knivesInTarget.map((angle, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '6px',
                  height: '42px',
                  transformOrigin: 'top center',
                  transform: `translate(-50%, 0) rotate(${angle}deg)`
                }}
              >
                <div className="w-2 h-10 bg-slate-300 border border-slate-500 rounded-b shadow -mt-4 mx-auto" />
                <div className="w-3.5 h-3.5 bg-amber-600 rounded -mt-1 mx-auto" />
              </div>
            ))}
          </div>

          {/* Bottom Knife Ready to Throw */}
          <div className="flex flex-col items-center transition-all">
            <div className="w-2 h-14 bg-gradient-to-t from-slate-400 to-sky-300 border border-white rounded-t shadow-lg" />
            <div className="w-4 h-4 bg-amber-500 rounded-b shadow" />
          </div>
        </div>

        {/* Status prompt */}
        <div className="w-full text-center my-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
          {status}
        </div>

        {/* Big Touch-Friendly Throw Button (Height >= 50px) */}
        <button
          onClick={throwKnife}
          disabled={gameOver || knivesLeft <= 0}
          className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 cursor-pointer active:scale-95 disabled:opacity-40"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>THROW KNIFE</span>
        </button>
      </div>
    </div>
  );
};
