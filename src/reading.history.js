/**
 * FILE 20 – reading.history.js
 * Purpose: Maintain per-user, per-day reading history
 * Storage: KV / D1 abstraction handled by store layer
 */

import { getTodayDate } from "../utils/date.js";

/**
 * Ensure history object exists
 */
function ensureHistory(userData) {
  if (!userData.readingHistory) {
    userData.readingHistory = {};
  }
}

/**
 * Add reading minutes to today's history
 * @param {Object} userData
 * @param {number} minutes
 */
export function addReadingHistory(userData, minutes) {
  ensureHistory(userData);

  const today = getTodayDate();

  if (!userData.readingHistory[today]) {
    userData.readingHistory[today] = {
      minutes: 0,
      sessions: 0,
    };
  }

  userData.readingHistory[today].minutes += minutes;
  userData.readingHistory[today].sessions += 1;
}

/**
 * Get history for a specific date
 * @param {Object} userData
 * @param {string} date YYYY-MM-DD
 */
export function getHistoryByDate(userData, date) {
  ensureHistory(userData);
  return userData.readingHistory[date] || null;
}

/**
 * Get full reading history
 * @param {Object} userData
 */
export function getFullHistory(userData) {
  ensureHistory(userData);
  return userData.readingHistory;
}

/**
 * Get total minutes in a date range
 * @param {Object} userData
 * @param {Array<string>} dates
 */
export function getTotalMinutesForDates(userData, dates = []) {
  ensureHistory(userData);

  let total = 0;
  for (const d of dates) {
    if (userData.readingHistory[d]) {
      total += userData.readingHistory[d].minutes;
    }
  }
  return total;
}

/**
 * Get number of active study days
 * @param {Object} userData
 */
export function getActiveDaysCount(userData) {
  ensureHistory(userData);
  return Object.keys(userData.readingHistory).length;
}

/**
 * Reset history (used ONLY for admin/testing if needed)
 * Not auto-called anywhere
 */
export function resetReadingHistory(userData) {
  userData.readingHistory = {};
}
