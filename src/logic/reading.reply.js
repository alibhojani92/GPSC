/**
 * src/logic/reading.reply.js
 * ----------------------------------
 * Builds Telegram replies for reading flow
 */

import { buildReadingSummary } from "./reading.summary.js";
import { formatMinutes } from "./daily.target.js";

/**
 * Reading start message
 */
export function readingStartReply(startTime) {
  return (
    "📚 Reading STARTED ✅\n\n" +
    `🕒 Start Time: ${startTime}\n` +
    "🎯 Daily Target: 8 Hours\n\n" +
    "🔥 Keep going Doctor 💪🦷"
  );
}

/**
 * Reading stop message with summary
 */
export function readingStopReply(startTime, endTime, sessionMinutes, totalToday) {
  const summary = buildReadingSummary(totalToday);

  return (
    "⏸ Reading STOPPED ✅\n\n" +
    `🕒 Start: ${startTime}\n` +
    `🕒 End: ${endTime}\n` +
    `⏱ Duration: ${formatMinutes(sessionMinutes)}\n\n` +
    "📊 Today Summary\n" +
    `📘 Studied: ${summary.formatted.total}\n` +
    `🎯 Target Left: ${summary.formatted.remaining}\n` +
    `📈 Completion: ${summary.percentage}%\n\n` +
    (summary.completed
      ? "🏆 Target achieved! Amazing discipline 🌟"
      : "🌟 Consistency beats intensity. Keep going!")
  );
}

/**
 * Daily progress reply (used by /progress & buttons)
 */
export function dailyProgressReply(totalMinutes) {
  const summary = buildReadingSummary(totalMinutes);

  return (
    "📊 Daily Reading Progress\n\n" +
    `📘 Studied: ${summary.formatted.total} / ${summary.formatted.target}\n` +
    `📈 Completion: ${summary.percentage}%\n` +
    `🎯 Remaining: ${summary.formatted.remaining}\n\n` +
    "💡 Tip: Short focused sessions beat long distracted ones."
  );
}
