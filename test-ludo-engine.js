import assert from 'assert';
import {
  createInitialGameState,
  TURN_PHASE,
  TOKEN_STATE
} from './src/games/ludo/engine/gameState.js';
import {
  canRollDice,
  canSelectToken,
  getNextActivePlayer,
  evaluateExtraTurn
} from './src/games/ludo/engine/turnManager.js';
import {
  canTokenMove,
  getValidMoves,
  hasPlayerFinished
} from './src/games/ludo/engine/rules.js';
import { chooseBotMove } from './src/games/ludo/engine/botAI.js';
import { getTokenCoordinate } from './src/games/ludo/engine/movement.js';
import { isCoordinateSafe, findCapturableTokens } from './src/games/ludo/engine/collision.js';

console.log('--- RUNNING LUDO ENGINE MANDATED TESTS ---');

// TEST 1: Player turn - Player can roll
const state1 = createInitialGameState({ username: 'Player1', mode: '2P' });
state1.turnPhase = TURN_PHASE.READY;
state1.activePlayerId = 'blue';
assert.strictEqual(canRollDice(state1, 'blue'), true, 'TEST 1: Player can roll during Player turn');

// TEST 2: Bot turn - Player cannot roll
const state2 = createInitialGameState({ username: 'Player1', mode: '2P' });
state2.turnPhase = TURN_PHASE.BOT_THINKING;
state2.activePlayerId = 'green';
assert.strictEqual(canRollDice(state2, 'blue'), false, 'TEST 2: Player cannot roll during Bot turn');
assert.strictEqual(canRollDice(state2, 'green'), true, 'TEST 2b: Bot can roll during Bot turn');

// TEST 3 & 14: Dice lock - Cannot roll when dice is already rolling
state1.isDiceRolling = true;
assert.strictEqual(canRollDice(state1, 'blue'), false, 'TEST 3/14: Cannot roll while dice is rolling (Double-click guard)');
state1.isDiceRolling = false;

// TEST 6: Player rolls - Dice cannot be rolled again during token selection
state1.turnPhase = TURN_PHASE.PLAYER_SELECTING_TOKEN;
assert.strictEqual(canRollDice(state1, 'blue'), false, 'TEST 6: Cannot roll during token selection');

// TEST 7: Roll 6 rule
assert.strictEqual(canTokenMove({ id: 'b0', steps: -1 }, 6), true, 'TEST 7: Token in yard can move on roll 6');
assert.strictEqual(canTokenMove({ id: 'b0', steps: -1 }, 5), false, 'TEST 7: Token in yard cannot move on roll 5');
const extraTurn6 = evaluateExtraTurn({ roll: 6, consecutiveSixes: 1, capturedCount: 0, reachedHome: false });
assert.strictEqual(extraTurn6.awardedBonus, true, 'TEST 7: Roll of 6 awards bonus turn');

// TEST 8: Three consecutive sixes penalty
const threeSixes = evaluateExtraTurn({ roll: 6, consecutiveSixes: 3, capturedCount: 0, reachedHome: false });
assert.strictEqual(threeSixes.awardedBonus, false, 'TEST 8: 3 Consecutive sixes forfeits turn');
assert.strictEqual(threeSixes.reason, 'THREE_SIXES_PENALTY', 'TEST 8: Reason is THREE_SIXES_PENALTY');

// TEST 9: Invalid token selected
state1.validMoveTokenIds = ['b0'];
assert.strictEqual(canSelectToken(state1, 'blue', 'b1'), false, 'TEST 9: Invalid token selection is rejected');

// TEST 10: Valid token selected
assert.strictEqual(canSelectToken(state1, 'blue', 'b0'), true, 'TEST 10: Valid token selection is accepted');

// TEST 11: Capture returns opponent token home
const mockTokens = {
  red: [{ id: 'r0', steps: 1 }], // at (6, 2)
  green: [{ id: 'g0', steps: 40 }] // at (6, 2)
};
const captures = findCapturableTokens('green', 'g0', { r: 6, c: 2 }, mockTokens);
assert.strictEqual(captures.length, 1, 'TEST 11: Capture detected on regular square');
assert.strictEqual(captures[0].token.id, 'r0', 'TEST 11: Captured token is r0');

// TEST 12: Token reaches finish
assert.strictEqual(canTokenMove({ id: 'b0', steps: 54 }, 2), true, 'TEST 12: Token can land on exact finish step 56');
assert.strictEqual(canTokenMove({ id: 'b0', steps: 55 }, 2), false, 'TEST 12: Token cannot overshoot finish step 56');

// TEST 13: Player finishes all tokens & Game Over
const finishedTokens = {
  blue: [
    { id: 'b0', steps: 56 },
    { id: 'b1', steps: 56 },
    { id: 'b2', steps: 56 },
    { id: 'b3', steps: 56 }
  ],
  green: [{ id: 'g0', steps: 10 }]
};
assert.strictEqual(hasPlayerFinished('blue', finishedTokens, 4), true, 'TEST 13: Player finishes 4 tokens');
assert.strictEqual(hasPlayerFinished('green', finishedTokens, 4), false, 'TEST 13: Bot has not finished');

// TEST 4 & 5: Bot move prioritization
const botTokens = [
  { id: 'g0', steps: -1 },
  { id: 'g1', steps: 54 }, // can finish on 2!
  { id: 'g2', steps: 10 }
];
const chosenFinish = chooseBotMove('green', botTokens, 2, { green: botTokens, blue: [] });
assert.strictEqual(chosenFinish.id, 'g1', 'TEST 4: Bot prioritizes finishing token into home');

const noMovableTokens = [{ id: 'g0', steps: -1 }, { id: 'g1', steps: 55 }];
const chosenNoMove = chooseBotMove('green', noMovableTokens, 2, { green: noMovableTokens, blue: [] });
assert.strictEqual(chosenNoMove, null, 'TEST 5: Bot returns null when no legal moves exist');

console.log('✔ ALL LUDO ENGINE MANDATED TESTS PASSED SUCCESSFULLY!');
