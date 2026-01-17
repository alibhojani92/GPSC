/**
 * src/logic/reading.target.js
 * ----------------------------------
 * Daily reading target & time calculations
 */

const DAILY_TARGET_MINUTES = 8 * 60; // 480 minutes

/**
 * Return daily target in minutes
 */
export function getDailyTargetMinutes() {
  return DAILY_TARGET_MINUTES;
}

/**
 * Convert minutes to HH:MM format
 */
export function formatMinutes(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Calculate remaining minutes from target
 */
export function getRemainingMinutes(totalReadMinutes) {
  const remaining = DAILY_TARGET_MINUTES - totalReadMinutes;
  return remaining > 0 ? remaining : 0;
}

/**
 * Full target summary
 */
export function getTargetSummary(totalReadMinutes) {
  const remaining = getRemainingMinutes(totalReadMinutes);

  return {
    targetMinutes: DAILY_TARGET_MINUTES,
    targetFormatted: formatMinutes(DAILY_TARGET_MINUTES),
    readMinutes: totalReadMinutes,
    readFormatted: formatMinutes(totalReadMinutes),
    remainingMinutes: remaining,
    remainingFormatted: formatMinutes(remaining),
  };
}
