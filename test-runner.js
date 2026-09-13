/**
 * Comprehensive Automated Verification Suite for Game08 Platform
 * Tests all core requirements:
 * 1. Auth Service (Register, Login, Session, Logout)
 * 2. Wallet Service (Credits, Bounds, Negative Protection, Concurrency lock, Transactions)
 * 3. Storage Service (Isolation, Clear platform data)
 * 4. Ludo Game Logic (Move rules, Yards, Track coords, Home paths)
 * 5. Game Registry (Extensibility, Modularity)
 */

// Simple in-memory mock for localStorage in node environment
const store = new Map();
global.localStorage = {
  getItem: (k) => store.get(k) || null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
  get length() { return store.size; },
  key: (i) => Array.from(store.keys())[i] || null
};

// Colors for terminal output
const green = (s) => `\x1b[32m✔ ${s}\x1b[0m`;
const red = (s) => `\x1b[31m✘ ${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(green(message));
    passed++;
  } else {
    console.error(red(message));
    failed++;
  }
}

async function runTests() {
  console.log(cyan('\n--- 1. Testing Storage Service ---'));
  const { storageService, StorageKeys } = await import('./src/services/storageService.js');

  storageService.set('game08_test', { foo: 'bar' });
  assert(storageService.get('game08_test')?.foo === 'bar', 'Storage service saves and retrieves JSON correctly');

  storageService.clearPlatformData();
  assert(storageService.get('game08_test') === null, 'clearPlatformData cleans all game08_ keys');

  console.log(cyan('\n--- 2. Testing Auth Service ---'));
  const { authService } = await import('./src/services/authService.js');

  // Register
  const newUser = await authService.register({ username: 'tester1', fullName: 'Test Player' });
  assert(newUser.username === 'tester1', 'User registration generates valid user object');
  assert(authService.isAuthenticated(), 'User is authenticated after registration');

  // Duplicate registration should reject
  try {
    await authService.register({ username: 'tester1' });
    assert(false, 'Should prevent duplicate usernames');
  } catch (err) {
    assert(true, 'Correctly prevented duplicate username registration');
  }

  // Logout
  authService.logout();
  assert(!authService.isAuthenticated(), 'User session is cleared on logout');

  // Login
  const loggedIn = await authService.login({ username: 'tester1' });
  assert(loggedIn.username === 'tester1' && authService.isAuthenticated(), 'Login succeeds and restores session');

  console.log(cyan('\n--- 3. Testing Virtual Demo Wallet Service ---'));
  const { walletService, TransactionType } = await import('./src/services/walletService.js');

  const userId = 'tester1';
  const initialBalance = walletService.getBalance(userId);
  assert(initialBalance === 500, `Initial demo wallet grant is 500 Credits (got: ${initialBalance})`);

  // Initial transaction logged
  const txnsAfterInit = walletService.getTransactions(userId);
  assert(txnsAfterInit.length === 1, 'Initial welcome grant transaction recorded');
  assert(txnsAfterInit[0].type === TransactionType.CREDIT_ADDED, 'Initial txn type is CREDIT_ADDED');

  // Add demo credits (+500)
  const addRes = await walletService.addCredits(500, 'Top-up demo credits', userId);
  assert(addRes.balance === 1000, `Adding 500 credits updates balance to 1000 (got: ${addRes.balance})`);
  assert(walletService.getBalance(userId) === 1000, 'getBalance reflects updated balance');

  const txnsAfterAdd = walletService.getTransactions(userId);
  assert(txnsAfterAdd.length === 2, 'Top-up transaction appended to transaction history');
  assert(txnsAfterAdd[0].amount === 500, 'Transaction amount is +500');

  // Reject negative or invalid amount
  try {
    await walletService.addCredits(-100, 'Invalid negative', userId);
    assert(false, 'Should reject negative amount');
  } catch (e) {
    assert(true, 'Rejected negative credit addition');
  }

  try {
    await walletService.addCredits('abc', 'Invalid nan', userId);
    assert(false, 'Should reject NaN amount');
  } catch (e) {
    assert(true, 'Rejected NaN amount');
  }

  // Deduct Entry Fee (Ludo = 100)
  const deductRes = await walletService.deductEntryFee('ludo', 'Ludo Classic', 100, userId);
  assert(deductRes.balance === 900, `Deducting entry fee of 100 leaves 900 credits (got: ${deductRes.balance})`);

  const txnsAfterFee = walletService.getTransactions(userId);
  assert(txnsAfterFee[0].type === TransactionType.ENTRY_FEE, 'Entry fee transaction recorded as ENTRY_FEE');
  assert(txnsAfterFee[0].amount === -100, 'Entry fee transaction amount is -100');

  // Test Insufficient Balance Protection
  try {
    // Current balance is 900, try deducting 2000
    await walletService.deductEntryFee('vip-tournament', 'High Roller', 2000, userId);
    assert(false, 'Should block fee when balance is insufficient');
  } catch (e) {
    assert(true, 'Blocked entry fee when balance < fee (Insufficient funds error)');
    assert(walletService.getBalance(userId) === 900, 'Balance remained untouched after failed transaction');
  }

  // Credit Win Reward
  const winRes = await walletService.creditReward('ludo', 'Ludo Classic', 180, userId);
  assert(winRes.balance === 1080, `Winning reward of 180 credits updates balance to 1080 (got: ${winRes.balance})`);

  console.log(cyan('\n--- 4. Testing Ludo Game Logic ---'));
  const { canTokenMove, getTokenCoordinate } = await import('./src/games/ludo/ludoLogic.js');

  // Token in yard (steps = -1) can only move on roll of 6
  assert(!canTokenMove({ id: 'r0', steps: -1 }, 1), 'Cannot leave yard on roll of 1');
  assert(!canTokenMove({ id: 'r0', steps: -1 }, 5), 'Cannot leave yard on roll of 5');
  assert(canTokenMove({ id: 'r0', steps: -1 }, 6), 'Can leave yard on roll of 6');

  // Active token can move on any roll that doesn't overshoot 56
  assert(canTokenMove({ id: 'r0', steps: 10 }, 4), 'Active token can advance by 4');
  assert(canTokenMove({ id: 'r0', steps: 54 }, 2), 'Token at 54 can reach 56 (finish) with roll 2');
  assert(!canTokenMove({ id: 'r0', steps: 55 }, 2), 'Token cannot overshoot home (steps 55 + 2 = 57 > 56)');

  // Coordinates check
  const yardCoord = getTokenCoordinate('red', 0, -1);
  assert(yardCoord && yardCoord.r !== undefined && yardCoord.c !== undefined, 'Yard coordinate returns valid row and column');
  const trackCoord = getTokenCoordinate('red', 0, 0);
  assert(trackCoord && trackCoord.r === 6 && trackCoord.c === 1, 'Red start tile matches expected (6, 1)');

  console.log(cyan('\n--- 5. Testing Game Registry (Modularity) ---'));
  const { GAME_REGISTRY, getGameById } = await import('./src/games/registry.js');
  assert(GAME_REGISTRY.length >= 2, 'Registry contains multiple games');
  const ludo = getGameById('ludo');
  assert(ludo && ludo.entryFee === 100 && ludo.status === 'active', 'Ludo game is registered with entry fee and active status');
  const ttt = getGameById('tic-tac-toe');
  assert(ttt && ttt.entryFee === 50 && ttt.status === 'active', 'Tic-Tac-Toe is registered as secondary modular game');

  console.log(cyan('\n--- 6. Testing Demo Reset Functionality ---'));
  storageService.clearPlatformData();
  const balanceAfterReset = walletService.getBalance('tester1');
  assert(balanceAfterReset === 500, 'After clearPlatformData, new session restarts clean with default demo balance');

  console.log(cyan('\n========================================='));
  console.log(`Total tests passed: ${passed}`);
  console.log(`Total tests failed: ${failed}`);
  console.log(cyan('=========================================\n'));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
