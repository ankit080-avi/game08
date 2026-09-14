import { TURN_PHASE } from './gameState.js';
import { LUDO_CONFIG } from '../config/ludoRules.js';

/**
 * Strict Turn State Machine and Validation
 */

export function canRollDice(gameState, playerId) {
  if (gameState.gameStatus === 'GAME_OVER') return false;
  if (gameState.activePlayerId !== playerId) return false;
  if (gameState.isDiceRolling) return false;

  const player = gameState.players[playerId];
  if (!player || player.hasFinished) return false;

  if (player.isBot) {
    return gameState.turnPhase === TURN_PHASE.BOT_THINKING;
  }

  return gameState.turnPhase === TURN_PHASE.READY;
}

export function canSelectToken(gameState, playerId, tokenId) {
  if (gameState.gameStatus === 'GAME_OVER') return false;
  if (gameState.activePlayerId !== playerId) return false;
  if (gameState.turnPhase !== TURN_PHASE.PLAYER_SELECTING_TOKEN) return false;

  return gameState.validMoveTokenIds.includes(tokenId);
}

export function getNextActivePlayer(currentTurnIndex, turnOrder, players) {
  let nextIdx = (currentTurnIndex + 1) % turnOrder.length;
  let attempts = 0;

  while (players[turnOrder[nextIdx]]?.hasFinished && attempts < turnOrder.length) {
    nextIdx = (nextIdx + 1) % turnOrder.length;
    attempts++;
  }

  const unfinished = turnOrder.filter((color) => !players[color]?.hasFinished);
  if (unfinished.length <= 1) {
    return {
      nextTurnIndex: nextIdx,
      nextPlayerId: turnOrder[nextIdx],
      isGameOver: true,
      remainingPlayer: unfinished[0] || null
    };
  }

  return {
    nextTurnIndex: nextIdx,
    nextPlayerId: turnOrder[nextIdx],
    isGameOver: false
  };
}

export function evaluateExtraTurn({ roll, consecutiveSixes, capturedCount, reachedHome }) {
  // 3 Consecutive 6s penalty
  if (roll === 6 && consecutiveSixes >= LUDO_CONFIG.MAX_CONSECUTIVE_SIXES) {
    return {
      awardedBonus: false,
      reason: 'THREE_SIXES_PENALTY'
    };
  }

  // Reached Home bonus
  if (reachedHome) {
    return {
      awardedBonus: true,
      reason: 'REACHED_HOME'
    };
  }

  // Capture bonus
  if (capturedCount > 0) {
    return {
      awardedBonus: true,
      reason: 'CAPTURE'
    };
  }

  // Roll of 6 bonus
  if (roll === 6) {
    return {
      awardedBonus: true,
      reason: 'ROLLED_SIX'
    };
  }

  return {
    awardedBonus: false,
    reason: 'NORMAL'
  };
}
