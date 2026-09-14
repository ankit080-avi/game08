import {
  TRACK_COORDINATES,
  HOME_PATHS,
  HOME_CENTER,
  YARD_POSITIONS,
  PLAYER_CONFIG,
  LUDO_CONFIG
} from '../config/ludoRules.js';

/**
 * Calculate token grid coordinate (r, c) based on steps taken
 * steps: -1 = in Yard / Home base
 * steps: 0..50 = on perimeter track
 * steps: 51..55 = in Home path runway
 * steps: 56 = in Finish Center
 */
export function getTokenCoordinate(playerColor, tokenIndex = 0, steps = -1) {
  if (steps === -1) {
    const yard = YARD_POSITIONS[playerColor] || YARD_POSITIONS.red;
    return yard[tokenIndex % yard.length];
  }

  if (steps >= LUDO_CONFIG.FINISH_STEP) {
    return HOME_CENTER[playerColor] || HOME_CENTER.red;
  }

  if (steps > 50) {
    const homeIndex = steps - 51;
    const path = HOME_PATHS[playerColor] || HOME_PATHS.red;
    return path[homeIndex] || HOME_CENTER[playerColor];
  }

  const config = PLAYER_CONFIG[playerColor] || PLAYER_CONFIG.red;
  const trackIdx = (config.startIndex + steps) % LUDO_CONFIG.TRACK_LENGTH;
  return TRACK_COORDINATES[trackIdx];
}
