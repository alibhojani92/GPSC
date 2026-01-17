/**
 * FILE 21 – reading.guard.js
 * Purpose: Guard & validation rules for reading sessions
 * No Telegram replies
 * No storage writes
 */

import { getTodayDate } from "../utils/date.js";

/**
 * Check if user is admin
 */
export function isAdmin(userId, env) {
  return String(userId) === String(env.ADMIN_ID);
}

/**
 * Check if reading session already active
 */
export function isReadingActive(userData) {
  if (!userData.readingSession) return false;
  return userData.readingSession.active === true;
}

/**
 * Validate start reading
 * Returns:
 *  - ok: true → allowed
 *  - ok: false → blocked
 */
export function canStartReading(userData, userId, env) {
  // Admin allowed but not tracked
  if (isAdmin(userId, env)) {
    return { ok: true, admin: true };
  }

  if (isReadingActive(userData)) {
    return {
      ok: false,
      reason: "ALREADY_READING",
    };
  }

  return { ok: true };
}

/**
 * Validate stop reading
 */
export function canStopReading(userData, userId, env) {
  if (isAdmin(userId, env)) {
    return { ok: true, admin: true };
  }

  if (!isReadingActive(userData)) {
    return {
      ok: false,
      reason: "NOT_READING",
    };
  }

  return { ok: true };
}

/**
 * Force-close stale session (safety)
 * Called when date changes or session corrupted
 */
export function shouldForceCloseSession(userData) {
  if (!userData.readingSession) return false;

  const today = getTodayDate();
  const sessionDate = userData.readingSession.date;

  // Session from previous day → force close
  if (sessionDate && sessionDate !== today) {
    return true;
  }

  return false;
}

/**
 * Initialize reading session object if missing
 */
export function ensureReadingSession(userData) {
  if (!userData.readingSession) {
    userData.readingSession = {
      active: false,
      startTime: null,
      date: null,
    };
  }
}

/**
 * Mark reading session started
 */
export function markReadingStarted(userData, startTime) {
  ensureReadingSession(userData);

  userData.readingSession.active = true;
  userData.readingSession.startTime = startTime;
  userData.readingSession.date = getTodayDate();
}

/**
 * Mark reading session stopped
 */
export function markReadingStopped(userData) {
  if (!userData.readingSession) return;

  userData.readingSession.active = false;
  userData.readingSession.startTime = null;
  userData.readingSession.date = null;
}
