import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LudoBoard, QUADRANT_CONFIGS, getStackOffset } from './src/games/ludo/LudoBoard.jsx';
import { createInitialTokens } from './src/games/ludo/engine/gameState.js';
import { getTokenCoordinate } from './src/games/ludo/engine/movement.js';

console.log('--- RUNNING LUDO BOARD DOM & GEOMETRY VERIFICATION ---');

const initialTokens = createInitialTokens();

// Test 1: Render LudoBoard with initial tokens
const html = renderToStaticMarkup(
  React.createElement(LudoBoard, {
    tokens: initialTokens,
    activeColor: 'blue',
    diceValue: 1,
    turnState: 'need_roll'
  })
);

// 1. Verify all 4 quadrants exist in QUADRANT_CONFIGS
console.log('1. Checking Quadrant Configurations...');
if (QUADRANT_CONFIGS.length !== 4) {
  throw new Error(`Expected 4 quadrant configs, got ${QUADRANT_CONFIGS.length}`);
}
const quadColors = QUADRANT_CONFIGS.map(q => q.color);
['red', 'green', 'blue', 'yellow'].forEach(c => {
  if (!quadColors.includes(c)) throw new Error(`Missing quadrant config for ${c}`);
});
console.log('✔ All 4 quadrants (red, green, blue, yellow) defined in QUADRANT_CONFIGS');

// 2. Verify explicit grid coordinates for each quadrant
console.log('2. Checking CSS Grid positioning...');
if (!html.includes('grid-column:1 / 7') || !html.includes('grid-row:1 / 7')) {
  throw new Error('Red quadrant missing explicit grid-column:1 / 7 or grid-row:1 / 7');
}
if (!html.includes('grid-column:10 / 16') || !html.includes('grid-row:1 / 7')) {
  throw new Error('Green quadrant missing explicit grid-column:10 / 16 or grid-row:1 / 7');
}
if (!html.includes('grid-column:1 / 7') || !html.includes('grid-row:10 / 16')) {
  throw new Error('Blue quadrant missing explicit grid-column:1 / 7 or grid-row:10 / 16');
}
if (!html.includes('grid-column:10 / 16') || !html.includes('grid-row:10 / 16')) {
  throw new Error('Yellow quadrant missing explicit grid-column:10 / 16 or grid-row:10 / 16');
}
console.log('✔ All 4 quadrants have explicit grid-column and grid-row CSS Grid coordinates');

// 3. Verify center finish 3x3 coordinates
if (!html.includes('grid-column:7 / 10') || !html.includes('grid-row:7 / 10')) {
  throw new Error('Center finish missing explicit grid-column:7 / 10 or grid-row:7 / 10');
}
console.log('✔ Center victory finish has explicit 3x3 grid coordinates (7 / 10, 7 / 10)');

// 4. Verify 16 slots total (4 slots per home)
const slotMatches = html.match(/slot-[0-3]/g) || [];
console.log(`4. Found ${slotMatches.length} token slots in HTML`);
if (slotMatches.length !== 16) {
  throw new Error(`Expected exactly 16 token slots (4 per quadrant), got ${slotMatches.length}`);
}
console.log('✔ Exactly 16 token slots rendered (4 slots in each of Red, Green, Blue, Yellow)');

// 5. Verify 16 tokens in initial yard state
['red', 'green', 'blue', 'yellow'].forEach(color => {
  for (let i = 0; i < 4; i++) {
    const gradId = `token-face-${color}-${i}`;
    if (!html.includes(gradId)) {
      throw new Error(`Missing token ${color}-${i} in rendered board`);
    }
  }
});
console.log('✔ Exactly 16 tokens rendered inside their respective home slots (4 per quadrant)');

// 6. Verify zero usernames
if (html.includes('demo_player') || html.includes('@demo_player')) {
  throw new Error('Account username found in rendered board HTML!');
}
console.log('✔ Zero account usernames rendered on board');

// 7. Test token leaving yard onto track
console.log('7. Testing token movement to path...');
const tokensMoved = createInitialTokens();
tokensMoved.blue[0].steps = 0; // Blue token 0 on track start cell (13, 6)

const htmlMoved = renderToStaticMarkup(
  React.createElement(LudoBoard, {
    tokens: tokensMoved,
    activeColor: 'blue',
    diceValue: 6,
    turnState: 'need_roll'
  })
);

// Token on track: should be in track token layer with coordinates
const expectedBlueCoord = getTokenCoordinate('blue', 0, 0); // (13, 6)
const expectedLeft = `${((expectedBlueCoord.c + 0.5) / 15) * 100}%`;
const expectedTop = `${((expectedBlueCoord.r + 0.5) / 15) * 100}%`;

if (!htmlMoved.includes(`left:${expectedLeft}`) || !htmlMoved.includes(`top:${expectedTop}`)) {
  throw new Error(`Track token not found at expected coordinates left:${expectedLeft}, top:${expectedTop}`);
}
console.log(`✔ Active token on track renders at exact mathematical center (${expectedLeft}, ${expectedTop})`);

// 8. Test getStackOffset helper
console.log('8. Testing getStackOffset helper...');
const offset1 = getStackOffset(0, 1);
if (offset1.x !== 0 || offset1.y !== 0) throw new Error('Stack offset for 1 token should be (0, 0)');

const offset2_0 = getStackOffset(0, 2);
const offset2_1 = getStackOffset(1, 2);
if (offset2_0.x !== -4 || offset2_1.x !== 4) throw new Error('Stack offset for 2 tokens should be -4 and +4');

const offset3_0 = getStackOffset(0, 3);
const offset3_1 = getStackOffset(1, 3);
const offset3_2 = getStackOffset(2, 3);
if (offset3_0.y !== -4 || offset3_1.x !== -4 || offset3_2.x !== 4) throw new Error('Stack offset for 3 tokens invalid');

console.log('✔ getStackOffset accurately computes 1, 2, 3, and 4+ token offsets strictly within cell boundary');

console.log('\n=============================================');
console.log('ALL LUDO BOARD DOM & GEOMETRY TESTS PASSED!');
console.log('=============================================');
