/**
 * Level Manager for Knife Rain
 * Authentic 5-stage progression with sliceable apples, rotating dynamics, and Boss showdown.
 */

export const LEVEL_DEFINITIONS = [
  {
    level: 1,
    name: 'STAGE 1',
    subtitle: 'Classic Wood Target',
    knivesRequired: 7,
    initialKnives: [],
    apples: [160], // 1 apple at 160 degrees
    baseSpeed: 0.028,
    pattern: 'constant',
    targetType: 'wood',
    boss: false
  },
  {
    level: 2,
    name: 'STAGE 2',
    subtitle: 'Dual Velocity',
    knivesRequired: 8,
    initialKnives: [0],
    apples: [140],
    baseSpeed: 0.036,
    pattern: 'constant',
    targetType: 'wood',
    boss: false
  },
  {
    level: 3,
    name: 'STAGE 3',
    subtitle: 'Spin Reversal',
    knivesRequired: 8,
    initialKnives: [60, 240],
    apples: [120, 300],
    baseSpeed: 0.042,
    pattern: 'reversing',
    targetType: 'wood',
    boss: false
  },
  {
    level: 4,
    name: 'STAGE 4',
    subtitle: 'Pendulum Rush',
    knivesRequired: 9,
    initialKnives: [30, 150, 270],
    apples: [90, 210],
    baseSpeed: 0.048,
    pattern: 'oscillate',
    targetType: 'wood',
    boss: false
  },
  {
    level: 5,
    name: 'STAGE 5 - BOSS',
    subtitle: 'Robot Overlord',
    knivesRequired: 10,
    initialKnives: [0, 90, 180, 270],
    apples: [45, 135, 225],
    baseSpeed: 0.054,
    pattern: 'erratic',
    targetType: 'boss_robot',
    boss: true
  }
];

export const levelManager = {
  getLevelConfig(levelNumber) {
    const idx = (levelNumber - 1) % LEVEL_DEFINITIONS.length;
    const base = LEVEL_DEFINITIONS[idx];
    const loop = Math.floor((levelNumber - 1) / LEVEL_DEFINITIONS.length);

    return {
      ...base,
      level: levelNumber,
      baseSpeed: base.baseSpeed * (1 + loop * 0.15),
      knivesRequired: Math.min(12, base.knivesRequired + loop),
      apples: [...base.apples]
    };
  },

  getMaxDefinedLevels() {
    return LEVEL_DEFINITIONS.length;
  }
};

