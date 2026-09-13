/**
 * Game Registry - Centralized plug-and-play game catalog metadata.
 * Pure JS module compatible with Node tests, SSR, and client.
 */

export const GAME_REGISTRY = [
  {
    id: 'ludo',
    title: 'Ludo Classic Demo',
    shortName: 'Ludo',
    category: 'Board & Strategy',
    entryFee: 100, // Demo credits
    winReward: 180, // Demo credits
    status: 'active', // 'active' | 'coming_soon'
    badge: 'Featured',
    badgeColor: 'amber',
    iconName: 'Dices',
    description: 'The beloved classic cross-and-circle board game. Roll the dice, move your tokens, and race to the home triangle!',
    players: '1 Player vs Smart AI',
    features: ['Interactive 3D Dice', 'Safety Zones', 'Turn Indicators', 'AI Opponent']
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Blitz',
    shortName: 'Tic-Tac-Toe',
    category: 'Quick Casual',
    entryFee: 50,
    winReward: 90,
    status: 'active',
    badge: 'Instant Play',
    badgeColor: 'emerald',
    iconName: 'Gamepad2',
    description: 'Fast 3x3 tactical grid showdown against an adaptive Bot. Align 3 marks before the timer runs out!',
    players: '1 Player vs Bot',
    features: ['Quick Rounds', 'Minimax Bot', 'Win Streaks']
  },
  {
    id: 'snakes-ladders',
    title: 'Snakes & Ladders Pro',
    shortName: 'Snakes & Ladders',
    category: 'Classic Board',
    entryFee: 150,
    winReward: 250,
    status: 'coming_soon',
    badge: 'Coming Soon',
    badgeColor: 'indigo',
    iconName: 'Sparkles',
    description: 'Climb ladders to the top, steer clear of treacherous snakes, and be the first to reach tile 100.',
    players: '2-4 Players',
    features: ['Multiplayer Ready', 'Custom Boards', 'Special Tiles']
  }
];

export function getGameById(gameId) {
  return GAME_REGISTRY.find((g) => g.id === gameId) || null;
}
