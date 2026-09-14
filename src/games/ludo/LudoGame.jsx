import React, { useState, useEffect, useRef } from 'react';
import { useLudoEngine } from './hooks/useLudoEngine.js';
import { LudoGameViewport } from './LudoGameViewport.jsx';
import { LudoBoard } from './LudoBoard.jsx';
import { LudoDice } from './LudoDice.jsx';
import { LudoToken } from './LudoToken.jsx';
import { GameResult } from './GameResult.jsx';
import { TURN_PHASE } from './engine/gameState.js';
import { ludoAudio } from './ludoAudio.js';
import { useWallet } from '../../context/WalletContext.jsx';
import { LudoHomeScreen } from './screens/LudoHomeScreen.jsx';
import { LudoSelectPlayersModal } from './screens/LudoSelectPlayersModal.jsx';
import { LudoSelectModeModal } from './screens/LudoSelectModeModal.jsx';
import { LudoSettingsModal } from './screens/LudoSettingsModal.jsx';
import { AlertTriangle, Maximize2, Minimize2, Volume2, VolumeX, Settings } from 'lucide-react';

/**
 * Master Ludo Game Coordinator
 *
 * Implements:
 * - Dedicated <LudoGameViewport> enforcing 9:16 mobile portrait viewport on desktop.
 * - Screen Navigation: Home Screen -> Player Selection -> Mode Selection -> Match -> Result.
 * - Top: Centered mobile game circular Back Button (↩) + Top-right Bot control box.
 * - Center: Large 1:1 Ludo Board with exact 15×15 coordinate token overlay.
 * - Bottom: Player control box (Blue Pin + 3D Dice + Animated pointer arrow) + Fullscreen button.
 * - Authoritative Turn State Machine with zero game logic modifications.
 */
