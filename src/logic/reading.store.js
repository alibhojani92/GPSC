/**
 * src/logic/reading.store.js
 * ----------------------------------
 * Stores and aggregates daily reading minutes
 */

const readingLog = new Map();

/**
 * Get today date string (YYYY-MM-DD)
 */
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Add reading minutes for today
 */
export function addReadingMinutes(userId, minutes) {
  if (!readingLog.has(userId)) {
    readingLog.set(userId, {});
  }

  const userLog = readingLog.get(userId);
  const today = getToday();

  if (!userLog[today]) {
    userLog[today] = 0;
  }

  userLog[today] += minutes;

  return {
    date: today,
    totalMinutes: userLog[today],
  };
}

/**
 * Get today total reading minutes
 */
export function getTodayReadingMinutes(userId) {
  const userLog = readingLog.get(userId);
  const today = getToday();

  if (!userLog || !userLog[today]) {
    return 0;
  }

  return userLog[today];
}

/**
 * Get full reading history (raw)
 */
export function getReadingHistory(userId) {
  return readingLog.get(userId) || {};
}
