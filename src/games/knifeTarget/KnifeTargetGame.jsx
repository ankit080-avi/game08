import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  LogOut,
  Play,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Flame,
  Award,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { audioManager } from './AudioManager';
import { levelManager } from './LevelManager';
import { ParticleManager } from './ParticleManager';
import { GameRenderer } from './GameRenderer';

// Virtual canvas dimensions (portrait arcade cabinet)
const CANVAS_WIDTH = 380;
const CANVAS_HEIGHT = 600;
const TARGET_CX = CANVAS_WIDTH / 2; // 190
const TARGET_CY = 190;
const TARGET_RADIUS = 70;
const READY_KNIFE_Y = 510;
const THROW_SPEED = 26;

export const KnifeTargetGame = ({
  game,
  onExit,
  onWin,
  user,
  session,
  entryFee = 40
}) => {
  // Game states: 'menu' | 'playing' | 'stage_clear' | 'game_over' | 'victory'
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('blade_target_high_score') || '0', 10);
    } catch (_) {
      return 0;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [knivesRemaining, setKnivesRemaining] = useState(6);
  const [totalKnivesForStage, setTotalKnivesForStage] = useState(6);
  const [activeLevelConfig, setActiveLevelConfig] = useState(null);

  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(new ParticleManager());
  const touchHandledRef = useRef(false);

  // Mutable game simulation state (ref for 60fps loop without React re-render lag)
  const simRef = useRef({
    rotation: 0,
    rotSpeed: 0.03,
    direction: 1,
    frameCount: 0,
    stuckKnives: [], // Array of angle numbers in degrees [0..359]
    flyingKnife: null, // { y, vy, vx, isColliding, tumbleAngle, vRot }
    isShattered: false,
    shatterTimer: 0,
    levelConfig: null,
    knivesLeft: 6,
    score: 0,
    gameOverReported: false
  });

  // Toggle Audio Mute
  const handleToggleMute = useCallback(() => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  }, []);

  // Update High Score helper
  const checkAndUpdateHighScore = useCallback((currentScore) => {
    setHighScore((prev) => {
      if (currentScore > prev) {
        try {
          localStorage.setItem('blade_target_high_score', currentScore.toString());
        } catch (_) {}
        return currentScore;
      }
      return prev;
    });
  }, []);

  // Initialize a specific level
  const initLevel = useCallback((lvlNum, keepScore = true) => {
    const config = levelManager.getLevelConfig(lvlNum);
    setActiveLevelConfig(config);
    setCurrentLevel(lvlNum);
    setKnivesRemaining(config.knivesRequired);
    setTotalKnivesForStage(config.knivesRequired);

    particlesRef.current.reset();

    const sim = simRef.current;
    sim.levelConfig = config;
    sim.knivesLeft = config.knivesRequired;
    sim.stuckKnives = [...config.initialKnives];
    sim.flyingKnife = null;
    sim.isShattered = false;
    sim.shatterTimer = 0;
    sim.gameOverReported = false;
    sim.rotation = 0;
    sim.direction = 1;
    sim.frameCount = 0;
    sim.rotSpeed = config.baseSpeed;

    if (!keepScore) {
      sim.score = 0;
      setScore(0);
    }
  }, []);

  // Start fresh game from Level 1
  const startNewGame = useCallback(() => {
    initLevel(1, false);
    setGameState('playing');
  }, [initLevel]);

  // Restart current run
  const handleRestart = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  // Throw knife handler
  const handleThrow = useCallback(() => {
    const sim = simRef.current;
    if (gameState !== 'playing') return;
    if (sim.isShattered) return;
    if (sim.flyingKnife) return; // Wait for current knife to reach target
    if (sim.knivesLeft <= 0) return;

    // Launch knife upwards
    sim.flyingKnife = {
      x: TARGET_CX,
      y: READY_KNIFE_Y,
      vy: -THROW_SPEED,
      vx: 0,
      isColliding: false,
      tumbleAngle: 0,
      vRot: 0
    };

    audioManager.playThrow();
    sim.knivesLeft -= 1;
    setKnivesRemaining(sim.knivesLeft);
  }, [gameState]);

  // Mobile / Touch interaction handler to prevent double-fires
  const handleInteraction = useCallback((e) => {
    if (e) {
      if (e.type === 'touchstart') {
        touchHandledRef.current = true;
        setTimeout(() => {
          touchHandledRef.current = false;
        }, 300);
      } else if (e.type === 'click' && touchHandledRef.current) {
        return;
      }
    }
    handleThrow();
  }, [handleThrow]);

  // Advance to next stage
  const handleNextStage = useCallback(() => {
    const nextLvl = currentLevel + 1;
    if (nextLvl > 5) {
      // Victory! Cleared all 5 stages!
      setGameState('victory');
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 } });
      if (onWin) {
        onWin(game?.winReward || 80);
      }
    } else {
      initLevel(nextLvl, true);
      setGameState('playing');
    }
  }, [currentLevel, game, initLevel, onWin]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!rendererRef.current) {
      rendererRef.current = new GameRenderer(canvas);
    }
    const renderer = rendererRef.current;
    const particles = particlesRef.current;

    let animId;

    const gameLoop = () => {
      const sim = simRef.current;
      sim.frameCount++;

      // 1. Update Target Rotation Dynamics based on Level Pattern
      if (!sim.isShattered && sim.levelConfig) {
        const pattern = sim.levelConfig.pattern;
        if (pattern === 'constant') {
          sim.rotation += sim.rotSpeed;
        } else if (pattern === 'reversing') {
          // Smooth periodic reversal
          sim.rotation += Math.sin(sim.frameCount * 0.025) * sim.rotSpeed * 1.5;
        } else if (pattern === 'oscillate') {
          // Accelerates and decelerates with high tension
          sim.rotation += (Math.cos(sim.frameCount * 0.035) + 0.3) * sim.rotSpeed * 1.4;
        } else if (pattern === 'erratic') {
          // Boss mode: bursts of speed with sudden stops
          const cycle = sim.frameCount % 180;
          if (cycle < 60) {
            sim.rotation += sim.rotSpeed * 1.8;
          } else if (cycle < 90) {
            sim.rotation += sim.rotSpeed * 0.3;
          } else if (cycle < 140) {
            sim.rotation -= sim.rotSpeed * 1.6;
          } else {
            sim.rotation += sim.rotSpeed * 0.5;
          }
        } else {
          sim.rotation += sim.rotSpeed;
        }
      }

      // 2. Update Flying Knife Physics
      if (sim.flyingKnife) {
        const fk = sim.flyingKnife;

        if (!fk.isColliding) {
          fk.y += fk.vy;

          // Impact threshold: knife tip hits outer rim of target
          // Target bottom rim = TARGET_CY + TARGET_RADIUS = 190 + 70 = 260
          // Sprite tip is 52px above fk.y. When fk.y <= 260 + 4, knife embeds!
          if (fk.y <= TARGET_CY + TARGET_RADIUS + 4) {
            // Collision Detection against already stuck blades
            // World hit angle at bottom of log is 90 degrees (Math.PI / 2)
            // Relative angle on the rotating log:
            const hitAngleDeg = ((90 - (sim.rotation * 180 / Math.PI)) % 360 + 360) % 360;

            // Angular collision check: 16 degrees tolerance
            const hasClashed = sim.stuckKnives.some((stuckAngle) => {
              let diff = Math.abs(stuckAngle - hitAngleDeg) % 360;
              if (diff > 180) diff = 360 - diff;
              return diff < 16.5;
            });

            if (hasClashed) {
              // METAL CLASH!
              audioManager.playClash();
              renderer.triggerShake(12);
              particles.createMetalSparks(TARGET_CX, TARGET_CY + TARGET_RADIUS, 32);

              // Knife deflects backwards
              fk.isColliding = true;
              fk.vy = 7;
              fk.vx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
              fk.vRot = (Math.random() > 0.5 ? 1 : -1) * 0.22;

              // Game Over
              setTimeout(() => {
                if (!sim.gameOverReported) {
                  sim.gameOverReported = true;
                  audioManager.playGameOver();
                  setGameState('game_over');
                  checkAndUpdateHighScore(sim.score);
                }
              }, 450);
            } else {
              // CLEAN HIT! Blade sticks deep into the wood
              audioManager.playImpact();
              renderer.triggerShake(5);
              particles.createImpactSplinters(TARGET_CX, TARGET_CY + TARGET_RADIUS, 16);

              sim.stuckKnives.push(hitAngleDeg);
              sim.score += 20;
              setScore(sim.score);
              checkAndUpdateHighScore(sim.score);

              // Check if all knives for this level are placed
              if (sim.knivesLeft === 0) {
                // STAGE CLEARED!
                sim.isShattered = true;
                audioManager.playLevelComplete();
                particles.createTargetShatter(TARGET_CX, TARGET_CY, TARGET_RADIUS);
                renderer.triggerShake(14);
                sim.score += 100; // Stage bonus
                setScore(sim.score);
                checkAndUpdateHighScore(sim.score);

                setTimeout(() => {
                  setGameState('stage_clear');
                  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                }, 750);
              }

              // Ready next throw
              sim.flyingKnife = null;
            }
          }
        } else {
          // Deflecting falling knife animation
          fk.x += fk.vx;
          fk.y += fk.vy;
          fk.vy += 0.45; // Gravity
          fk.tumbleAngle += fk.vRot;
        }
      }

      // 3. Update Particles & Shatter Pieces
      particles.update();

      // 4. Render Frame to Canvas
      renderer.clear();
      renderer.renderBackground(CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render rotating target log (if not shattered)
      if (!sim.isShattered) {
        renderer.renderTarget(TARGET_CX, TARGET_CY, TARGET_RADIUS, sim.rotation);
        renderer.renderStuckKnives(
          TARGET_CX,
          TARGET_CY,
          TARGET_RADIUS,
          sim.rotation,
          sim.stuckKnives
        );
      }

      // Render flying knife or deflecting knife
      if (sim.flyingKnife) {
        renderer.renderFlyingKnife(
          sim.flyingKnife.x,
          sim.flyingKnife.y,
          sim.flyingKnife.isColliding,
          sim.flyingKnife.tumbleAngle
        );
      }

      // Render ready knife at bottom (subtle idle bobbing animation)
      if (gameState === 'playing' && !sim.flyingKnife && sim.knivesLeft > 0 && !sim.isShattered) {
        const idleBob = Math.sin(sim.frameCount * 0.08) * 3;
        renderer.renderReadyKnife(TARGET_CX, READY_KNIFE_Y, idleBob);
      }

      // Render all wood splinters, sparks, and shatter pieces
      particles.render(renderer.ctx);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [gameState, checkAndUpdateHighScore]);

  // Initial Level Setup on mount
  useEffect(() => {
    initLevel(1, false);
  }, [initLevel]);

  return (
    <div className="w-full max-w-md mx-auto min-h-[640px] flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Arcade Cabinet Shell */}
      <div className="relative w-full max-w-[390px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Mobile Arcade HUD Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/40 flex items-center justify-center text-base shadow-sm">
              🗡️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-white uppercase">
                  {activeLevelConfig?.boss ? '👹 BOSS STAGE' : `STAGE ${currentLevel}/5`}
                </span>
                {activeLevelConfig?.boss && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                    DANGER
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {activeLevelConfig?.name || 'Target Range'}
              </p>
            </div>
          </div>

          {/* Right Controls: Score Badge, Mute, Exit */}
          <div className="flex items-center gap-1.5">
            {/* Live Score Pill */}
            <div className="px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center gap-1 text-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-emerald-400">{score}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-200" />}
            </button>

            {/* Exit to Platform */}
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="Exit Game"
              aria-label="Exit Game"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Central Arcade Gameplay Viewport */}
        <div
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          className="relative w-full aspect-[380/600] max-h-[600px] bg-[#050d14] flex items-center justify-center cursor-crosshair overflow-hidden touch-manipulation"
        >
          {/* Main 60FPS HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-contain"
          />

          {/* Left Vertical Knives Remaining Indicator Stack */}
          {gameState === 'playing' && (
            <div className="absolute left-3 bottom-20 flex flex-col-reverse gap-1.5 z-10 pointer-events-none">
              {Array.from({ length: totalKnivesForStage }).map((_, idx) => {
                const isReady = idx < knivesRemaining;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-7 rounded-sm flex items-center justify-center transition-all duration-200 ${
                      isReady
                        ? 'opacity-100 scale-100 drop-shadow-[0_0_4px_rgba(56,189,248,0.7)]'
                        : 'opacity-20 scale-75'
                    }`}
                  >
                    <svg viewBox="0 0 14 36" className="w-full h-full">
                      <path
                        d="M 7 2 L 11 12 L 10 24 L 4 24 L 3 12 Z"
                        fill={isReady ? '#e0f2fe' : '#475569'}
                        stroke={isReady ? '#38bdf8' : '#334155'}
                        strokeWidth="1"
                      />
                      {/* Guard */}
                      <rect x="2" y="24" width="10" height="3" rx="1" fill="#f59e0b" />
                      {/* Handle */}
                      <rect x="5" y="27" width="4" height="8" rx="1" fill="#1e293b" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Tap to Throw Action Pulse Target */}
          {gameState === 'playing' && (
            <div className="absolute bottom-3 left-0 right-0 px-6 z-10 flex flex-col items-center pointer-events-none">
              <div className="w-full max-w-[260px] py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-orange-500/30 to-rose-500/20 border border-orange-500/40 backdrop-blur flex items-center justify-center gap-2 shadow-lg animate-pulse">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-black text-amber-200 tracking-wider uppercase">
                  Tap Anywhere to Strike
                </span>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: START MENU                                        */}
          {/* ========================================================== */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400 p-0.5 shadow-2xl shadow-rose-600/40 mb-4 animate-bounce">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-4xl">
                  🗡️
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider mb-1 uppercase bg-gradient-to-r from-amber-200 via-white to-orange-200 bg-clip-text text-transparent">
                Blade Target
              </h1>
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-4">
                Arcade Wood Master
              </p>

              {/* High Score and Session Badges */}
              <div className="w-full max-w-[260px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-5 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Score:
                  </span>
                  <span className="font-mono font-bold text-amber-400">{highScore} pts</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Entry Fee:
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{entryFee} Credits</span>
                </div>
              </div>

              {/* How to Play Bullet Card */}
              <div className="w-full max-w-[260px] text-left text-[11px] text-slate-300 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 mb-6 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🎯</span>
                  <span>Tap screen to throw blades upwards</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400">⚡</span>
                  <span>Avoid hitting existing embedded blades</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">🪵</span>
                  <span>Shatter all 5 logs to defeat the Boss</span>
                </div>
              </div>

              {/* Tap to Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startNewGame();
                }}
                className="w-full max-w-[260px] min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Now</span>
              </button>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: STAGE CLEARED                                     */}
          {/* ========================================================== */}
          {gameState === 'stage_clear' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/20">
                ✨
              </div>

              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">
                Log Shattered!
              </span>
              <h2 className="text-2xl font-black text-white mb-1">
                STAGE {currentLevel} CLEARED
              </h2>
              <p className="text-xs text-amber-300 font-bold mb-5">
                +100 Stage Bonus Added!
              </p>

              <div className="w-full max-w-[240px] bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-6 text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Current Score:</span>
                  <span className="font-mono font-bold text-emerald-400">{score} pts</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Next Target:</span>
                  <span className="font-bold text-amber-400">
                    {levelManager.getLevelConfig(currentLevel + 1).name}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextStage();
                }}
                className="w-full max-w-[240px] min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: GAME OVER                                         */}
          {/* ========================================================== */}
          {gameState === 'game_over' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-rose-500/20">
                💥
              </div>

              <span className="text-xs font-black text-rose-400 uppercase tracking-widest mb-1">
                Blade Clashed!
              </span>
              <h2 className="text-2xl font-black text-white mb-4">
                GAME OVER
              </h2>

              <div className="w-full max-w-[250px] bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-5 text-xs">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Final Score:</span>
                  <span className="font-mono font-black text-white text-sm">{score}</span>
                </div>
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Best Record:</span>
                  <span className="font-mono font-bold text-amber-400">{highScore}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Stage Reached:</span>
                  <span className="font-bold text-cyan-400">Stage {currentLevel}</span>
                </div>
              </div>

              <div className="w-full max-w-[250px] flex flex-col gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                  className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExit();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit to Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: GRAND VICTORY (5 STAGES CLEARED)                  */}
          {/* ========================================================== */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-4xl mb-4 shadow-xl shadow-amber-500/30 animate-bounce">
                👑
              </div>

              <span className="text-xs font-black text-amber-400 uppercase tracking-widest mb-1">
                All 5 Boss Logs Defeated!
              </span>
              <h2 className="text-2xl font-black text-white mb-2">
                FOREST MASTER!
              </h2>
              <p className="text-xs text-emerald-400 font-bold mb-5">
                +{game?.winReward || 80} Demo Credits Awarded!
              </p>

              <div className="w-full max-w-[250px] bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 text-xs">
                <div className="flex justify-between text-slate-300 mb-1.5">
                  <span>Grand Score:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">{score}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>High Score:</span>
                  <span className="font-mono font-bold text-amber-400">{highScore}</span>
                </div>
              </div>

              <div className="w-full max-w-[250px] flex flex-col gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                  className="w-full min-h-[48px] py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>Play Master Run Again</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExit();
                  }}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Platform Session Footer */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
            <span className="font-mono text-slate-300 truncate">
              {session?.sessionId || 'GSESS-KNIFE'}
            </span>
          </div>
          <div className="text-right">
            <span>Entry: </span>
            <span className="text-amber-400 font-bold">{entryFee}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
