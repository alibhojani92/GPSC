/**
 * src/logic/daily.target.js
 * ----------------------------------
 * Daily reading target logic
 */

export const DAILY_TARGET_MINUTES = 8 * 60; // 8 hours

/**
 * Get today's date key (YYYY-MM-DD)
 */
export function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calculate remaining minutes
 */
export function calculateRemaining(totalMinutes) {
  return Math.max(DAILY_TARGET_MINUTES - totalMinutes, 0);
}

/**
 * Format minutes to readable text
 * Example: 405 -> "6h 45m"
 */
export function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

/**
 * Check if daily reset is needed
 * (Different date means reset)
 */
export function isNewDay(lastDateKey) {
  return lastDateKey !== getTodayKey();
}