export const LudoGame = ({
  onExit,
  onWin,
  user,
  session,
  entryFee = 100,
  onOpenAddCredits
}) => {
  const walletContext = useWallet();
  const balance = walletContext?.balance ?? 0;

  // Screen State
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'playing'
  const [activeModal, setActiveModal] = useState(null); // 'select-players' | 'select-online-mode' | 'settings' | null
  const [selectedVsMode, setSelectedVsMode] = useState('2P'); // '2P' | '4P'
  const [selectedOnlineMode, setSelectedOnlineMode] = useState('1v1'); // '1v1' | '2v2'

  const [showSettings, setShowSettings] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Audio toggles with localStorage persistence
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('ludo_sound_enabled') !== 'false';
    }
    return true;
  });
  const [musicOn, setMusicOn] = useState(true);
  const [animationsOn, setAnimationsOn] = useState(true);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      ludoAudio.setMuted(!next);
      if (next) ludoAudio.playButtonClick();
      return next;
    });
  };

  // Authoritative Ludo Engine Hook
  const {
    gameState,
    feedbackNotice,
    movingTokenId,
    animatingToken,
    captureImpact,
    safeLandingImpact,
    extraTurnNotice,
    rollDice,
    selectToken,
    restartMatch,
    clearAllTimers
  } = useLudoEngine({
    username: user?.username || 'YOU',
    mode: selectedVsMode,
    onWin,
    entryFee
  });

  const {
    activePlayerId,
    turnPhase,
    diceValue,
    isDiceRolling,
    validMoveTokenIds,
    tokens,
    players,
    winnerId,
    gameStatus,
    currentTurnIndex
  } = gameState;

  const isHumanTurn = activePlayerId === 'blue';
  const canHumanRoll = isHumanTurn && turnPhase === TURN_PHASE.READY && !isDiceRolling;

  // -------------------------------------------------------------
  // NON-BLOCKING CONTEXTUAL FEEDBACK (ANTI-SPAM & DEDUPLICATION)
  // -------------------------------------------------------------
  const [showGameStart, setShowGameStart] = useState(false);
  const [showYourTurnBadge, setShowYourTurnBadge] = useState(false);
  const [playerDiceBadge, setPlayerDiceBadge] = useState(null);
  const [botDiceBadge, setBotDiceBadge] = useState(null);

  const hasShownGameStartRef = useRef(false);
  const lastProcessedTurnRef = useRef(-1);
  const lastProcessedExtraTurnRef = useRef(null);
  const lastProcessedSixRef = useRef(null);
  const yourTurnTimerRef = useRef(null);
  const playerDiceBadgeTimerRef = useRef(null);
  const botDiceBadgeTimerRef = useRef(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (yourTurnTimerRef.current) clearTimeout(yourTurnTimerRef.current);
      if (playerDiceBadgeTimerRef.current) clearTimeout(playerDiceBadgeTimerRef.current);
      if (botDiceBadgeTimerRef.current) clearTimeout(botDiceBadgeTimerRef.current);
    };
  }, []);

  // 1. One-time match start animation per match launch
  const triggerMatchStartIntro = () => {
    setShowGameStart(true);
    setTimeout(() => setShowGameStart(false), 900);
  };

  // 2. YOUR TURN badge: triggers ONCE per turn transition to player, stays 850ms, then fades out
  useEffect(() => {
    if (currentScreen === 'playing' && isHumanTurn && currentTurnIndex !== lastProcessedTurnRef.current && gameStatus === 'IN_PROGRESS') {
      lastProcessedTurnRef.current = currentTurnIndex;
      setShowYourTurnBadge(true);
      if (yourTurnTimerRef.current) clearTimeout(yourTurnTimerRef.current);
      yourTurnTimerRef.current = setTimeout(() => setShowYourTurnBadge(false), 850);
    }
  }, [currentScreen, isHumanTurn, currentTurnIndex, gameStatus]);

  // 3. Contextual Dice Badges (Extra Turn or 6) anchored right next to active dice
  useEffect(() => {
    if (currentScreen !== 'playing') return;

    if (extraTurnNotice?.timestamp && extraTurnNotice.timestamp !== lastProcessedExtraTurnRef.current) {
      lastProcessedExtraTurnRef.current = extraTurnNotice.timestamp;
      const isSix = extraTurnNotice.reason === 'Rolled 6' || extraTurnNotice.reason === 'Left Yard';
      const badgeData = {
        id: extraTurnNotice.timestamp,
        text: isSix ? '+1 ROLL' : 'EXTRA TURN',
        icon: isSix ? '✨' : '⭐'
      };

      if (isHumanTurn) {
        setPlayerDiceBadge(badgeData);
        if (playerDiceBadgeTimerRef.current) clearTimeout(playerDiceBadgeTimerRef.current);
        playerDiceBadgeTimerRef.current = setTimeout(() => setPlayerDiceBadge(null), 850);
      } else {
        setBotDiceBadge(badgeData);
        if (botDiceBadgeTimerRef.current) clearTimeout(botDiceBadgeTimerRef.current);
        botDiceBadgeTimerRef.current = setTimeout(() => setBotDiceBadge(null), 850);
      }
      return;
    }

    const sixKey = `${currentTurnIndex}-six-${activePlayerId}`;
    if (diceValue === 6 && !isDiceRolling && lastProcessedSixRef.current !== sixKey && gameStatus === 'IN_PROGRESS') {
      lastProcessedSixRef.current = sixKey;
      const badgeData = {
        id: Date.now(),
        text: '6!',
        icon: '🎲'
      };

      if (isHumanTurn) {
        setPlayerDiceBadge(badgeData);
        if (playerDiceBadgeTimerRef.current) clearTimeout(playerDiceBadgeTimerRef.current);
        playerDiceBadgeTimerRef.current = setTimeout(() => setPlayerDiceBadge(null), 850);
      } else {
        setBotDiceBadge(badgeData);
        if (botDiceBadgeTimerRef.current) clearTimeout(botDiceBadgeTimerRef.current);
        botDiceBadgeTimerRef.current = setTimeout(() => setBotDiceBadge(null), 850);
      }
    }
  }, [currentScreen, extraTurnNotice, diceValue, isDiceRolling, isHumanTurn, currentTurnIndex, activePlayerId, gameStatus]);

  // Handle Exit Request during match
  const handleExitRequest = () => {
    ludoAudio.playButtonClick();
    if (gameStatus === 'IN_PROGRESS') {
      setShowExitConfirm(true);
    } else {
      executeExitToHome();
    }
  };

  const executeExitToHome = () => {
    clearAllTimers();
    setCurrentScreen('home');
    setShowExitConfirm(false);
  };

  // Launch Match from Home Screen
  const handleStartMatch = (modeToStart = selectedVsMode) => {
    hasShownGameStartRef.current = false;
    lastProcessedTurnRef.current = -1;
    lastProcessedExtraTurnRef.current = null;
    lastProcessedSixRef.current = null;
    triggerMatchStartIntro();
    restartMatch(modeToStart);
    setCurrentScreen('playing');
  };

  return (
    <LudoGameViewport>
      {({ isFullscreen, toggleFullscreen }) => (
        <div className="relative w-full h-full flex flex-col justify-between select-none">
          {/* ========================================================= */}
          {/* VIEW A: LUDO HOME SCREEN                                  */}
          {/* ========================================================= */}
          {currentScreen === 'home' ? (
            <LudoHomeScreen
              username={user?.username || 'Guest1234'}
              balance={balance}
              onOpenAddCredits={onOpenAddCredits}
              onOpenSettings={() => {
                ludoAudio.playButtonClick();
                setActiveModal('settings');
              }}
              onOpenVsComputer={() => {
                ludoAudio.playButtonClick();
                setActiveModal('select-players');
              }}
              onOpenOnlineMultiplayer={() => {
                ludoAudio.playButtonClick();
                setActiveModal('select-online-mode');
              }}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              onExitToDashboard={() => {
                clearAllTimers();
                if (onExit) onExit();
              }}
            />
          ) : (
            /* ========================================================= */
            /* VIEW B: ACTIVE LUDO MATCH SCREEN                         */
            /* ========================================================= */
            <div className="relative w-full h-full flex flex-col justify-between py-2 px-2 select-none">
              {/* One-Time Match Start Intro (900ms, non-repeating) */}
              {showGameStart && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none animate-game-start-intro">
                  <div className="bg-slate-950/90 border-2 border-amber-400/90 px-5 py-2 rounded-2xl shadow-[0_0_24px_rgba(245,158,11,0.8)] text-amber-300 font-black text-xs uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm">
                    <span>🎲</span>
                    <span>MATCH START</span>
                    <span>🎲</span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TOP SECTION: Controls Bar & Floating Bot HUD             */}
              {/* ========================================================= */}
              <div className="w-full flex flex-col gap-1.5 shrink-0 z-20 pt-1">
                {/* Top Bar: Sound, Back (center), Settings circular controls */}
                <div className="w-full flex items-center justify-between px-2 pt-0.5 pb-0.5 relative z-20">
                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label={soundOn ? 'Mute Sound' : 'Unmute Sound'}
                    className="w-10 h-10 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title={soundOn ? 'Sound On' : 'Sound Off'}
                  >
                    {soundOn ? (
                      <Volume2 className="w-5 h-5 text-amber-400" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Centered Circular Back button returning to Menu */}
                  <button
                    type="button"
                    onClick={handleExitRequest}
                    aria-label="Back to Menu"
                    className="w-11 h-11 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="Back to Menu"
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

                  {/* Settings Button */}
                  <button
                    type="button"
                    onClick={() => {
                      ludoAudio.playButtonClick();
                      setShowSettings(true);
                    }}
                    aria-label="Game Settings"
                    className="w-10 h-10 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5 text-amber-400" />
                  </button>
                </div>

                {/* Sub-row: Top-Right Bot Control Box (aligned with Opponent Base) */}
                <div className="w-full flex justify-end px-2 pt-0.5">
                  <div className="relative">
                    {/* Contextual indicator near Bot's Dice */}
                    {botDiceBadge && !isHumanTurn && (
                      <div className="absolute -top-6 left-1 z-30 pointer-events-none animate-badge-fade">
                        <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-white flex items-center gap-1">
                          {botDiceBadge.icon && <span>{botDiceBadge.icon}</span>}
                          <span>{botDiceBadge.text}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 border-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.6)] ${
                        !isHumanTurn
                          ? 'border-emerald-400 ring-2 ring-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.6)]'
                          : 'border-amber-400/80 opacity-90'
                      }`}
                    >
                      {/* Left Tile: Bot's Dice */}
                      <LudoDice
                        value={!isHumanTurn ? diceValue : 1}
                        isRolling={isDiceRolling && !isHumanTurn}
                        canRoll={false}
                        playerColor={activePlayerId !== 'blue' ? activePlayerId : 'green'}
                        size="normal"
                      />

                      {/* Right Tile: Bot Avatar / Token Box */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border border-sky-300/50 flex flex-col items-center justify-center shrink-0 shadow-inner py-0.5">
                        <LudoToken color={activePlayerId !== 'blue' ? activePlayerId : 'green'} size="slot" />
                        <span className="text-[9px] font-black text-white uppercase tracking-wider leading-none mt-1 drop-shadow-sm">
                          {activePlayerId !== 'blue' ? activePlayerId.toUpperCase() : 'BOT'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* CENTER SECTION: Large 1:1 Physical Ludo Board             */}
              {/* ========================================================= */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0 py-0.5">
                <LudoBoard
                  tokens={tokens}
                  activeColor={activePlayerId}
                  validMoveTokenIds={validMoveTokenIds}
                  movingTokenId={movingTokenId}
                  animatingToken={animatingToken}
                  captureImpact={captureImpact}
                  safeLandingImpact={safeLandingImpact}
                  onSelectToken={selectToken}
                  canInteract={isHumanTurn && turnPhase === TURN_PHASE.PLAYER_SELECTING_TOKEN}
                  diceValue={diceValue}
                />
              </div>

              {/* ========================================================= */}
              {/* BOTTOM SECTION: Turn Guidance & Player Box                */}
              {/* ========================================================= */}
              <div className="w-full flex flex-col gap-1 shrink-0 z-20 pb-1">
                {/* Turn Guidance Bar */}
                <div className="w-full flex items-center justify-center min-h-[28px]">
                  {feedbackNotice ? (
                    <div className="px-3.5 py-0.5 rounded-full bg-slate-950/90 border border-amber-400/80 text-amber-300 text-[11px] font-black uppercase tracking-wider shadow animate-in fade-in">
                      {feedbackNotice}
                    </div>
                  ) : canHumanRoll ? (
                    <button
                      type="button"
                      onClick={rollDice}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      disabled={!canHumanRoll || isDiceRolling}
                      className="px-5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-[0_0_18px_rgba(245,158,11,0.7)] active:scale-95 cursor-pointer border border-amber-200"
                    >
                      🎲 TAP DICE TO ROLL
                    </button>
                  ) : turnPhase === TURN_PHASE.PLAYER_SELECTING_TOKEN ? (
                    <div className="px-4 py-1 rounded-full bg-sky-950/90 border border-sky-400 text-sky-300 text-[11px] font-black tracking-wide shadow animate-bounce">
                      👉 TAP A HIGHLIGHTED TOKEN
                    </div>
                  ) : isHumanTurn && isDiceRolling ? (
                    <div className="text-[11px] font-bold text-amber-300 tracking-wider animate-pulse">
                      🎲 ROLLING...
                    </div>
                  ) : !isHumanTurn ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold tracking-wide shadow-sm animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>
                        {turnPhase === TURN_PHASE.BOT_THINKING
                          ? 'BOT THINKING...'
                          : turnPhase === TURN_PHASE.BOT_ROLLING
                          ? 'BOT ROLLING...'
                          : turnPhase === TURN_PHASE.BOT_MOVING || turnPhase === TURN_PHASE.BOT_SELECTING_TOKEN
                          ? 'BOT MOVING PIECE...'
                          : "BOT'S TURN..."}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-semibold text-slate-400 tracking-wider">
                      WAITING...
                    </div>
                  )}
                </div>

                {/* Control Row: Player Box on Left, Fullscreen on Right */}
                <div className="w-full flex items-end justify-between px-2">
                  {/* Bottom-Left: Player Control Box (aligned with Blue Yard) */}
                  <div className="relative">
                    {/* 'YOUR TURN' badge */}
                    {showYourTurnBadge && isHumanTurn && (
                      <div className="absolute -top-7 left-1 z-30 pointer-events-none animate-badge-fade">
                        <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-[0_0_12px_rgba(245,158,11,0.8)] border border-white flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>YOUR TURN</span>
                        </div>
                      </div>
                    )}

                    {/* Extra Turn / 6 Badge near Player's Dice */}
                    {playerDiceBadge && isHumanTurn && (
                      <div className="absolute -top-6 right-1 z-30 pointer-events-none animate-badge-fade">
                        <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.8)] border border-white flex items-center gap-1">
                          {playerDiceBadge.icon && <span>{playerDiceBadge.icon}</span>}
                          <span>{playerDiceBadge.text}</span>
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/90 border-2 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.6)] ${
                        isHumanTurn
                          ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.55)]'
                          : 'border-amber-400'
                      }`}
                    >
                      {/* Left Tile: Player Avatar / Token Box with YOU label */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border border-sky-300/50 flex flex-col items-center justify-center shrink-0 shadow-inner py-0.5">
                        <LudoToken color="blue" size="slot" />
                        <span className="text-[9px] font-black text-white uppercase tracking-wider leading-none mt-1 drop-shadow-sm">
                          YOU
                        </span>
                      </div>

                      {/* Right Tile: Player's Dice */}
                      <LudoDice
                        value={isHumanTurn ? diceValue : 1}
                        isRolling={isDiceRolling && isHumanTurn}
                        canRoll={canHumanRoll}
                        onRoll={rollDice}
                        playerColor="blue"
                        size="normal"
                        showArrow={false}
                      />
                    </div>
                  </div>

                  {/* Bottom-Right: Fullscreen Toggle Button */}
                  <div className="flex flex-col items-end gap-1.5 pb-1">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                      className="w-10 h-10 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-400/20 via-slate-950 to-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Exit Confirmation Dialog */}
              {showExitConfirm && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-xs rounded-3xl bg-slate-900 border-2 border-amber-400/80 p-5 shadow-2xl text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white uppercase tracking-wide">Leave Match?</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Return to the main menu? Your active game progress will be forfeited.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowExitConfirm(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer active:scale-95"
                      >
                        CONTINUE
                      </button>
                      <button
                        type="button"
                        onClick={executeExitToHome}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer active:scale-95"
                      >
                        EXIT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Result Screen */}
              <GameResult
                isOpen={gameStatus === 'GAME_OVER'}
                isWinner={winnerId === 'blue'}
                winnerName={winnerId === 'blue' ? 'YOU' : 'BOT'}
                score={180}
                onPlayAgain={() => handleStartMatch(selectedVsMode)}
                onExit={executeExitToHome}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* MODALS: Modals rendered on top with dark backdrops        */}
          {/* ========================================================= */}

          {/* 1. SELECT PLAYERS MODAL (VS Computer Flow) */}
          <LudoSelectPlayersModal
            isOpen={activeModal === 'select-players'}
            selectedMode={selectedVsMode}
            onSelectMode={(mode) => setSelectedVsMode(mode)}
            onBack={() => setActiveModal(null)}
            onNext={() => {
              setActiveModal(null);
              handleStartMatch(selectedVsMode);
            }}
          />

          {/* 2. SELECT MODE MODAL (Online Multiplayer Flow) */}
          <LudoSelectModeModal
            isOpen={activeModal === 'select-online-mode'}
            selectedMode={selectedOnlineMode}
            onSelectMode={(modeId) => setSelectedOnlineMode(modeId)}
            onBack={() => setActiveModal(null)}
            onLaunchVsComputer={(mode) => {
              setActiveModal(null);
              setSelectedVsMode(mode);
              handleStartMatch(mode);
            }}
          />

          {/* 3. SETTINGS MODAL */}
          <LudoSettingsModal
            isOpen={activeModal === 'settings' || showSettings}
            onClose={() => {
              setActiveModal(null);
              setShowSettings(false);
            }}
            soundOn={soundOn}
            onToggleSound={toggleSound}
            musicOn={musicOn}
            onToggleMusic={() => setMusicOn((prev) => !prev)}
          />
        </div>
      )}
    </LudoGameViewport>
  );
};
