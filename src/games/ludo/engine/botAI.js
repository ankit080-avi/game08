import { canTokenMove } from './rules.js';
import { getTokenCoordinate } from './movement.js';
import { findCapturableTokens } from './collision.js';
import { LUDO_CONFIG } from '../config/ludoRules.js';

/**
 * Prioritized Bot Decision Engine
 * Priority:
 * 1. Finish token into Home (steps + roll === 56)
 * 2. Capture an opponent pawn
 * 3. Release a new token from Home Yard (roll === 6)
 * 4. Advance token with greatest progress
 * 5. First available valid token
 */
export function chooseBotMove(botColor, botTokens, roll, allTokens) {
  const movable = botTokens.filter((t) => canTokenMove(t, roll));
  if (movable.length === 0) return null;
  if (movable.length === 1) return movable[0];

  // 1. Finish token into Home Center
  const finishMove = movable.find((t) => t.steps + roll === LUDO_CONFIG.FINISH_STEP);
  if (finishMove) return finishMove;

  // 2. Capture opponent token
  for (const token of movable) {
    const nextSteps = token.steps === -1 ? 0 : token.steps + roll;
    const tokenIndex = botTokens.findIndex((t) => t.id === token.id);
    const targetCoord = getTokenCoordinate(botColor, tokenIndex, nextSteps);
    const captures = findCapturableTokens(botColor, token.id, targetCoord, allTokens);
    if (captures.length > 0) {
      return token;
    }
  }

  // 3. Move token out of Yard
  if (roll === LUDO_CONFIG.ROLL_TO_EXIT_HOME) {
    const yardToken = movable.find((t) => t.steps === -1);
    if (yardToken) return yardToken;
  }

  // 4. Move token with greatest progress
  const activeTokens = movable.filter((t) => t.steps >= 0);
  if (activeTokens.length > 0) {
    activeTokens.sort((a, b) => b.steps - a.steps);
    return activeTokens[0];
  }

  // 5. Fallback to first movable
  return movable[0];
}
