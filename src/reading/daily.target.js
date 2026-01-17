/**
 * FILE 22 – daily.target.js
 * Purpose: Daily reading target calculations
 * Default target: 8 hours (480 minutes)
 */

import { getTodayDate } from "../utils/date.js";

/** Default target in minutes */
export const DEFAULT_DAILY_TARGET_MIN = 8 * 60;

/**
 * Ensure target object exists on userData
 */
export function ensureDailyTarget(userData) {
  if (!userData.dailyTarget) {
    userData.dailyTarget = {
      date: getTodayDate(),
      minutes: DEFAULT_DAILY_TARGET_MIN,
    };
  }

  // If date changed → reset to default
  if (userData.dailyTarget.date !== getTodayDate()) {
    userData.dailyTarget = {
      date: getTodayDate(),
      minutes: DEFAULT_DAILY_TARGET_MIN,
    };
  }
}

/**
 * Get daily target minutes
 */
export function getDailyTargetMinutes(userData) {
  ensureDailyTarget(userData);
  return userData.dailyTarget.minutes;
}

/**
 * Get remaining minutes from target
 * @param {number} studiedMinutes
 */
export function getRemainingTargetMinutes(userData, studiedMinutes = 0) {
  const target = getDailyTargetMinutes(userData);
  const remaining = target - studiedMinutes;
  return remaining > 0 ? remaining : 0;
}

/**
 * Convert minutes to HH:MM format
 */
export function formatMinutes(mins = 0) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Check if daily target completed
 */
export function isDailyTargetCompleted(userData, studiedMinutes = 0) {
  const target = getDailyTargetMinutes(userData);
  return studiedMinutes >= target;
                                       }
