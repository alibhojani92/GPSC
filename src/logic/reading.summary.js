/**
 * src/logic/reading.summary.js
 * ----------------------------------
 * Builds daily reading summary
 */

import {
  DAILY_TARGET_MINUTES,
  calculateRemaining,
  formatMinutes
} from "./daily.target.js";

/**
 * Build daily reading summary
 *
 * @param {number} totalMinutes - total minutes read today
 * @returns {object}
 */
export function buildReadingSummary(totalMinutes) {
  const remaining = calculateRemaining(totalMinutes);

  const percentage = Math.min(
    Math.round((totalMinutes / DAILY_TARGET_MINUTES) * 100),
    100
  );

  return {
    totalMinutes,
    remainingMinutes: remaining,
    formatted: {
      total: formatMinutes(totalMinutes),
      remaining: formatMinutes(remaining),
      target: formatMinutes(DAILY_TARGET_MINUTES)
    },
    percentage,
    completed: totalMinutes >= DAILY_TARGET_MINUTES
  };
}
