import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  LogOut,
  Volume2,
  VolumeX,
  Trophy,
  Bot,
  User,
  Info,
  Sparkles,
  Play,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  PLAYER_CONFIG,
  TRACK_COORDINATES,
  HOME_PATHS,
  HOME_CENTER,
  YARD_POSITIONS,
  getTokenCoordinate,
  canTokenMove,
  soundEffects
} from './ludoLogic';

export const LudoGame = ({ onExit, onWin, user, session, entryFee = 100 }) => {
  // Game state
  // Two tokens per player for snappy, entertaining demo matches
  const [tokens, setTokens] = useState({
    red: [
      { id: 'r0', steps: -1 }, // -1 = yard, 0..50 = track, 51..55 = home stretch, 56 = home
      { id: 'r1', steps: -1 }
    ],
    green: [
      { id: 'g0', steps: -1 },
      { id: 'g1', steps: -1 }
    ]
  });

  const [currentTurn, setCurrentTurn] = useState('red'); // 'red' (human) or 'green' (bot)
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [turnState, setTurnState] = useState('need_roll'); // 'need_roll' | 'need_move' | 'bot_thinking' | 'game_over'
  const [statusMessage, setStatusMessage] = useState('Your turn! Roll the dice.');
  const [winner, setWinner] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [historyLog, setHistoryLog] = useState([
    `Session allocated: ${session?.sessionId || 'GSESS-ACTIVE'}. Entry fee deducted: ${entryFee} Credits.`
  ]);

  const botTimerRef = useRef(null);

  const addLog = (msg) => {
    setHistoryLog((prev) => [msg, ...prev.slice(0, 7)]);
  };

  const toggleSound = () => {
    soundEffects.enabled = !soundOn;
    setSoundOn(!soundOn);
  };

  // Check if player has won (all 2 tokens in home)
  const checkVictory = useCallback(
    (currentTokens) => {
      const redWon = currentTokens.red.every((t) => t.steps >= 56);
      const greenWon = currentTokens.green.every((t) => t.steps >= 56);

      if (redWon) {
        setWinner('red');
        setTurnState('game_over');
        setStatusMessage('Victory! You defeated the Bot!');
        soundEffects.playWin();
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 }
        });
        if (onWin) onWin(180);
        addLog('🏆 Victory! +180 Demo Credits win reward credited to wallet!');
        return true;
      }

      if (greenWon) {
        setWinner('green');
        setTurnState('game_over');
        setStatusMessage('Bot won this round. Good effort!');
        addLog('Bot reached home first. Better luck next time!');
        return true;
      }

      return false;
    },
    [onWin]
  );

  // Roll dice action
  const rollDice = () => {
    if (isRolling || turnState !== 'need_roll' || currentTurn !== 'red') return;

    soundEffects.playRoll();
    setIsRolling(true);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 7) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setIsRolling(false);
        handlePostRoll('red', finalVal);
      }
    }, 50);
  };

  // Evaluate legal moves after roll
  const handlePostRoll = (player, roll) => {
    addLog(`${player === 'red' ? 'You' : 'Bot'} rolled a ${roll}.`);

    const playerTokens = tokens[player];
    const movable = playerTokens.filter((t) => canTokenMove(t, roll));

    if (movable.length === 0) {
      setStatusMessage(`${player === 'red' ? 'No legal moves' : 'Bot has no moves'}. Passing turn.`);
      setTimeout(() => {
        passTurn(player, roll);
      }, 1000);
      return;
    }

    if (player === 'red') {
      // Human turn
      if (movable.length === 1) {
        // Auto move if only 1 choice for seamless UX
        setStatusMessage(`Auto-advancing token for roll of ${roll}...`);
        setTimeout(() => {
          moveToken('red', movable[0].id, roll);
        }, 450);
      } else {
        setTurnState('need_move');
        setStatusMessage(`Select a highlighted token to move forward ${roll} spaces.`);
      }
    } else {
      // Bot turn
      setTurnState('bot_thinking');
      setStatusMessage('Bot is calculating move...');
      setTimeout(() => {
        const chosen = movable.sort((a, b) => b.steps - a.steps)[0];
        moveToken('green', chosen.id, roll);
      }, 700);
    }
  };

  // Move token
  const moveToken = (player, tokenId, roll) => {
    soundEffects.playStep();

    setTokens((prev) => {
      const updatedList = prev[player].map((tok) => {
        if (tok.id === tokenId) {
          let nextSteps;
          if (tok.steps === -1) {
            nextSteps = 0; // Enter track
          } else {
            nextSteps = tok.steps + roll;
          }
          return { ...tok, steps: nextSteps };
        }
        return tok;
      });

      const nextState = { ...prev, [player]: updatedList };

      setTimeout(() => {
        if (!checkVictory(nextState)) {
          passTurn(player, roll);
        }
      }, 400);

      return nextState;
    });
  };

  // Pass turn to next player
  const passTurn = (player, lastRoll) => {
    // Rolling a 6 gives another turn!
    if (lastRoll === 6) {
      setStatusMessage(`${player === 'red' ? 'Bonus Turn!' : 'Bot'} gets another roll for rolling a 6!`);
      if (player === 'red') {
        setTurnState('need_roll');
      } else {
        setTurnState('bot_thinking');
        triggerBotTurn();
      }
      return;
    }

    const nextPlayer = player === 'red' ? 'green' : 'red';
    setCurrentTurn(nextPlayer);

    if (nextPlayer === 'green') {
      setTurnState('bot_thinking');
      setStatusMessage('Bot is thinking...');
      triggerBotTurn();
    } else {
      setTurnState('need_roll');
      setStatusMessage('Your turn! Roll the dice.');
    }
  };

  // Bot logic
  const triggerBotTurn = () => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);

    botTimerRef.current = setTimeout(() => {
      soundEffects.playRoll();
      setIsRolling(true);

      let count = 0;
      const interval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count > 6) {
          clearInterval(interval);
          const botRoll = Math.floor(Math.random() * 6) + 1;
          setDiceValue(botRoll);
          setIsRolling(false);
          handlePostRoll('green', botRoll);
        }
      }, 50);
    }, 1000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, []);

  // Reset / New Game
  const handleNewGame = () => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    setTokens({
      red: [
        { id: 'r0', steps: -1 },
        { id: 'r1', steps: -1 }
      ],
      green: [
        { id: 'g0', steps: -1 },
        { id: 'g1', steps: -1 }
      ]
    });
    setCurrentTurn('red');
    setDiceValue(null);
    setIsRolling(false);
    setTurnState('need_roll');
    setWinner(null);
    setStatusMessage('New match initialized! Roll the dice.');
    addLog('Match reset. Ready for turn 1.');
  };

  // Render authentic 3D dice pips (1 to 6)
  const renderDicePips = (val) => {
    if (!val) {
      return <span className="text-3xl font-extrabold text-slate-500">?</span>;
    }

    const dotClass = "w-3 h-3 rounded-full bg-slate-950 shadow-inner";

    switch (val) {
      case 1:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className={`${dotClass} w-4 h-4 bg-amber-600`} />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2.5">
            <div className="flex justify-start"><span className={dotClass} /></div>
            <div className="flex justify-end"><span className={dotClass} /></div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2.5">
            <div className="flex justify-start"><span className={dotClass} /></div>
            <div className="flex justify-center"><span className={dotClass} /></div>
            <div className="flex justify-end"><span className={dotClass} /></div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2.5">
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2.5">
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
            <div className="flex justify-center"><span className={dotClass} /></div>
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2.5">
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
            <div className="flex justify-between"><span className={dotClass} /><span className={dotClass} /></div>
          </div>
        );
      default:
        return <span className="text-3xl font-black text-slate-950">{val}</span>;
    }
  };

  // Render 15x15 board cell with 4 player quadrants and center home
  const renderCell = (r, c) => {
    // Check if Yard
    const isRedYard = r < 6 && c < 6;
    const isGreenYard = r < 6 && c > 8;
    const isBlueYard = r > 8 && c < 6;
    const isYellowYard = r > 8 && c > 8;
    const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

    // Home run paths
    const isRedHomeRun = r === 7 && c >= 1 && c <= 5;
    const isGreenHomeRun = c === 7 && r >= 1 && r <= 5;
    const isYellowHomeRun = r === 7 && c >= 9 && c <= 13;
    const isBlueHomeRun = c === 7 && r >= 9 && r <= 13;

    // Safe / Star cells
    const isRedStart = r === 6 && c === 1;
    const isGreenStart = r === 1 && c === 8;
    const isYellowStart = r === 8 && c === 13;
    const isBlueStart = r === 13 && c === 6;
    const isStarCell = (r === 2 && c === 6) || (r === 6 && c === 12) || (r === 12 && c === 8) || (r === 8 && c === 2);

    // Decorative Yard token circles
    const isYardHole =
      (isRedYard && ((r === 2 && c === 2) || (r === 3 && c === 3) || (r === 2 && c === 3) || (r === 3 && c === 2))) ||
      (isGreenYard && ((r === 2 && c === 11) || (r === 3 && c === 12) || (r === 2 && c === 12) || (r === 3 && c === 11))) ||
      (isBlueYard && ((r === 11 && c === 2) || (r === 12 && c === 3) || (r === 11 && c === 3) || (r === 12 && c === 2))) ||
      (isYellowYard && ((r === 11 && c === 11) || (r === 12 && c === 12) || (r === 11 && c === 12) || (r === 12 && c === 11)));

    // Tokens at this cell
    const redTokensHere = tokens.red
      .map((t, idx) => ({ ...t, idx }))
      .filter((t) => {
        const coord = getTokenCoordinate('red', t.idx, t.steps);
        return coord.r === r && coord.c === c;
      });

    const greenTokensHere = tokens.green
      .map((t, idx) => ({ ...t, idx }))
      .filter((t) => {
        const coord = getTokenCoordinate('green', t.idx, t.steps);
        return coord.r === r && coord.c === c;
      });

    // Determine cell appearance
    let cellBg = 'bg-slate-900/80 border-slate-700/40';
    if (isRedYard) cellBg = 'bg-red-950/60 border-red-900/50';
    if (isGreenYard) cellBg = 'bg-emerald-950/60 border-emerald-900/50';
    if (isBlueYard) cellBg = 'bg-blue-950/60 border-blue-900/50';
    if (isYellowYard) cellBg = 'bg-amber-950/60 border-amber-900/50';

    if (isRedStart || isRedHomeRun) cellBg = 'bg-red-600/40 border-red-500/70';
    if (isGreenStart || isGreenHomeRun) cellBg = 'bg-emerald-600/40 border-emerald-500/70';
    if (isYellowStart || isYellowHomeRun) cellBg = 'bg-amber-600/40 border-amber-500/70';
    if (isBlueStart || isBlueHomeRun) cellBg = 'bg-blue-600/40 border-blue-500/70';

    if (isCenter) {
      cellBg = 'bg-slate-950 border-amber-500/60';
    }

    return (
      <div
        key={`${r}-${c}`}
        className={`relative aspect-square border ${cellBg} flex items-center justify-center transition-all duration-150 select-none overflow-hidden`}
      >
        {/* Recessed white circle in yard slots */}
        {isYardHole && redTokensHere.length === 0 && greenTokensHere.length === 0 && (
          <div className="w-4 h-4 rounded-full bg-slate-950/80 border border-slate-700/60 shadow-inner" />
        )}

        {/* Safe Star Icon */}
        {(isStarCell || isRedStart || isGreenStart || isYellowStart || isBlueStart) && !isCenter && (
          <span className="absolute text-[9px] font-black text-amber-400/70 drop-shadow">★</span>
        )}

        {/* Center Trophy / Finish Line */}
        {r === 7 && c === 7 && (
          <div className="flex flex-col items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
        )}

        {/* Center Quadrant Colored Triangles */}
        {isCenter && !(r === 7 && c === 7) && (
          <div className={`w-full h-full opacity-60 ${
            r === 6 && c === 7 ? 'bg-emerald-500' :
            r === 8 && c === 7 ? 'bg-blue-500' :
            r === 7 && c === 6 ? 'bg-red-500' :
            r === 7 && c === 8 ? 'bg-amber-500' :
            'bg-slate-800'
          }`} />
        )}

        {/* Render Red Tokens (Human) */}
        {redTokensHere.map((tok) => {
          const isMovable =
            currentTurn === 'red' &&
            turnState === 'need_move' &&
            canTokenMove(tok, diceValue);

          return (
            <button
              key={tok.id}
              disabled={!isMovable}
              onClick={() => moveToken('red', tok.id, diceValue)}
              title={`Red Token ${tok.idx + 1}`}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-rose-700 text-white shadow-xl flex items-center justify-center font-black text-xs border-2 border-white transition-all transform z-20 ${
                isMovable
                  ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-125 animate-bounce cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              R{tok.idx + 1}
            </button>
          );
        })}

        {/* Render Green Tokens (Bot) */}
        {greenTokensHere.map((tok) => (
          <div
            key={tok.id}
            title={`Bot Token ${tok.idx + 1}`}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-700 text-white shadow-xl flex items-center justify-center font-black text-xs border-2 border-white/90 z-20"
          >
            G{tok.idx + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Game HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 mb-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-amber-500 to-emerald-500 p-0.5 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              🎲
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white tracking-wide">Ludo Classic</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE MATCH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Session: <strong className="font-mono text-amber-400">{session?.sessionId || 'GSESS-DEMO'}</strong></span>
              <span>•</span>
              <span>Fee Deducted: <strong className="text-emerald-400">{entryFee} Credits</strong></span>
              <span>•</span>
              <span>Win Bonus: <strong className="text-amber-300">180 Credits</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            title={soundOn ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            onClick={handleNewGame}
            title="Restart Match"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Game</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Game Board on Left, HUD on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ludo Board (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[500px] p-3 sm:p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-sm">
            {/* 15x15 Authentic Ludo Grid */}
            <div className="grid grid-cols-15 grid-rows-15 gap-0.5 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner">
              {Array.from({ length: 15 }).map((_, r) =>
                Array.from({ length: 15 }).map((_, c) => renderCell(r, c))
              )}
            </div>

            {/* Board Footer Area Guide */}
            <div className="mt-3.5 grid grid-cols-4 gap-2 text-[10px] text-center font-bold">
              <div className="py-1 px-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
                Red: You (2)
              </div>
              <div className="py-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                Green: Bot (2)
              </div>
              <div className="py-1 px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 opacity-60">
                Blue Yard
              </div>
              <div className="py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 opacity-60">
                Yellow Yard
              </div>
            </div>
          </div>
        </div>

        {/* Game Controller / HUD (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Turn Banner */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${
              currentTurn === 'red'
                ? 'bg-red-950/40 border-red-500/50 shadow-xl shadow-red-950/30'
                : 'bg-emerald-950/40 border-emerald-500/50 shadow-xl shadow-emerald-950/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {currentTurn === 'red' ? (
                  <User className="w-5 h-5 text-red-400" />
                ) : (
                  <Bot className="w-5 h-5 text-emerald-400 animate-spin" />
                )}
                <span className="text-sm font-black text-white">
                  {currentTurn === 'red' ? 'Your Turn (Red)' : 'Bot Turn (Green)'}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  currentTurn === 'red'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {turnState === 'bot_thinking' ? 'Thinking...' : 'Active'}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-semibold">{statusMessage}</p>
          </div>

          {/* Dice Controller Card with Authentic Pip Face */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">
              Dice Controller
            </h3>

            {/* Authentic 3D Dice Face */}
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-white to-amber-200 border-2 border-amber-400 shadow-2xl relative mb-4 transition-all duration-300 flex items-center justify-center select-none ${
                isRolling ? 'animate-spin scale-110' : 'transform hover:scale-105'
              }`}
            >
              {renderDicePips(diceValue)}
            </div>

            {/* Roll Action Button */}
            <button
              onClick={rollDice}
              disabled={isRolling || turnState !== 'need_roll' || currentTurn !== 'red'}
              className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                currentTurn === 'red' && turnState === 'need_roll' && !isRolling
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Play className="w-4 h-4 fill-current stroke-none" />
              <span>{isRolling ? 'Rolling Dice...' : 'ROLL DICE'}</span>
            </button>

            {currentTurn === 'red' && turnState === 'need_move' && (
              <p className="mt-2 text-xs text-amber-400 animate-pulse font-bold">
                👉 Click an illuminated token to advance!
              </p>
            )}
          </div>

          {/* How to Play Rules */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200 font-bold mb-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Ludo Rules Summary</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-[11px]">
              <li>Roll a <strong>6</strong> to bring a token out of the yard onto the track.</li>
              <li>Rolling a <strong>6</strong> awards an extra bonus roll!</li>
              <li>Advance tokens around the track into the center home triangle.</li>
              <li>First player to bring both tokens home wins <strong>180 Demo Credits</strong>!</li>
            </ul>
          </div>

          {/* Activity / Match Log */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Match Log
            </h4>
            <div className="space-y-1 text-[11px] font-mono text-slate-400 max-h-24 overflow-y-auto pr-1">
              {historyLog.map((log, i) => (
                <div key={i} className="py-0.5 border-b border-slate-800/40 last:border-0 truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Modal Overlay */}
      {winner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
              {winner === 'red' ? '🏆' : '🤖'}
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {winner === 'red' ? 'Victory Royale!' : 'Match Finished'}
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              {winner === 'red'
                ? 'Outstanding game! You conquered the board and earned +180 Demo Credits.'
                : 'The Bot reached the home goal first. Reset for another round!'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleNewGame}
                className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
