/**
 * Ludo Game Configuration & Rule Constants
 */

export const LUDO_CONFIG = {
  BOARD_SIZE: 15,
  TRACK_LENGTH: 52,
  STEPS_TO_HOME_RUN: 51,
  FINISH_STEP: 56,
  ROLL_TO_EXIT_HOME: 6,
  MAX_CONSECUTIVE_SIXES: 3,
  BOT_THINKING_DELAY_MS: 700,
  STEP_ANIMATION_MS: 110,
  AUTO_ADVANCE_SINGLE_MOVE: true,
  WIN_REWARD_CREDITS: 180
};

// 52 Perimeter track coordinates in clockwise order starting from Red start cell (6, 1)
export const TRACK_COORDINATES = [
  { r: 6, c: 1 },  // 0: Red Start (Safe)
  { r: 6, c: 2 },  // 1
  { r: 6, c: 3 },  // 2
  { r: 6, c: 4 },  // 3
  { r: 6, c: 5 },  // 4
  { r: 5, c: 6 },  // 5
  { r: 4, c: 6 },  // 6
  { r: 3, c: 6 },  // 7
  { r: 2, c: 6 },  // 8: Safe (Star)
  { r: 1, c: 6 },  // 9
  { r: 0, c: 6 },  // 10
  { r: 0, c: 7 },  // 11
  { r: 0, c: 8 },  // 12
  { r: 1, c: 8 },  // 13: Green Start (Safe)
  { r: 2, c: 8 },  // 14
  { r: 3, c: 8 },  // 15
  { r: 4, c: 8 },  // 16
  { r: 5, c: 8 },  // 17
  { r: 6, c: 9 },  // 18
  { r: 6, c: 10 }, // 19
  { r: 6, c: 11 }, // 20
  { r: 6, c: 12 }, // 21: Safe (Star)
  { r: 6, c: 13 }, // 22
  { r: 6, c: 14 }, // 23
  { r: 7, c: 14 }, // 24
  { r: 8, c: 14 }, // 25
  { r: 8, c: 13 }, // 26: Yellow Start (Safe)
  { r: 8, c: 12 }, // 27
  { r: 8, c: 11 }, // 28
  { r: 8, c: 10 }, // 29
  { r: 8, c: 9 },  // 30
  { r: 9, c: 8 },  // 31
  { r: 10, c: 8 }, // 32
  { r: 11, c: 8 }, // 33
  { r: 12, c: 8 }, // 34: Safe (Star)
  { r: 13, c: 8 }, // 35
  { r: 14, c: 8 }, // 36
  { r: 14, c: 7 }, // 37
  { r: 14, c: 6 }, // 38
  { r: 13, c: 6 }, // 39: Blue Start (Safe)
  { r: 12, c: 6 }, // 40
  { r: 11, c: 6 }, // 41
  { r: 10, c: 6 }, // 42
  { r: 9, c: 6 },  // 43
  { r: 8, c: 5 },  // 44
  { r: 8, c: 4 },  // 45
  { r: 8, c: 3 },  // 46
  { r: 8, c: 2 },  // 47: Safe (Star)
  { r: 8, c: 1 },  // 48
  { r: 8, c: 0 },  // 49
  { r: 7, c: 0 },  // 50
  { r: 6, c: 0 }   // 51
];

// Home run paths (5 tiles leading into center for each player)
export const HOME_PATHS = {
  red: [
    { r: 7, c: 1 },
    { r: 7, c: 2 },
    { r: 7, c: 3 },
    { r: 7, c: 4 },
    { r: 7, c: 5 }
  ],
  green: [
    { r: 1, c: 7 },
    { r: 2, c: 7 },
    { r: 3, c: 7 },
    { r: 4, c: 7 },
    { r: 5, c: 7 }
  ],
  yellow: [
    { r: 7, c: 13 },
    { r: 7, c: 12 },
    { r: 7, c: 11 },
    { r: 7, c: 10 },
    { r: 7, c: 9 }
  ],
  blue: [
    { r: 13, c: 7 },
    { r: 12, c: 7 },
    { r: 11, c: 7 },
    { r: 10, c: 7 },
    { r: 9, c: 7 }
  ]
};

// Center finish slots
export const HOME_CENTER = {
  red: { r: 7, c: 6 },
  green: { r: 6, c: 7 },
  yellow: { r: 7, c: 8 },
  blue: { r: 8, c: 7 }
};

// Yard / Home base positions
export const YARD_POSITIONS = {
  red: [
    { r: 2, c: 2 },
    { r: 3, c: 3 },
    { r: 2, c: 3 },
    { r: 3, c: 2 }
  ],
  green: [
    { r: 2, c: 11 },
    { r: 3, c: 12 },
    { r: 2, c: 12 },
    { r: 3, c: 11 }
  ],
  yellow: [
    { r: 11, c: 11 },
    { r: 12, c: 12 },
    { r: 11, c: 12 },
    { r: 12, c: 11 }
  ],
  blue: [
    { r: 11, c: 2 },
    { r: 12, c: 3 },
    { r: 11, c: 3 },
    { r: 12, c: 2 }
  ]
};

// Safe squares: 4 Start squares + 4 Star squares
export const SAFE_COORDINATES = [
  { r: 6, c: 1 },  // Red Start
  { r: 1, c: 8 },  // Green Start
  { r: 8, c: 13 }, // Yellow Start
  { r: 13, c: 6 }, // Blue Start
  { r: 2, c: 6 },  // Star 1
  { r: 6, c: 12 }, // Star 2
  { r: 12, c: 8 }, // Star 3
  { r: 8, c: 2 }   // Star 4
];

export const PLAYER_CONFIG = {
  red: {
    id: 'red',
    name: 'Red Player',
    color: '#ef4444',
    colorName: 'Red',
    startIndex: 0
  },
  green: {
    id: 'green',
    name: 'Green Player',
    color: '#10b981',
    colorName: 'Green',
    startIndex: 13
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow Player',
    color: '#f59e0b',
    colorName: 'Yellow',
    startIndex: 26
  },
  blue: {
    id: 'blue',
    name: 'Blue Player',
    color: '#3b82f6',
    colorName: 'Blue',
    startIndex: 39
  }
};

/**
 * Extensible Generic Online Mode Architecture (Requirement #9)
 */
export const ONLINE_MODES = [
  {
    id: '1v1',
    title: '1v1',
    subtitle: '2 Players',
    totalPlayers: 2,
    teamCount: 2,
    playersPerTeam: 1,
    description: 'Individual 1-on-1 Battle'
  },
  {
    id: '2v2',
    title: '2v2',
    subtitle: '4 Players',
    badge: 'Team Match',
    totalPlayers: 4,
    teamCount: 2,
    playersPerTeam: 2,
    description: '2 vs 2 Team Collaboration'
  }
];
