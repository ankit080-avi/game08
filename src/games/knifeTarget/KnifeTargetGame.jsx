import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  LogOut,
  Play,
  Volume2,
  VolumeX,
  Trophy,
  ArrowRight,
  ShieldAlert,
  Flame,
  Zap
} from 'lucide-react';
import { audioManager } from './AudioManager';
import { levelManager } from './LevelManager';
import { ParticleManager } from './ParticleManager';
import { GameRenderer } from './GameRenderer';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
  ? import.meta.env.BASE_URL
  : '/';
const BASE = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

const KNIFE_ASSETS = {
  bossSkull: `${BASE}games/knife-rain/boss_skull.png`,
  apple: `${BASE}games/knife-rain/apple.png`,
  knifeIcon: `${BASE}games/knife-rain/knife_icon.png`,
  logo: `${BASE}games/knife-rain/logo.png`,
  btnPlay: `${BASE}games/knife-rain/btn_play.png`,
};

// Virtual portrait canvas dimensions
const CANVAS_WIDTH = 380;
const CANVAS_HEIGHT = 600;
const TARGET_CX = CANVAS_WIDTH / 2; // 190
const TARGET_CY = 195;
const TARGET_RADIUS = 76;
const READY_KNIFE_Y = 515;
const THROW_SPEED = 28;

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
  const [applesCount, setApplesCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem('knife_rain_apples') || '0', 10);
    } catch (_) {
      return 0;
    }
  });
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('knife_rain_high_score') || '0', 10);
    } catch (_) {
      return 0;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [knivesRemaining, setKnivesRemaining] = useState(7);
  const [totalKnivesForStage, setTotalKnivesForStage] = useState(7);
  const [activeLevelConfig, setActiveLevelConfig] = useState(null);
  const [showBossBanner, setShowBossBanner] = useState(false);

  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(new ParticleManager());
  const touchHandledRef = useRef(false);

  // 60FPS simulation ref to avoid React render lag
  const simRef = useRef({
    rotation: 0,
    rotSpeed: 0.03,
    direction: 1,
    frameCount: 0,
    stuckKnives: [],
    apples: [],
    flyingKnife: null,
    isShattered: false,
    levelConfig: null,
    knivesLeft: 7,
    score: 0,
    applesCollected: 0,
    gameOverReported: false
  });

  const handleToggleMute = useCallback(() => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const checkAndUpdateHighScore = useCallback((currentScore) => {
    setHighScore((prev) => {
      if (currentScore > prev) {
        try {
          localStorage.setItem('knife_rain_high_score', currentScore.toString());
        } catch (_) {}
        return currentScore;
      }
      return prev;
    });
  }, []);

  const addApples = useCallback((count = 2) => {
    setApplesCount((prev) => {
      const next = prev + count;
      try {
        localStorage.setItem('knife_rain_apples', next.toString());
      } catch (_) {}
      return next;
    });
  }, []);

  // Initialize a specific stage
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
    sim.apples = [...config.apples];
    sim.flyingKnife = null;
    sim.isShattered = false;
    sim.gameOverReported = false;
    sim.rotation = 0;
    sim.direction = 1;
    sim.frameCount = 0;
    sim.rotSpeed = config.baseSpeed;

    if (config.boss) {
      setShowBossBanner(true);
      audioManager.playBossStart();
      setTimeout(() => setShowBossBanner(false), 2200);
    } else {
      setShowBossBanner(false);
    }

    if (!keepScore) {
      sim.score = 0;
      setScore(0);
    }
  }, []);

  const startNewGame = useCallback(() => {
    audioManager.playButton();
    initLevel(1, false);
    setGameState('playing');
  }, [initLevel]);

  const handleRestart = useCallback(() => {
    startNewGame();
  }, [startNewGame]);

  const handleThrow = useCallback(() => {
    const sim = simRef.current;
    if (gameState !== 'playing') return;
    if (sim.isShattered) return;
    if (sim.flyingKnife) return; // wait for current knife to reach target
    if (sim.knivesLeft <= 0) return;

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

  const handleInteraction = useCallback((e) => {
    if (e) {
      if (e.type === 'touchstart') {
        touchHandledRef.current = true;
        setTimeout(() => {
          touchHandledRef.current = false;
        }, 250);
      } else if (e.type === 'click' && touchHandledRef.current) {
        return;
      }
    }
    handleThrow();
  }, [handleThrow]);

  const handleNextStage = useCallback(() => {
    audioManager.playButton();
    const nextLvl = currentLevel + 1;
    if (nextLvl > 5) {
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

      // 1. Target Rotation Dynamics
      if (!sim.isShattered && sim.levelConfig) {
        const pattern = sim.levelConfig.pattern;
        if (pattern === 'constant') {
          sim.rotation += sim.rotSpeed;
        } else if (pattern === 'reversing') {
          sim.rotation += Math.sin(sim.frameCount * 0.025) * sim.rotSpeed * 1.6;
        } else if (pattern === 'oscillate') {
          sim.rotation += (Math.cos(sim.frameCount * 0.035) + 0.3) * sim.rotSpeed * 1.5;
        } else if (pattern === 'erratic') {
          const cycle = sim.frameCount % 180;
          if (cycle < 60) {
            sim.rotation += sim.rotSpeed * 1.9;
          } else if (cycle < 90) {
            sim.rotation += sim.rotSpeed * 0.2;
          } else if (cycle < 140) {
            sim.rotation -= sim.rotSpeed * 1.7;
          } else {
            sim.rotation += sim.rotSpeed * 0.4;
          }
        } else {
          sim.rotation += sim.rotSpeed;
        }
      }

      // 2. Flying Knife Physics & Collision
      if (sim.flyingKnife) {
        const fk = sim.flyingKnife;

        if (!fk.isColliding) {
          fk.y += fk.vy;

          // Check if tip strikes the target perimeter (TARGET_CY + TARGET_RADIUS)
          if (fk.y <= TARGET_CY + TARGET_RADIUS + 2) {
            // Hit angle in target's local rotating reference frame
            const hitAngleDeg = ((90 - (sim.rotation * 180 / Math.PI)) % 360 + 360) % 360;

            // A) Check Apple Slices (tolerance ~15 deg)
            const appleHitIndex = sim.apples.findIndex((appleAngle) => {
              let diff = Math.abs(appleAngle - hitAngleDeg) % 360;
              if (diff > 180) diff = 360 - diff;
              return diff < 15;
            });

            if (appleHitIndex !== -1) {
              // Slice Apple!
              audioManager.playApple();
              particles.createAppleSlice(TARGET_CX, TARGET_CY + TARGET_RADIUS);
              sim.apples.splice(appleHitIndex, 1);
              sim.score += 2;
              setScore(sim.score);
              addApples(2);
            }

            // B) Check Knife Clash (tolerance ~16 deg)
            const hasClashed = sim.stuckKnives.some((stuckAngle) => {
              let diff = Math.abs(stuckAngle - hitAngleDeg) % 360;
              if (diff > 180) diff = 360 - diff;
              return diff < 16.5;
            });

            if (hasClashed) {
              // Metal Clash!
              audioManager.playClash();
              renderer.triggerShake(14);
              particles.createMetalSparks(TARGET_CX, TARGET_CY + TARGET_RADIUS, 30);

              fk.isColliding = true;
              fk.vy = 8;
              fk.vx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 3);
              fk.vRot = (Math.random() > 0.5 ? 1 : -1) * 0.22;

              setTimeout(() => {
                if (!sim.gameOverReported) {
                  sim.gameOverReported = true;
                  audioManager.playGameOver();
                  setGameState('game_over');
                  checkAndUpdateHighScore(sim.score);
                }
              }, 480);
            } else {
              // Clean Hit into Target!
              audioManager.playImpact();
              renderer.triggerShake(5);
              particles.createImpactSplinters(TARGET_CX, TARGET_CY + TARGET_RADIUS, 14);

              sim.stuckKnives.push(hitAngleDeg);
              sim.score += 1;
              setScore(sim.score);
              checkAndUpdateHighScore(sim.score);

              // Check if all knives placed for this stage
              if (sim.knivesLeft === 0) {
                sim.isShattered = true;
                audioManager.playLevelComplete();
                particles.createTargetShatter(TARGET_CX, TARGET_CY, TARGET_RADIUS);
                renderer.triggerShake(16);
                sim.score += 50; // Stage bonus
                setScore(sim.score);
                checkAndUpdateHighScore(sim.score);

                setTimeout(() => {
                  setGameState('stage_clear');
                  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
                }, 750);
              }

              sim.flyingKnife = null;
            }
          }
        } else {
          // Deflecting falling knife
          fk.x += fk.vx;
          fk.y += fk.vy;
          fk.vy += 0.45;
          fk.tumbleAngle += fk.vRot;
        }
      }

      // 3. Update Particles
      particles.update();

      // 4. Render Canvas Frame
      renderer.clear();
      renderer.renderBackground(CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render rotating target
      if (!sim.isShattered) {
        renderer.renderTarget(
          TARGET_CX,
          TARGET_CY,
          TARGET_RADIUS,
          sim.rotation,
          sim.levelConfig?.targetType || 'wood'
        );
        renderer.renderApples(
          TARGET_CX,
          TARGET_CY,
          TARGET_RADIUS,
          sim.rotation,
          sim.apples
        );
        renderer.renderStuckKnives(
          TARGET_CX,
          TARGET_CY,
          TARGET_RADIUS,
          sim.rotation,
          sim.stuckKnives
        );
      }

      // Render flying knife
      if (sim.flyingKnife) {
        renderer.renderFlyingKnife(
          sim.flyingKnife.x,
          sim.flyingKnife.y,
          sim.flyingKnife.isColliding,
          sim.flyingKnife.tumbleAngle
        );
      }

      // Render ready knife at bottom
      if (gameState === 'playing' && !sim.flyingKnife && sim.knivesLeft > 0 && !sim.isShattered) {
        const idleBob = Math.sin(sim.frameCount * 0.08) * 3;
        renderer.renderReadyKnife(TARGET_CX, READY_KNIFE_Y, idleBob);
      }

      // Render all splinters, sparks, shattered pieces, and sliced apples
      particles.render(renderer.ctx, renderer.assets);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [gameState, checkAndUpdateHighScore, addApples]);

  useEffect(() => {
    initLevel(1, false);
  }, [initLevel]);

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] md:h-auto md:min-h-[640px] md:max-w-md mx-auto flex flex-col items-center justify-between select-none overflow-hidden pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      {/* Knife Rain Outer Shell */}
      <div className="relative w-full h-full flex-1 flex flex-col justify-between bg-[#040e16] md:max-w-[390px] md:rounded-3xl md:border-2 md:border-slate-800/80 md:shadow-2xl overflow-hidden">
        
        {/* Top Header Utilities (Mute, Session ID, Exit) */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/70 border-b border-slate-800/60 z-20 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">{session?.sessionId || 'GSESS-KNIFE'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
            </button>

            <button
              onClick={onExit}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer min-h-[36px] flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Main Viewport Container */}
        <div
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          className="relative flex-1 w-full min-h-0 bg-[#03111c] flex items-center justify-center cursor-pointer overflow-hidden touch-none"
        >
          {/* Main 60FPS HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full max-h-full max-w-full object-contain"
          />

          {/* ========================================================== */}
          {/* AUTHENTIC KNIFE RAIN TOP HUD                              */}
          {/* ========================================================== */}
          {gameState === 'playing' && (
            <div className="absolute top-3 left-0 right-0 px-4 flex items-start justify-between pointer-events-none z-10">
              {/* Top Left: Score */}
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white tracking-tight drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                  {score}
                </span>
              </div>

              {/* Top Center: Stage Dots Indicator */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-700/50 shadow-md">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isPassed = lvl < currentLevel;
                    const isCurrent = lvl === currentLevel;
                    const isBoss = lvl === 5;

                    return (
                      <div key={lvl} className="flex items-center justify-center">
                        {isBoss ? (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'scale-125 drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                                : isPassed
                                ? 'opacity-60'
                                : 'opacity-30'
                            }`}
                          >
                            <img
                              src={KNIFE_ASSETS.bossSkull}
                              alt="Boss"
                              className="w-4 h-4 object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              isCurrent
                                ? 'bg-amber-400 scale-125 shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                                : isPassed
                                ? 'bg-emerald-400'
                                : 'bg-slate-600/70'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-wider drop-shadow-md ${activeLevelConfig?.boss ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                  {activeLevelConfig?.name || `STAGE ${currentLevel}`}
                </span>
              </div>

              {/* Top Right: Apple Counter */}
              <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-700/50 shadow-md">
                <img
                  src={KNIFE_ASSETS.apple}
                  alt="Apples"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-mono font-bold text-amber-300 text-sm drop-shadow">
                  {applesCount}
                </span>
              </div>
            </div>
          )}

          {/* Left Vertical Knives Stack */}
          {gameState === 'playing' && (
            <div className="absolute left-4 bottom-20 flex flex-col-reverse gap-1.5 z-10 pointer-events-none">
              {Array.from({ length: totalKnivesForStage }).map((_, idx) => {
                const isReady = idx < knivesRemaining;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-6 flex items-center justify-center transition-all duration-150 ${
                      isReady
                        ? 'opacity-100 scale-100 drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]'
                        : 'opacity-15 scale-75 grayscale'
                    }`}
                  >
                    <img
                      src={KNIFE_ASSETS.knifeIcon}
                      alt="Knife"
                      className="w-full h-full object-contain"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Boss Incoming Dramatic Banner */}
          {showBossBanner && (
            <div className="absolute top-1/3 left-0 right-0 py-3 bg-gradient-to-r from-rose-900/90 via-red-600/90 to-rose-900/90 border-y-2 border-amber-400 flex flex-col items-center justify-center z-20 shadow-2xl animate-pulse">
              <span className="text-[11px] font-black text-amber-300 tracking-widest uppercase">
                WARNING
              </span>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-lg">
                BOSS STAGE!
              </h2>
            </div>
          )}

          {/* Bottom Tap to Throw Guide */}
          {gameState === 'playing' && (
            <div className="absolute bottom-4 left-0 right-0 px-6 z-10 flex flex-col items-center pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-slate-950/60 border border-slate-700/60 backdrop-blur text-[11px] font-bold text-slate-300 flex items-center gap-1.5 shadow-lg animate-pulse">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>TAP ANYWHERE TO THROW</span>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: START MENU (1:1 KNIFE RAIN AESTHETIC)            */}
          {/* ========================================================== */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              {/* Authentic Knife Rain Logo */}
              <div className="w-64 max-w-full mb-6 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] animate-bounce">
                <img
                  src={KNIFE_ASSETS.logo}
                  alt="Knife Rain"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Best Score & Apple Stats Card */}
              <div className="w-full max-w-[240px] bg-slate-900/90 border border-slate-800 rounded-2xl p-3 mb-6 shadow-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best Score:
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{highScore}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1 font-semibold">
                    <img src={KNIFE_ASSETS.apple} alt="" className="w-3.5 h-3.5 object-contain" /> Apples:
                  </span>
                  <span className="font-mono font-bold text-rose-400 text-sm">{applesCount}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Entry Fee:
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{entryFee} Credits</span>
                </div>
              </div>

              {/* Authentic Play Pill Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startNewGame();
                }}
                className="w-44 max-w-full min-h-[50px] hover:scale-105 active:scale-95 transition-all filter drop-shadow-[0_8px_20px_rgba(34,197,94,0.5)] cursor-pointer flex items-center justify-center"
                aria-label="Play Knife Rain"
              >
                <img
                  src={KNIFE_ASSETS.btnPlay}
                  alt="Play"
                  className="w-full h-auto object-contain"
                />
              </button>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: STAGE CLEARED                                     */}
          {/* ========================================================== */}
          {gameState === 'stage_clear' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl mb-2 shadow-lg shadow-emerald-500/20">
                ✨
              </div>

              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-0.5">
                Target Shattered!
              </span>
              <h2 className="text-2xl font-black text-white mb-1">
                STAGE {currentLevel} CLEARED
              </h2>
              <p className="text-xs text-amber-300 font-bold mb-4">
                +50 Stage Bonus Added!
              </p>

              <div className="w-full max-w-[230px] bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-5 text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Score:</span>
                  <span className="font-mono font-bold text-emerald-400">{score}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Next:</span>
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
                className="w-full max-w-[210px] min-h-[46px] py-2.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
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
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl mb-2 shadow-lg shadow-rose-500/20">
                💥
              </div>

              <span className="text-xs font-black text-rose-400 uppercase tracking-widest mb-0.5">
                Blade Clashed!
              </span>
              <h2 className="text-2xl font-black text-white mb-3">
                GAME OVER
              </h2>

              <div className="w-full max-w-[240px] bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-5 text-xs">
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Score:</span>
                  <span className="font-mono font-black text-white text-base">{score}</span>
                </div>
                <div className="flex justify-between text-slate-400 mb-1.5">
                  <span>Best Record:</span>
                  <span className="font-mono font-bold text-amber-400">{highScore}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Apples:</span>
                  <span className="font-mono font-bold text-rose-400 flex items-center gap-1">
                    <img src={KNIFE_ASSETS.apple} alt="" className="w-3 h-3 object-contain" />
                    {applesCount}
                  </span>
                </div>
              </div>

              <div className="w-full max-w-[240px] flex flex-col items-center gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                  className="w-40 min-h-[46px] hover:scale-105 active:scale-95 transition-all filter drop-shadow-[0_6px_16px_rgba(34,197,94,0.5)] cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={KNIFE_ASSETS.btnPlay}
                    alt="Play Again"
                    className="w-full h-auto object-contain"
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExit();
                  }}
                  className="w-full min-h-[40px] py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* OVERLAY: GRAND VICTORY (5 STAGES CLEARED)                  */}
          {/* ========================================================== */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-3xl mb-3 shadow-xl shadow-amber-500/30 animate-bounce">
                👑
              </div>

              <span className="text-xs font-black text-amber-400 uppercase tracking-widest mb-0.5">
                Robot Boss Defeated!
              </span>
              <h2 className="text-2xl font-black text-white mb-1">
                KNIFE RAIN MASTER!
              </h2>
              <p className="text-xs text-emerald-400 font-bold mb-4">
                +{game?.winReward || 80} Demo Credits Awarded!
              </p>

              <div className="w-full max-w-[240px] bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-5 text-xs">
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Grand Score:</span>
                  <span className="font-mono font-black text-emerald-400 text-base">{score}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Apples:</span>
                  <span className="font-mono font-bold text-rose-400">{applesCount}</span>
                </div>
              </div>

              <div className="w-full max-w-[240px] flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>Play Again</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExit();
                  }}
                  className="w-full min-h-[40px] py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

