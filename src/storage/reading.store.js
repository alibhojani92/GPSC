/**
 * src/storage/reading.store.js
 * ----------------------------------
 * Persistent reading storage using KV
 * No Telegram logic here
 */

const DAILY_TARGET_MINUTES = 8 * 60; // 8 hours

/**
 * Get today's date string YYYY-MM-DD
 */
function todayDate() {
  return new Date().toISOString().split("T")[0];
}

/**
 * KV key generator
 */
function readingKey(userId, date = todayDate()) {
  return `reading:${userId}:${date}`;
}

/**
 * Fetch today's reading record
 */
export async function getTodayReading(env, userId) {
  const key = readingKey(userId);
  const data = await env.READING_KV.get(key, "json");

  if (!data) {
    return {
      totalMinutes: 0,
      sessions: [],
    };
  }

  return data;
}

/**
 * Save reading session (start → end)
 */
export async function saveReadingSession(env, userId, startTime, endTime) {
  const key = readingKey(userId);
  const existing = await getTodayReading(env, userId);

  const minutes = Math.floor((endTime - startTime) / 60000);

  const updated = {
    totalMinutes: existing.totalMinutes + minutes,
    sessions: [
      ...existing.sessions,
      { start: startTime, end: endTime },
    ],
  };

  await env.READING_KV.put(key, JSON.stringify(updated));

  return {
    addedMinutes: minutes,
    totalMinutes: updated.totalMinutes,
    remainingMinutes: Math.max(
      DAILY_TARGET_MINUTES - updated.totalMinutes,
      0
    ),
  };
}

/**
 * Get remaining target minutes
 */
export async function getRemainingTarget(env, userId) {
  const today = await getTodayReading(env, userId);
  return Math.max(DAILY_TARGET_MINUTES - today.totalMinutes, 0);
}

/**
 * Get formatted HH:MM from minutes
 */
export function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
    }
