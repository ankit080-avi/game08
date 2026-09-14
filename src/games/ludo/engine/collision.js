import { SAFE_COORDINATES, LUDO_CONFIG } from '../config/ludoRules.js';
import { getTokenCoordinate } from './movement.js';

/**
 * Check whether a board coordinate is a protected safe zone (Start tile or Star tile)
 */
export function isCoordinateSafe(r, c) {
  return SAFE_COORDINATES.some((coord) => coord.r === r && coord.c === c);
}

/**
 * Check if landing at targetCoord captures (cuts) any opponent tokens
 */
export function findCapturableTokens(movingColor, movingTokenId, targetCoord, allTokens) {
  if (!targetCoord) return [];
  if (isCoordinateSafe(targetCoord.r, targetCoord.c)) return []; // Safe squares protect tokens

  const captured = [];

  Object.entries(allTokens).forEach(([color, tokenList]) => {
    if (color === movingColor) return; // Cannot capture own tokens

    tokenList.forEach((tok, idx) => {
      // Token must be active on the outer track (steps >= 0 and steps <= 50)
      if (tok.steps >= 0 && tok.steps <= 50) {
        const coord = getTokenCoordinate(color, idx, tok.steps);
        if (coord.r === targetCoord.r && coord.c === targetCoord.c) {
          captured.push({ color, token: tok });
        }
      }
    });
  });

  return captured;
}
