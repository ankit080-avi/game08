import { LUDO_CONFIG } from '../config/ludoRules.js';

/**
 * Check if a single token can legally move given the current dice value
 */
export function canTokenMove(token, diceValue) {
  if (!token) return false;

  // In Home Yard: requires roll of 6 to exit
  if (token.steps === -1) {
    return diceValue === LUDO_CONFIG.ROLL_TO_EXIT_HOME;
  }

  // Already finished: cannot move
  if (token.steps >= LUDO_CONFIG.FINISH_STEP) {
    return false;
  }

  // Cannot overshoot the finish line (must land on or before step 56)
  return token.steps + diceValue <= LUDO_CONFIG.FINISH_STEP;
}

/**
 * Get all valid movable tokens for a player
 */
export function getValidMoves(playerId, diceValue, allTokens) {
  const playerTokens = allTokens[playerId] || [];
  return playerTokens.filter((token) => canTokenMove(token, diceValue)).map((t) => t.id);
}

/**
 * Check if a player has reached the win condition
 */
export function hasPlayerFinished(playerId, allTokens, targetTokensToWin = 4) {
  const playerTokens = allTokens[playerId] || [];
  const finishedCount = playerTokens.filter((t) => t.steps >= LUDO_CONFIG.FINISH_STEP).length;
  return finishedCount >= targetTokensToWin;
}
