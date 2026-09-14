/**
 * Ludo Game State Models & Factory
 */

export const TOKEN_STATE = {
  HOME: 'HOME',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED'
};

export const TURN_PHASE = {
  READY: 'READY',
  PLAYER_ROLLING: 'PLAYER_ROLLING',
  PLAYER_SELECTING_TOKEN: 'PLAYER_SELECTING_TOKEN',
  PLAYER_MOVING: 'PLAYER_MOVING',
  BOT_THINKING: 'BOT_THINKING',
  BOT_ROLLING: 'BOT_ROLLING',
  BOT_SELECTING_TOKEN: 'BOT_SELECTING_TOKEN',
  BOT_MOVING: 'BOT_MOVING',
  GAME_OVER: 'GAME_OVER'
};

export function createToken(playerId, index) {
  const prefix = playerId[0];
  return {
    id: `${prefix}${index}`,
    playerId,
    index,
    state: TOKEN_STATE.HOME,
    steps: -1
  };
}

export function createInitialTokens() {
  const colors = ['red', 'green', 'yellow', 'blue'];
  const tokens = {};
  colors.forEach((col) => {
    tokens[col] = [0, 1, 2, 3].map((idx) => createToken(col, idx));
  });
  return tokens;
}

export function createInitialGameState({ username = 'You', mode = '2P' } = {}) {
  const is2P = mode === '2P';
  const activeColors = is2P ? ['blue', 'green'] : ['blue', 'green', 'yellow', 'red'];

  const players = {};
  activeColors.forEach((color) => {
    const isHuman = color === 'blue';
    players[color] = {
      id: color,
      color,
      displayName: isHuman ? username : is2P ? 'Smart Bot' : `Bot ${color.toUpperCase()}`,
      isBot: !isHuman,
      hasFinished: false
    };
  });

  return {
    turnOrder: activeColors,
    currentTurnIndex: 0,
    activePlayerId: 'blue',
    turnPhase: TURN_PHASE.READY,
    diceValue: 1,
    isDiceRolling: false,
    consecutiveSixes: 0,
    validMoveTokenIds: [],
    tokens: createInitialTokens(),
    players,
    winnerId: null,
    gameStatus: 'IN_PROGRESS',
    lastEvent: null
  };
}
