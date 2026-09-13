/**
 * Level Manager for Knife Target Arcade
 * Controls difficulty scaling, rotation dynamics, and level progression.
 */

export const LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: 'Timber Training',
    knivesRequired: 6,
    initialKnives: [], // No initial stuck knives
    baseSpeed: 0.028, // Radians per frame
    pattern: 'constant',
    boss: false
  },
  {
    level: 2,
    name: 'Rapid Log',
    knivesRequired: 7,
    initialKnives: [0], // 1 knife already stuck
    baseSpeed: 0.038,
    pattern: 'constant',
    boss: false
  },
  {
    level: 3,
    name: 'Reverse Spin',
    knivesRequired: 7,
    initialKnives: [60, 240], // 2 existing knives
    baseSpeed: 0.042,
    pattern: 'reversing', // Flips direction periodically
    reverseInterval: 140, // Frames
    boss: false
  },
  {
    level: 4,
    name: 'Pendulum Swing',
    knivesRequired: 8,
    initialKnives: [30, 150, 270], // 3 existing knives
    baseSpeed: 0.048,
    pattern: 'oscillate', // Accelerates and decelerates smoothly
    boss: false
  },
  {
    level: 5,
    name: 'Forest Master BOSS',
    knivesRequired: 9,
    initialKnives: [0, 90, 180, 270], // 4 quadrant knives
    baseSpeed: 0.055,
    pattern: 'erratic', // Sudden bursts and brief stops
    boss: true
  }
];

export const levelManager = {
  getLevelConfig(levelNumber) {
    const idx = (levelNumber - 1) % LEVEL_DEFINITIONS.length;
    const base = LEVEL_DEFINITIONS[idx];
    const loop = Math.floor((levelNumber - 1) / LEVEL_DEFINITIONS.length);

    // If looped past level 5, progressively increase speed
    return {
      ...base,
      level: levelNumber,
      baseSpeed: base.baseSpeed * (1 + loop * 0.2),
      knivesRequired: Math.min(12, base.knivesRequired + loop)
    };
  },

  getMaxDefinedLevels() {
    return LEVEL_DEFINITIONS.length;
  }
};
