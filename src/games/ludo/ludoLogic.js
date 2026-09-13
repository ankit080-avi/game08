/**
 * Ludo Game Logic and Board Coordinates
 * Based on classic 15x15 Ludo layout.
 */

// Coordinates for the 52 perimeter track cells in clockwise order starting from Red start cell (6, 1)
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

// Home run coordinates (5 tiles leading into center)
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
  ]
};

// Center Home slot coordinate
export const HOME_CENTER = {
  red: { r: 7, c: 6 },
  green: { r: 6, c: 7 }
};

// Base / Yard token positions (for 2 tokens per player)
export const YARD_POSITIONS = {
  red: [
    { r: 2, c: 2 },
    { r: 3, c: 3 }
  ],
  green: [
    { r: 2, c: 11 },
    { r: 3, c: 12 }
  ]
};

export const PLAYER_CONFIG = {
  red: {
    name: 'You (Red)',
    color: '#ef4444',
    bgLight: '#fee2e2',
    startIndex: 0,
    stepsToHomeRun: 50,
    isBot: false
  },
  green: {
    name: 'Bot (Green)',
    color: '#10b981',
    bgLight: '#d1fae5',
    startIndex: 13,
    stepsToHomeRun: 50,
    isBot: true
  }
};

/**
 * Calculate token coordinate based on steps taken
 * steps: -1 = in Yard
 * steps: 0..50 = on outer track
 * steps: 51..55 = in Home path
 * steps: 56 = in Home (Finished)
 */
export function getTokenCoordinate(playerColor, tokenIndex, steps) {
  if (steps === -1) {
    return YARD_POSITIONS[playerColor][tokenIndex];
  }
  if (steps >= 56) {
    return HOME_CENTER[playerColor];
  }
  if (steps > 50) {
    const homeIndex = steps - 51;
    return HOME_PATHS[playerColor][homeIndex] || HOME_CENTER[playerColor];
  }
  const config = PLAYER_CONFIG[playerColor];
  const trackIdx = (config.startIndex + steps) % 52;
  return TRACK_COORDINATES[trackIdx];
}

/**
 * Check if a token can make a legal move given dice value
 */
export function canTokenMove(token, diceValue) {
  // If in yard, can only leave on roll of 6 (or in quick demo mode roll 6 or 1)
  if (token.steps === -1) {
    return diceValue === 6;
  }
  // If finished, cannot move
  if (token.steps >= 56) {
    return false;
  }
  // Must land exactly on or before 56 (cannot overshoot home)
  return token.steps + diceValue <= 56;
}

/**
 * Web Audio sound generator for dice roll and token movements
 */
export const soundEffects = {
  ctx: null,
  enabled: true,

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  },

  playRoll() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (_) {}
  },

  playStep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (_) {}
  },

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.12);
        osc.stop(this.ctx.currentTime + i * 0.12 + 0.35);
      });
    } catch (_) {}
  }
};
