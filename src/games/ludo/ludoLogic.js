/**
 * Ludo Logic Engine Facade
 * Provides backward-compatible exports for test-runner and components
 * routed directly through the pure modular engine.
 */

export {
  LUDO_CONFIG,
  TRACK_COORDINATES,
  SAFE_COORDINATES,
  HOME_PATHS,
  HOME_CENTER,
  YARD_POSITIONS,
  PLAYER_CONFIG
} from './config/ludoRules.js';

export {
  canTokenMove,
  getValidMoves,
  hasPlayerFinished
} from './engine/rules.js';

export {
  getTokenCoordinate
} from './engine/movement.js';

export {
  isCoordinateSafe,
  findCapturableTokens
} from './engine/collision.js';

export {
  chooseBotMove
} from './engine/botAI.js';

export {
  TURN_PHASE,
  TOKEN_STATE,
  createInitialGameState,
  createInitialTokens
} from './engine/gameState.js';

export {
  canRollDice,
  canSelectToken,
  getNextActivePlayer,
  evaluateExtraTurn
} from './engine/turnManager.js';

// Empty sound effects object for test compatibility if accessed
export const soundEffects = {
  playDiceRoll: () => {},
  playTokenMove: () => {},
  playCapture: () => {},
  playWin: () => {},
  playError: () => {}
};
