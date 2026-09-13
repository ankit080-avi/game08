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
  Play
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

export const LudoGame = ({ onExit, onWin, user }) => {
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
  const [historyLog, setHistoryLog] = useState(['Game started. Entry fee paid: 100 Demo Credits.']);

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
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (onWin) onWin(180);
        addLog('🏆 You won! +180 Demo Credits victory reward credited!');
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
    }, 55);
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
        // Auto move if only 1 choice for better UX
        setStatusMessage(`Auto-moving token for roll of ${roll}...`);
        setTimeout(() => {
          moveToken('red', movable[0].id, roll);
        }, 400);
      } else {
        setTurnState('need_move');
        setStatusMessage(`Select a highlighted token to move forward ${roll} spaces.`);
      }
    } else {
      // Bot turn
      setTurnState('bot_thinking');
      setStatusMessage('Bot is selecting best token...');
      setTimeout(() => {
        // Bot strategy: prioritize moving forward or entering track
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
    // Standard rule: rolling a 6 gives another turn!
    if (lastRoll === 6) {
      setStatusMessage(`${player === 'red' ? 'Bonus Turn!' : 'Bot'} gets another roll for rolling 6!`);
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
    }, 1100);
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
    setStatusMessage('New game initialized! Roll the dice.');
    addLog('New game reset.');
  };

  // Render 15x15 board cell
  const renderCell = (r, c) => {
    // Check if Yard
    const isRedYard = r < 6 && c < 6;
    const isGreenYard = r < 6 && c > 8;
    const isBlueYard = r > 8 && c < 6;
    const isYellowYard = r > 8 && c > 8;
    const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

    // Check if cell is a home run path
    const isRedHomeRun = r === 7 && c >= 1 && c <= 5;
    const isGreenHomeRun = c === 7 && r >= 1 && r <= 5;

    // Safe / Star cells
    const isRedStart = r === 6 && c === 1;
    const isGreenStart = r === 1 && c === 8;
    const isStarCell = (r === 2 && c === 6) || (r === 6 && c === 12) || (r === 12 && c === 8) || (r === 8 && c === 2);

    // Locate any token sitting on this cell
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

    // Yard background colors
    let cellBg = 'bg-slate-900/60 border-slate-700/40';
    if (isRedYard) cellBg = 'bg-red-950/40 border-red-900/40';
    if (isGreenYard) cellBg = 'bg-emerald-950/40 border-emerald-900/40';
    if (isBlueYard) cellBg = 'bg-blue-950/30 border-blue-900/30';
    if (isYellowYard) cellBg = 'bg-amber-950/30 border-amber-900/30';

    if (isRedStart || isRedHomeRun) cellBg = 'bg-red-600/30 border-red-500/60';
    if (isGreenStart || isGreenHomeRun) cellBg = 'bg-emerald-600/30 border-emerald-500/60';

    if (isCenter) {
      cellBg = 'bg-gradient-to-br from-red-600/40 via-amber-500/30 to-emerald-600/40 border-slate-600';
    }

    return (
      <div
        key={`${r}-${c}`}
        className={`relative aspect-square border ${cellBg} flex items-center justify-center transition-all duration-200 select-none`}
      >
        {/* Star Icon for safe zones */}
        {(isStarCell || isRedStart || isGreenStart) && !isCenter && (
          <span className="absolute text-[9px] opacity-40 font-bold text-slate-300">★</span>
        )}

        {/* Home center indicator */}
        {r === 7 && c === 7 && (
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
        )}

        {/* Render Red Tokens */}
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
              title={`Red Token ${tok.idx + 1} (${tok.steps === -1 ? 'In Yard' : tok.steps >= 56 ? 'Finished' : 'On Track'})`}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-500 to-rose-700 text-white shadow-lg flex items-center justify-center font-bold text-xs border-2 border-white transition-all transform z-10 ${
                isMovable
                  ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110 animate-bounce cursor-pointer hover:scale-125'
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
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg flex items-center justify-center font-bold text-xs border-2 border-white/80 z-10"
          >
            G{tok.idx + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 mb-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-xl">🎲</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">Ludo Classic</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Demo Match
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Entry: <span className="font-semibold text-amber-400">100 Credits</span> • Win Reward:{' '}
              <span className="font-semibold text-emerald-400">180 Credits</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            title={soundOn ? 'Mute SFX' : 'Enable SFX'}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
          <button
            onClick={handleNewGame}
            title="Restart Match"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Game Board on Left, Controller/HUD on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Ludo Board (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[500px] p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-sm">
            {/* 15x15 Ludo Board Grid */}
            <div className="grid grid-cols-15 grid-rows-15 gap-0.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {Array.from({ length: 15 }).map((_, r) =>
                Array.from({ length: 15 }).map((_, c) => renderCell(r, c))
              )}
            </div>

            {/* Board Footer Key */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>You: 2 Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Bot: 2 Tokens</span>
              </div>
              <div className="flex items-center gap-1">
                <span>★</span>
                <span>Safe Zones</span>
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
                ? 'bg-red-950/30 border-red-500/40 shadow-lg shadow-red-950/20'
                : 'bg-emerald-950/30 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {currentTurn === 'red' ? (
                  <User className="w-5 h-5 text-red-400" />
                ) : (
                  <Bot className="w-5 h-5 text-emerald-400 animate-spin" />
                )}
                <span className="text-sm font-bold text-white">
                  {currentTurn === 'red' ? 'Your Turn (Red)' : 'Bot Turn (Green)'}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                  currentTurn === 'red'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {turnState === 'bot_thinking' ? 'Computing Move...' : 'Active'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">{statusMessage}</p>
          </div>

          {/* Dice Roller Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col items-center justify-center">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
              Dice Controller
            </h3>

            {/* 3D-styled Interactive Dice Face */}
            <div
              className={`w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-amber-500/50 shadow-2xl relative mb-4 transition-all duration-300 ${
                isRolling ? 'animate-spin scale-105 border-amber-400' : ''
              }`}
            >
              {diceValue ? (
                <div className="text-4xl font-extrabold text-amber-400 drop-shadow-md">
                  {diceValue}
                </div>
              ) : (
                <span className="text-2xl text-slate-600">?</span>
              )}
            </div>

            {/* Roll Action Button */}
            <button
              onClick={rollDice}
              disabled={isRolling || turnState !== 'need_roll' || currentTurn !== 'red'}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                currentTurn === 'red' && turnState === 'need_roll' && !isRolling
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRolling ? 'Rolling Dice...' : 'Roll Dice'}</span>
            </button>

            {currentTurn === 'red' && turnState === 'need_move' && (
              <p className="mt-2 text-xs text-amber-400 animate-pulse font-medium">
                👉 Click an illuminated token on the board to advance!
              </p>
            )}
          </div>

          {/* How to Play Quick Guide */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Demo Match Rules</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Roll a <strong>6</strong> to release a token from the yard.</li>
              <li>Rolling a <strong>6</strong> awards an extra bonus turn!</li>
              <li>Advance tokens around the track and into the center home.</li>
              <li>First player to navigate both tokens home wins <strong>180 Demo Credits</strong>!</li>
            </ul>
          </div>

          {/* Activity / Match Log */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Match Log
            </h4>
            <div className="space-y-1 text-xs font-mono text-slate-400 max-h-28 overflow-y-auto pr-1">
              {historyLog.map((log, i) => (
                <div key={i} className="py-0.5 border-b border-slate-800/50 last:border-0">
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
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
              {winner === 'red' ? '🏆' : '🤖'}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
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
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
              >
                Play Again
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
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
