import { useState, useRef, useEffect, useCallback } from 'react';
import {
  createInitialGameState,
  TURN_PHASE,
  TOKEN_STATE
} from '../engine/gameState.js';
import {
  canRollDice,
  canSelectToken,
  getNextActivePlayer,
  evaluateExtraTurn
} from '../engine/turnManager.js';
import { getValidMoves, hasPlayerFinished, canTokenMove } from '../engine/rules.js';
import { chooseBotMove } from '../engine/botAI.js';
import { getTokenCoordinate } from '../engine/movement.js';
import { findCapturableTokens, isCoordinateSafe } from '../engine/collision.js';
import { LUDO_CONFIG } from '../config/ludoRules.js';
import { ludoAudio } from '../ludoAudio.js';

/**
 * Authoritative Ludo Engine Hook
 * Enforces explicit Turn State Machine, centralized timer safety, and strict turn locking.
 */
export function useLudoEngine({ username = 'You', mode = '2P', onWin, entryFee = 100 } = {}) {
  const [gameState, setGameState] = useState(() => createInitialGameState({ username, mode }));
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [movingTokenId, setMovingTokenId] = useState(null);
  const [animatingToken, setAnimatingToken] = useState(null);
  const [captureImpact, setCaptureImpact] = useState(null);
  const [safeLandingImpact, setSafeLandingImpact] = useState(null);
  const [extraTurnNotice, setExtraTurnNotice] = useState(null);

  // Authoritative Refs to prevent race conditions and duplicate timeouts
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // Synchronous Action Locks: Prevent microtask/render race conditions on rapid taps/inputs
  const isDiceLockedRef = useRef(false);
  const isBotRollingRef = useRef(false);

  const timersRef = useRef(new Set());
  const hasCreditedWinRef = useRef(false);

  // Centralized Timer Safety: Track and clean up every timeout/interval
  const registerTimeout = useCallback((fn, delay) => {
    const timerId = setTimeout(() => {
      timersRef.current.delete(timerId);
      fn();
    }, delay);
    timersRef.current.add(timerId);
    return timerId;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
    ludoAudio.stopReverseSlide(0.01);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Show temporary feedback notice (for critical rule alerts only, short duration)
  const showFeedback = useCallback((text) => {
    setFeedbackNotice(text);
    registerTimeout(() => {
      setFeedbackNotice(null);
    }, 1000);
  }, [registerTimeout]);

  // -------------------------------------------------------------
  // TURN ROTATION & EXTRA TURN RESOLUTION
  // -------------------------------------------------------------
  const resolveTurnEnd = useCallback((awardedBonus = false, bonusReason = '') => {
    const current = stateRef.current;
    if (current.gameStatus === 'GAME_OVER') return;

    if (awardedBonus) {
      ludoAudio.playBonusRoll();
      const bonusText =
        bonusReason === 'Left Yard'
          ? 'ROLLED A 6 — EXTRA ROLL!'
          : bonusReason === 'Rolled 6'
          ? 'ROLLED A 6 — EXTRA ROLL!'
          : bonusReason === 'Capture'
          ? 'PIECE CAPTURED — EXTRA ROLL!'
          : bonusReason === 'Reached Home'
          ? 'REACHED HOME — EXTRA ROLL!'
          : `EXTRA TURN! (${bonusReason})`;

      setExtraTurnNotice({ text: bonusText, reason: bonusReason, timestamp: Date.now() });
      registerTimeout(() => {
        setExtraTurnNotice(null);
      }, 950);

      const nextPhase = current.activePlayerId === 'blue' ? TURN_PHASE.READY : TURN_PHASE.BOT_THINKING;

      setGameState((prev) => ({
        ...prev,
        turnPhase: nextPhase,
        isDiceRolling: false,
        validMoveTokenIds: []
      }));

      // Unlock dice strictly for human player if awarded bonus roll
      if (current.activePlayerId === 'blue') {
        isDiceLockedRef.current = false;
      }
      isBotRollingRef.current = false;

      // If Bot earned bonus roll, queue bot turn
      if (current.activePlayerId !== 'blue') {
        registerTimeout(() => {
          triggerBotTurn();
        }, LUDO_CONFIG.BOT_THINKING_DELAY_MS);
      }
      return;
    }

    // Switch to next player
    const { nextTurnIndex, nextPlayerId, isGameOver, remainingPlayer } = getNextActivePlayer(
      current.currentTurnIndex,
      current.turnOrder,
      current.players
    );

    if (isGameOver) {
      handleGameOver(remainingPlayer);
      return;
    }

    const nextPlayer = current.players[nextPlayerId];
    const nextPhase = nextPlayer.isBot ? TURN_PHASE.BOT_THINKING : TURN_PHASE.READY;

    setGameState((prev) => ({
      ...prev,
      currentTurnIndex: nextTurnIndex,
      activePlayerId: nextPlayerId,
      turnPhase: nextPhase,
      isDiceRolling: false,
      consecutiveSixes: 0,
      validMoveTokenIds: []
    }));

    // Unlock dice if and only if next active player is human
    if (!nextPlayer.isBot) {
      isDiceLockedRef.current = false;
    } else {
      isDiceLockedRef.current = true;
    }
    isBotRollingRef.current = false;

    if (nextPlayer.isBot) {
      registerTimeout(() => {
        triggerBotTurn();
      }, LUDO_CONFIG.BOT_THINKING_DELAY_MS);
    }
  }, [registerTimeout, showFeedback]);

  // -------------------------------------------------------------
  // GAME OVER HANDLER
  // -------------------------------------------------------------
  const handleGameOver = useCallback((winnerId) => {
    clearAllTimers();
    isDiceLockedRef.current = true;
    isBotRollingRef.current = true;
    ludoAudio.playVictory();

    setGameState((prev) => ({
      ...prev,
      gameStatus: 'GAME_OVER',
      turnPhase: TURN_PHASE.GAME_OVER,
      winnerId: winnerId || prev.activePlayerId,
      isDiceRolling: false,
      validMoveTokenIds: []
    }));

    if ((winnerId === 'blue' || stateRef.current.activePlayerId === 'blue') && !hasCreditedWinRef.current) {
      hasCreditedWinRef.current = true;
      if (onWin) onWin(LUDO_CONFIG.WIN_REWARD_CREDITS);
    }
  }, [clearAllTimers, onWin]);

  // -------------------------------------------------------------
  // EXECUTE TOKEN MOVE & STEP-BY-STEP ANIMATION
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // FINALIZE MOVE: CAPTURES, HOME, EXTRA TURN CHECK
  // -------------------------------------------------------------
  const finalizeMoveResolution = useCallback((playerId, tokenId, finalStep, roll) => {
    let capturedList = [];
    let reachedHome = finalStep >= LUDO_CONFIG.FINISH_STEP;

    const current = stateRef.current;
    const playerTokens = current.tokens[playerId];
    const playerTokenIdx = playerTokens ? playerTokens.findIndex((t) => t.id === tokenId) : -1;
    const targetCoord = getTokenCoordinate(playerId, playerTokenIdx >= 0 ? playerTokenIdx : 0, finalStep);

    if (reachedHome) {
      ludoAudio.playHome();
    } else {
      capturedList = findCapturableTokens(playerId, tokenId, targetCoord, current.tokens);
    }

    const finishMoveAndResolve = (finalTokens, didCapture) => {
      // Check win condition
      const playerFinished = hasPlayerFinished(playerId, finalTokens, 4);
      let nextWinnerId = current.winnerId;
      let nextGameStatus = current.gameStatus;
      let nextPlayers = { ...current.players };

      if (playerFinished && !current.players[playerId]?.hasFinished) {
        nextPlayers[playerId] = { ...nextPlayers[playerId], hasFinished: true };
        nextWinnerId = playerId;
        nextGameStatus = 'GAME_OVER';
      }

      setGameState((prev) => ({
        ...prev,
        tokens: finalTokens,
        players: nextPlayers,
        winnerId: nextWinnerId,
        gameStatus: nextGameStatus
      }));

      if (nextGameStatus === 'GAME_OVER') {
        handleGameOver(playerId);
        return;
      }

      // Evaluate extra turn
      const extraTurn = evaluateExtraTurn({
        roll,
        consecutiveSixes: current.consecutiveSixes,
        capturedCount: didCapture ? 1 : 0,
        reachedHome
      });

      registerTimeout(() => {
        resolveTurnEnd(extraTurn.awardedBonus, extraTurn.reason);
      }, 450);
    };

    // If no capture, complete resolution immediately
    if (capturedList.length === 0) {
      finishMoveAndResolve(current.tokens, false);
      return;
    }

    // CAPTURE OCCURRED!
    const { color: capColor, token: capToken } = capturedList[0];
    const capTokenIdx = current.tokens[capColor].findIndex((t) => t.id === capToken.id);
    const startCapStep = capToken.steps;

    // Ensure visual capture shockwave is active
    setCaptureImpact((prev) => prev || {
      r: targetCoord.r,
      c: targetCoord.c,
      color: capturedList[0].color,
      timestamp: Date.now()
    });
    registerTimeout(() => {
      setCaptureImpact(null);
    }, 800);

    // 2. Emphasize captured token during short pause (~240ms)
    setAnimatingToken({
      id: capToken.id,
      color: capColor,
      tokenIndex: capTokenIdx,
      stepNumber: 0,
      totalSteps: startCapStep + 1,
      direction: { dr: 0, dc: 0 },
      stepDuration: 240,
      isLeavingYard: false,
      isEnteringYard: false,
      isCaptureRewind: false,
      isCaptureHighlight: true,
      isSettling: false
    });
    setMovingTokenId(capToken.id);

    // 3. Animate captured token smoothly sliding in reverse along the track back to its yard slot
    registerTimeout(() => {
      // Brisk, smooth sliding speed (slightly faster than forward movement, ~56ms - 72ms per cell)
      const revStepDuration = startCapStep <= 6 ? 72 : startCapStep <= 14 ? 64 : 56;
      const yardDuration = 220;
      const totalSlideDurationMs = Math.max(220, (startCapStep * revStepDuration) + yardDuration);

      // Start ONE continuous soft sliding sound for the entire reverse slide
      ludoAudio.startReverseSlide(totalSlideDurationMs);

      let currentCapStep = startCapStep;

      const runReverseStep = () => {
        currentCapStep--;

        if (currentCapStep >= 0) {
          const prevCoord = getTokenCoordinate(capColor, capTokenIdx, currentCapStep + 1);
          const targetRevCoord = getTokenCoordinate(capColor, capTokenIdx, currentCapStep);
          const dr = targetRevCoord.r - prevCoord.r;
          const dc = targetRevCoord.c - prevCoord.c;

          setAnimatingToken({
            id: capToken.id,
            color: capColor,
            tokenIndex: capTokenIdx,
            stepNumber: startCapStep - currentCapStep,
            totalSteps: startCapStep + 1,
            direction: { dr, dc },
            stepDuration: revStepDuration,
            isLeavingYard: false,
            isEnteringYard: false,
            isCaptureRewind: true,
            isCaptureHighlight: false,
            isSettling: false
          });

          setGameState((prev) => ({
            ...prev,
            tokens: {
              ...prev.tokens,
              [capColor]: prev.tokens[capColor].map((t) =>
                t.id === capToken.id ? { ...t, steps: currentCapStep } : t
              )
            }
          }));

          // NOTE: NO per-cell tick/tap sound!
          // ONE continuous soft sliding sound is already playing.

          registerTimeout(() => {
            runReverseStep();
          }, revStepDuration);
        } else {
          // Reached step 0! Stop/fade out slide sound and smoothly slide into yard slot (-1)
          ludoAudio.stopReverseSlide(0.08);

          setAnimatingToken({
            id: capToken.id,
            color: capColor,
            tokenIndex: capTokenIdx,
            stepNumber: startCapStep + 1,
            totalSteps: startCapStep + 1,
            direction: { dr: 0, dc: 0 },
            stepDuration: yardDuration,
            isLeavingYard: false,
            isEnteringYard: true,
            isCaptureRewind: true,
            isCaptureHighlight: false,
            isSettling: false
          });

          // Transition token to yard position (-1) so it smoothly slides into home pedestal
          setGameState((prev) => ({
            ...prev,
            tokens: {
              ...prev.tokens,
              [capColor]: prev.tokens[capColor].map((t) =>
                t.id === capToken.id ? { ...t, steps: -1 } : t
              )
            }
          }));

          // Soft final settle/home sound on yard touchdown
          registerTimeout(() => {
            ludoAudio.playYardSettle();
          }, Math.round(yardDuration * 0.70));

          registerTimeout(() => {
            const finalTokens = {
              ...stateRef.current.tokens,
              [capColor]: stateRef.current.tokens[capColor].map((t) =>
                t.id === capToken.id ? { ...t, steps: -1, state: TOKEN_STATE.HOME } : t
              )
            };

            // ONE subtle settle bounce on its home pedestal
            setAnimatingToken((prev) => (prev ? { ...prev, isCaptureRewind: false, isEnteringYard: false, isSettling: true } : null));

            registerTimeout(() => {
              setAnimatingToken(null);
              setMovingTokenId(null);
              finishMoveAndResolve(finalTokens, true);
            }, 180);
          }, yardDuration);
        }
      };

      runReverseStep();
    }, 240);
  }, [handleGameOver, registerTimeout, resolveTurnEnd, showFeedback]);

  // -------------------------------------------------------------
  // EXECUTE TOKEN MOVE & STEP-BY-STEP ANIMATION
  // -------------------------------------------------------------
  const executeTokenMove = useCallback((playerId, tokenId, roll) => {
    const current = stateRef.current;
    if (current.gameStatus === 'GAME_OVER') return;

    const playerTokens = current.tokens[playerId];
    const playerTokenIdx = playerTokens?.findIndex((t) => t.id === tokenId);
    if (playerTokenIdx === -1) return;
    const token = playerTokens[playerTokenIdx];
    if (!token || !canTokenMove(token, roll)) return;

    const movingPhase = playerId === 'blue' ? TURN_PHASE.PLAYER_MOVING : TURN_PHASE.BOT_MOVING;

    setGameState((prev) => ({
      ...prev,
      turnPhase: movingPhase,
      validMoveTokenIds: []
    }));

    // -------------------------------------------------------------
    // CASE A: Leaving Yard (from steps: -1 to 0)
    // -------------------------------------------------------------
    if (token.steps === -1) {
      const yardDuration = 280;
      const yardCoord = getTokenCoordinate(playerId, playerTokenIdx, -1);
      const startCoord = getTokenCoordinate(playerId, playerTokenIdx, 0);
      const dr = startCoord.r - yardCoord.r;
      const dc = startCoord.c - yardCoord.c;

      // Mount token on board at yard slot position initially
      setAnimatingToken({
        id: tokenId,
        color: playerId,
        tokenIndex: playerTokenIdx,
        stepNumber: 1,
        totalSteps: 1,
        direction: { dr, dc },
        stepDuration: yardDuration,
        isLeavingYard: true,
        isCaptureRewind: false,
        isSettling: false
      });
      setMovingTokenId(tokenId);

      // Next frame: transition coordinate to start tile (step 0)
      registerTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          tokens: {
            ...prev.tokens,
            [playerId]: prev.tokens[playerId].map((t) =>
              t.id === tokenId ? { ...t, steps: 0, state: TOKEN_STATE.ACTIVE } : t
            )
          }
        }));
      }, 25);

      // Play audio on landing touchdown
      registerTimeout(() => {
        if (isCoordinateSafe(startCoord.r, startCoord.c)) {
          ludoAudio.playSafeZoneLanding();
          setSafeLandingImpact({
            r: startCoord.r,
            c: startCoord.c,
            timestamp: Date.now()
          });
          registerTimeout(() => {
            setSafeLandingImpact(null);
          }, 600);
        } else {
          ludoAudio.playTokenStep();
        }
      }, Math.round(yardDuration * 0.72));

      // Landing settle and bonus roll award
      registerTimeout(() => {
        setAnimatingToken((prev) => (prev ? { ...prev, isLeavingYard: false, isSettling: true } : null));

        registerTimeout(() => {
          setAnimatingToken(null);
          setMovingTokenId(null);
          resolveTurnEnd(true, 'Left Yard');
        }, 180);
      }, yardDuration);

      return;
    }

    // -------------------------------------------------------------
    // CASE B: Moving Forward on Track Cell-by-Cell
    // -------------------------------------------------------------
    const startStep = token.steps;
    const finalStep = startStep + roll;
    const stepDuration = roll <= 1 ? 145 : roll <= 2 ? 135 : roll <= 3 ? 125 : roll <= 4 ? 120 : 115;

    let stepCount = 0;
    let currentStep = startStep;

    const runNextStep = () => {
      stepCount++;
      const prevStep = currentStep;
      currentStep++;

      const prevCoord = getTokenCoordinate(playerId, playerTokenIdx, prevStep);
      const targetCoord = getTokenCoordinate(playerId, playerTokenIdx, currentStep);
      const dr = targetCoord.r - prevCoord.r;
      const dc = targetCoord.c - prevCoord.c;

      setAnimatingToken({
        id: tokenId,
        color: playerId,
        tokenIndex: playerTokenIdx,
        stepNumber: stepCount,
        totalSteps: roll,
        direction: { dr, dc },
        stepDuration,
        isLeavingYard: false,
        isCaptureRewind: false,
        isSettling: false
      });
      setMovingTokenId(tokenId);

      setGameState((prev) => ({
        ...prev,
        tokens: {
          ...prev.tokens,
          [playerId]: prev.tokens[playerId].map((t) =>
            t.id === tokenId
              ? {
                  ...t,
                  steps: currentStep,
                  state: currentStep >= LUDO_CONFIG.FINISH_STEP ? TOKEN_STATE.FINISHED : TOKEN_STATE.ACTIVE
                }
              : t
          )
        }
      }));

      // Check if this landing cell will capture an opponent token or is a safe zone destination
      const isFinalStepOfMove = (stepCount >= roll || currentStep >= LUDO_CONFIG.FINISH_STEP);
      const willCaptureOnLanding = isFinalStepOfMove &&
        currentStep < LUDO_CONFIG.FINISH_STEP &&
        findCapturableTokens(playerId, tokenId, targetCoord, stateRef.current.tokens).length > 0;
      const isSafeZoneLanding = isFinalStepOfMove &&
        currentStep < LUDO_CONFIG.FINISH_STEP &&
        isCoordinateSafe(targetCoord.r, targetCoord.c);

      // Play movement tap audio on cell landing touchdown (~72% of step duration)
      registerTimeout(() => {
        if (willCaptureOnLanding) {
          // Play clean "pop/knock" capture impact on contact; DO NOT play normal step sound
          ludoAudio.playCaptureImpact();
          // Trigger visual capture shockwave immediately on impact
          setCaptureImpact({
            r: targetCoord.r,
            c: targetCoord.c,
            color: playerId,
            timestamp: Date.now()
          });
        } else if (isSafeZoneLanding) {
          // Dedicated SAFE ZONE LANDING sound on destination safe cell
          ludoAudio.playSafeZoneLanding();
          setSafeLandingImpact({
            r: targetCoord.r,
            c: targetCoord.c,
            timestamp: Date.now()
          });
          registerTimeout(() => {
            setSafeLandingImpact(null);
          }, 600);
        } else {
          // Normal forward movement step sound
          ludoAudio.playTokenStep();
        }
      }, Math.round(stepDuration * 0.72));

      registerTimeout(() => {
        if (stepCount < roll && currentStep < LUDO_CONFIG.FINISH_STEP) {
          runNextStep();
        } else {
          // Final cell reached! Perform soft landing settle
          setAnimatingToken((prev) => (prev ? { ...prev, isSettling: true } : null));

          registerTimeout(() => {
            setAnimatingToken(null);
            setMovingTokenId(null);
            finalizeMoveResolution(playerId, tokenId, finalStep, roll);
          }, 180);
        }
      }, stepDuration);
    };

    runNextStep();
  }, [finalizeMoveResolution, registerTimeout, resolveTurnEnd]);

  // -------------------------------------------------------------
  // POST-ROLL EVALUATOR
  // -------------------------------------------------------------
  const handlePostRoll = useCallback((playerId, roll) => {
    const current = stateRef.current;
    if (current.gameStatus === 'GAME_OVER') return;

    // Check 3 consecutive 6s penalty
    if (roll === 6) {
      const nextSixes = current.consecutiveSixes + 1;
      setGameState((prev) => ({ ...prev, consecutiveSixes: nextSixes }));

      if (nextSixes >= LUDO_CONFIG.MAX_CONSECUTIVE_SIXES) {
        showFeedback('Three 6s in a row! Turn forfeited.');
        registerTimeout(() => {
          resolveTurnEnd(false, 'Three 6s Penalty');
        }, 1100);
        return;
      }
    } else {
      setGameState((prev) => ({ ...prev, consecutiveSixes: 0 }));
    }

    const validMoves = getValidMoves(playerId, roll, current.tokens);

    if (validMoves.length === 0) {
      showFeedback(`No legal moves for roll of ${roll}.`);
      registerTimeout(() => {
        resolveTurnEnd(false, 'No valid moves');
      }, 1000);
      return;
    }

    if (playerId === 'blue') {
      // Human turn
      if (validMoves.length === 1 && LUDO_CONFIG.AUTO_ADVANCE_SINGLE_MOVE) {
        setGameState((prev) => ({ ...prev, validMoveTokenIds: validMoves }));
        registerTimeout(() => {
          executeTokenMove('blue', validMoves[0], roll);
        }, 400);
      } else {
        setGameState((prev) => ({
          ...prev,
          turnPhase: TURN_PHASE.PLAYER_SELECTING_TOKEN,
          validMoveTokenIds: validMoves
        }));
      }
    } else {
      // Bot turn
      setGameState((prev) => ({
        ...prev,
        turnPhase: TURN_PHASE.BOT_SELECTING_TOKEN,
        validMoveTokenIds: validMoves
      }));

      registerTimeout(() => {
        const bestToken = chooseBotMove(playerId, current.tokens[playerId], roll, current.tokens);
        if (bestToken) {
          executeTokenMove(playerId, bestToken.id, roll);
        } else {
          resolveTurnEnd(false);
        }
      }, 650);
    }
  }, [executeTokenMove, registerTimeout, resolveTurnEnd, showFeedback]);

  // -------------------------------------------------------------
  // BOT TURN EXECUTION (Exactly ONE roll per turn)
  // -------------------------------------------------------------
  const triggerBotTurn = useCallback(() => {
    const current = stateRef.current;
    if (current.gameStatus === 'GAME_OVER') return;
    if (current.activePlayerId === 'blue') return; // Must not run during player turn
    if (current.isDiceRolling || isBotRollingRef.current) return; // Prevent duplicate rolls

    isBotRollingRef.current = true;
    stateRef.current = {
      ...stateRef.current,
      turnPhase: TURN_PHASE.BOT_ROLLING,
      isDiceRolling: true
    };

    setGameState((prev) => ({
      ...prev,
      turnPhase: TURN_PHASE.BOT_ROLLING,
      isDiceRolling: true
    }));

    ludoAudio.playDiceShake();

    let rolls = 0;
    const interval = setInterval(() => {
      const interimRoll = Math.floor(Math.random() * 6) + 1;
      setGameState((prev) => ({ ...prev, diceValue: interimRoll }));
      rolls++;

      if (rolls > 8) {
        clearInterval(interval);
        timersRef.current.delete(interval);

        const finalRoll = Math.floor(Math.random() * 6) + 1;
        ludoAudio.playDiceRoll();

        stateRef.current = {
          ...stateRef.current,
          diceValue: finalRoll,
          isDiceRolling: false
        };

        setGameState((prev) => ({
          ...prev,
          diceValue: finalRoll,
          isDiceRolling: false
        }));

        registerTimeout(() => {
          handlePostRoll(current.activePlayerId, finalRoll);
        }, 400);
      }
    }, 55);

    timersRef.current.add(interval);
  }, [handlePostRoll, registerTimeout]);

  // -------------------------------------------------------------
  // PLAYER DICE ROLL ACTION (Enforces strict turn & dice locks)
  // -------------------------------------------------------------
  const rollDice = useCallback(() => {
    // 1. Strict synchronous ref lock: Rejects double clicks before React re-render
    if (isDiceLockedRef.current) {
      return false;
    }

    const current = stateRef.current;
    if (!canRollDice(current, 'blue')) {
      return false;
    }

    // 2. Authoritative Immediate Lock (Synchronous mutation before ANY async operation)
    isDiceLockedRef.current = true;
    stateRef.current = {
      ...stateRef.current,
      turnPhase: TURN_PHASE.PLAYER_ROLLING,
      isDiceRolling: true
    };

    setGameState((prev) => ({
      ...prev,
      turnPhase: TURN_PHASE.PLAYER_ROLLING,
      isDiceRolling: true
    }));

    ludoAudio.playDiceShake();

    let rolls = 0;
    const interval = setInterval(() => {
      const interimRoll = Math.floor(Math.random() * 6) + 1;
      setGameState((prev) => ({ ...prev, diceValue: interimRoll }));
      rolls++;

      if (rolls > 8) {
        clearInterval(interval);
        timersRef.current.delete(interval);

        const finalRoll = Math.floor(Math.random() * 6) + 1;
        ludoAudio.playDiceRoll();

        stateRef.current = {
          ...stateRef.current,
          diceValue: finalRoll,
          isDiceRolling: false
        };

        setGameState((prev) => ({
          ...prev,
          diceValue: finalRoll,
          isDiceRolling: false
        }));

        handlePostRoll('blue', finalRoll);
      }
    }, 55);

    timersRef.current.add(interval);
    return true;
  }, [handlePostRoll]);

  // -------------------------------------------------------------
  // PLAYER TOKEN SELECTION ACTION
  // -------------------------------------------------------------
  const selectToken = useCallback((tokenId) => {
    const current = stateRef.current;
    if (!canSelectToken(current, 'blue', tokenId)) {
      return false;
    }

    executeTokenMove('blue', tokenId, current.diceValue);
    return true;
  }, [executeTokenMove]);

  // -------------------------------------------------------------
  // RESET / RESTART MATCH
  // -------------------------------------------------------------
  const restartMatch = useCallback((overrideMode) => {
    clearAllTimers();
    isDiceLockedRef.current = false;
    isBotRollingRef.current = false;
    hasCreditedWinRef.current = false;
    setFeedbackNotice(null);
    setMovingTokenId(null);
    setAnimatingToken(null);
    setCaptureImpact(null);
    setSafeLandingImpact(null);
    setExtraTurnNotice(null);

    const activeMode = overrideMode || mode;
    const fresh = createInitialGameState({ username, mode: activeMode });
    stateRef.current = fresh;
    setGameState(fresh);
  }, [clearAllTimers, mode, username]);

  return {
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
  };
}
