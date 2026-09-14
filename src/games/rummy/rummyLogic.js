/**
 * 13-Card Indian Rummy Engine
 * Standard Rules as featured on RummyCircle:
 * - 2 Standard Decks (104 cards) + 2 Printed Jokers = 106 cards.
 * - 1 Wild Cut-Joker chosen randomly per round (cards of that rank in all suits become wild jokers).
 * - 13 cards dealt to each player.
 * - Validation requires:
 *   1. Minimum 2 sequences.
 *   2. At least 1 Pure Sequence (no joker substitutes).
 *   3. Second sequence (can be pure or impure with jokers).
 *   4. Remaining cards arranged in valid sequences or sets (3-4 cards of same rank in different suits).
 * - Deadwood points: A, K, Q, J = 10; numbers = face value; Jokers = 0.
 */

export const SUITS = ['♠', '♥', '♣', '♦'];
export const SUIT_NAMES = { '♠': 'spades', '♥': 'hearts', '♣': 'clubs', '♦': 'diamonds' };
export const SUIT_COLORS = { '♠': '#0f172a', '♥': '#dc2626', '♣': '#0f172a', '♦': '#dc2626' };

export const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RANK_VALUES = {
  'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

export const POINT_VALUES = {
  'A': 10, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10
};

// Create a full 2-deck shoe
export function createRummyDeck() {
  const deck = [];
  let idCounter = 1;

  for (let d = 0; d < 2; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `c_${idCounter++}`,
          suit,
          rank,
          val: RANK_VALUES[rank],
          points: POINT_VALUES[rank],
          isPrintedJoker: false
        });
      }
    }
    // 1 printed joker per deck
    deck.push({
      id: `c_${idCounter++}`,
      suit: '★',
      rank: 'JKR',
      val: 0,
      points: 0,
      isPrintedJoker: true
    });
  }

  return shuffle(deck);
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if a card acts as a Wild Joker
export function isCardJoker(card, cutJoker) {
  if (!card) return false;
  if (card.isPrintedJoker) return true;
  if (cutJoker && card.rank === cutJoker.rank) return true;
  return false;
}

// Sort cards by suit, then by rank value
export function sortCards(cards, cutJoker = null) {
  const suitOrder = { '♠': 0, '♥': 1, '♣': 2, '♦': 3, '★': 4 };
  return [...cards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return (suitOrder[a.suit] || 0) - (suitOrder[b.suit] || 0);
    }
    return a.val - b.val;
  });
}

/**
 * Check if a group of cards forms a Pure Sequence (>=3 consecutive cards of same suit, NO jokers used as wild)
 */
export function isPureSequence(group) {
  if (!group || group.length < 3) return false;
  if (group.some((c) => c.isPrintedJoker)) return false;

  const suit = group[0].suit;
  if (group.some((c) => c.suit !== suit)) return false;

  // Values in ascending order
  const vals = group.map((c) => c.val).sort((a, b) => a - b);

  // Check normal straight: e.g. 4, 5, 6
  let isNormalStraight = true;
  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i + 1] !== vals[i] + 1) {
      isNormalStraight = false;
      break;
    }
  }
  if (isNormalStraight) return true;

  // Check Ace-high straight: e.g. Q (12), K (13), A (1)
  if (vals.includes(1)) {
    const aceHighVals = vals.map((v) => (v === 1 ? 14 : v)).sort((a, b) => a - b);
    let isAceHighStraight = true;
    for (let i = 0; i < aceHighVals.length - 1; i++) {
      if (aceHighVals[i + 1] !== aceHighVals[i] + 1) {
        isAceHighStraight = false;
        break;
      }
    }
    if (isAceHighStraight) return true;
  }

  return false;
}

/**
 * Check if a group of cards forms an Impure Sequence (>=3 cards, can use Jokers)
 */
export function isSequence(group, cutJoker) {
  if (!group || group.length < 3) return false;
  if (isPureSequence(group)) return true;

  const naturals = [];
  let jokerCount = 0;

  group.forEach((card) => {
    if (isCardJoker(card, cutJoker)) {
      jokerCount++;
    } else {
      naturals.push(card);
    }
  });

  if (naturals.length === 0) return false;

  const suit = naturals[0].suit;
  if (naturals.some((c) => c.suit !== suit)) return false;

  const vals = naturals.map((c) => c.val).sort((a, b) => a - b);

  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i] === vals[i + 1]) return false;
  }

  const checkSpan = (vList) => {
    let needed = 0;
    for (let i = 0; i < vList.length - 1; i++) {
      const gap = vList[i + 1] - vList[i] - 1;
      if (gap < 0) return false;
      needed += gap;
    }
    return needed <= jokerCount;
  };

  if (checkSpan(vals)) return true;

  if (vals.includes(1)) {
    const aceHighVals = vals.map((v) => (v === 1 ? 14 : v)).sort((a, b) => a - b);
    if (checkSpan(aceHighVals)) return true;
  }

  return false;
}

/**
 * Check if a group of cards forms a Set (3 or 4 cards of SAME rank in DIFFERENT suits, Jokers allowed)
 */
export function isSet(group, cutJoker) {
  if (!group || group.length < 3 || group.length > 4) return false;

  const naturals = [];
  let jokerCount = 0;

  group.forEach((card) => {
    if (isCardJoker(card, cutJoker)) {
      jokerCount++;
    } else {
      naturals.push(card);
    }
  });

  if (naturals.length === 0) return false;

  const rank = naturals[0].rank;
  if (naturals.some((c) => c.rank !== rank)) return false;

  const suits = new Set(naturals.map((c) => c.suit));
  if (suits.size !== naturals.length) return false;

  return true;
}

/**
 * Evaluate group status
 */
