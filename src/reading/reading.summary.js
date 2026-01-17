/**
 * FILE 23 – reading.summary.js
 * Purpose: Build reading summary data for replies & reports
 */

import { getTodayDate, formatTime } from "../utils/date.js";
import {
  getRemainingTargetMinutes,
  formatMinutes,
  isDailyTargetCompleted,
} from "./daily.target.js";

/**
 * Build today's reading summary
 * @param {Object} userData
 */
export function buildTodaySummary(userData) {
  const today = getTodayDate();

  const history = userData.readingHistory || {};
  const todayData = history[today] || { minutes: 0, sessions: 0 };

  const studiedMinutes = todayData.minutes;
  const sessions = todayData.sessions;

  const remainingMinutes = getRemainingTargetMinutes(
    userData,
    studiedMinutes
  );

  return {
    date: today,
    studiedMinutes,
    studiedFormatted: formatMinutes(studiedMinutes),
    sessions,
    remainingMinutes,
    remainingFormatted: formatMinutes(remainingMinutes),
    targetCompleted: isDailyTargetCompleted(userData, studiedMinutes),
  };
}

/**
 * Build reading stop summary payload
 * @param {Object} params
 */
export function buildStopSummary({
  startTime,
  endTime,
  sessionMinutes,
  todaySummary,
}) {
  return {
    startTimeFormatted: formatTime(startTime),
    endTimeFormatted: formatTime(endTime),
    sessionMinutes,
    sessionFormatted: formatMinutes(sessionMinutes),
    todayTotalFormatted: todaySummary.studiedFormatted,
    remainingFormatted: todaySummary.remainingFormatted,
    targetCompleted: todaySummary.targetCompleted,
  };
}