export function evaluateGroup(group, cutJoker) {
  if (!group || group.length === 0) return { type: 'empty', label: 'Empty', valid: false };
  if (isPureSequence(group)) return { type: 'pure_seq', label: 'Pure Sec', valid: true, color: 'emerald' };
  if (isSequence(group, cutJoker)) return { type: 'impure_seq', label: 'Sequence', valid: true, color: 'teal' };
  if (isSet(group, cutJoker)) return { type: 'set', label: 'Set', valid: true, color: 'cyan' };
  return { type: 'invalid', label: 'Invalid', valid: false, color: 'rose' };
}

/**
 * Validate a full 13-card hand split into groups
 */
export function validateDeclaration(groups, cutJoker) {
  const totalCards = groups.reduce((acc, g) => acc + g.length, 0);
  if (totalCards !== 13) {
    return {
      isValid: false,
      reason: `You have ${totalCards} cards grouped. Exactly 13 cards are required.`,
      pureSeqCount: 0,
      totalSeqCount: 0,
      deadwoodScore: calculateDeadwood(groups, cutJoker)
    };
  }

  let pureSeqCount = 0;
  let totalSeqCount = 0;
  let allGroupsValid = true;

  groups.forEach((g) => {
    if (g.length < 3) {
      allGroupsValid = false;
      return;
    }

    if (isPureSequence(g)) {
      pureSeqCount++;
      totalSeqCount++;
    } else if (isSequence(g, cutJoker)) {
      totalSeqCount++;
    } else if (isSet(g, cutJoker)) {
      // Valid set
    } else {
      allGroupsValid = false;
    }
  });

  if (pureSeqCount === 0) {
    return {
      isValid: false,
      reason: 'Missing First Life: At least 1 Pure Sequence (no Jokers) is required.',
      pureSeqCount,
      totalSeqCount,
      deadwoodScore: calculateDeadwood(groups, cutJoker)
    };
  }

  if (totalSeqCount < 2) {
    return {
      isValid: false,
      reason: 'Missing Second Life: At least 2 Sequences are required in total.',
      pureSeqCount,
      totalSeqCount,
      deadwoodScore: calculateDeadwood(groups, cutJoker)
    };
  }

  if (!allGroupsValid) {
    return {
      isValid: false,
      reason: 'One or more of your card groups are invalid.',
      pureSeqCount,
      totalSeqCount,
      deadwoodScore: calculateDeadwood(groups, cutJoker)
    };
  }

  return {
    isValid: true,
    reason: 'Valid Show! All sequences and sets are complete.',
    pureSeqCount,
    totalSeqCount,
    deadwoodScore: 0
  };
}

/**
 * Calculate Deadwood Points
 */
export function calculateDeadwood(groups, cutJoker) {
  let score = 0;
  groups.forEach((g) => {
    const isPure = isPureSequence(g);
    const isSeq = isSequence(g, cutJoker);
    const isValidSet = isSet(g, cutJoker);

    if (!isPure && !isSeq && !isValidSet) {
      g.forEach((c) => {
        if (!isCardJoker(c, cutJoker)) {
          score += c.points || 0;
        }
      });
    }
  });
  return Math.min(80, score);
}

/**
 * Auto-Group a list of cards into intelligent melds by suit
 */
export function autoGroupCards(cards, cutJoker) {
  const sorted = sortCards(cards, cutJoker);
  const bySuit = { '♠': [], '♥': [], '♣': [], '♦': [], '★': [] };

  sorted.forEach((c) => {
    bySuit[c.suit].push(c);
  });

  const groups = [];
  SUITS.forEach((s) => {
    if (bySuit[s].length > 0) {
      groups.push(bySuit[s]);
    }
  });

  if (bySuit['★'].length > 0) {
    groups.push(bySuit['★']);
  }

  return groups.filter((g) => g.length > 0);
}

/**
 * Bot Turn Logic
 */
export function botPlayTurn({ botHand, openDeck, closedDeck, cutJoker }) {
  const topDiscard = openDeck[openDeck.length - 1];
  let pickedCard = null;
  let pickedFrom = 'closed';

  let wantsDiscard = false;
  if (topDiscard) {
    const isJoker = isCardJoker(topDiscard, cutJoker);
    if (isJoker) {
      wantsDiscard = true;
    } else {
      const sameSuit = botHand.filter((c) => c.suit === topDiscard.suit);
      const closeRank = sameSuit.some((c) => Math.abs(c.val - topDiscard.val) === 1);
      const sameRank = botHand.some((c) => c.rank === topDiscard.rank);
      if (closeRank || sameRank) {
        wantsDiscard = true;
      }
    }
  }

  let newHand = [...botHand];
  let updatedOpen = [...openDeck];
  let updatedClosed = [...closedDeck];

  if (wantsDiscard && topDiscard) {
    pickedCard = updatedOpen.pop();
    pickedFrom = 'open';
  } else if (updatedClosed.length > 0) {
    pickedCard = updatedClosed.pop();
    pickedFrom = 'closed';
  }

  if (pickedCard) {
    newHand.push(pickedCard);
  }

  const discardCandidates = newHand.filter((c) => !isCardJoker(c, cutJoker));
  let toDiscard = null;

  if (discardCandidates.length > 0) {
    discardCandidates.sort((a, b) => (b.points || 0) - (a.points || 0));
    toDiscard = discardCandidates[0];
  } else {
    toDiscard = newHand[0];
  }

  const discardIdx = newHand.findIndex((c) => c.id === toDiscard.id);
  if (discardIdx !== -1) {
    newHand.splice(discardIdx, 1);
    updatedOpen.push(toDiscard);
  }

  return {
    botHand: newHand,
    openDeck: updatedOpen,
    closedDeck: updatedClosed,
    pickedFrom,
    discardedCard: toDiscard
  };
}
