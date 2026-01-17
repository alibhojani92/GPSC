/**
 * FILE 19: reading.analytics.js
 * Purpose: Pure analytics on reading sessions
 * Rule: NO writes, NO side effects
 */

/**
 * @param {Array} sessions
 * session = { startTime, endTime }
 */
export function calculateReadingAnalytics(sessions = [], dailyTargetMinutes = 480) {
  let totalMinutes = 0;
  let completedSessions = 0;

  for (const s of sessions) {
    if (!s.startTime || !s.endTime) continue;

    const durationMs = s.endTime - s.startTime;
    if (durationMs <= 0) continue;

    const minutes = Math.floor(durationMs / 60000);
    totalMinutes += minutes;
    completedSessions++;
  }

  const avgSession =
    completedSessions > 0
      ? Math.round(totalMinutes / completedSessions)
      : 0;

  const percent =
    dailyTargetMinutes > 0
      ? Math.min(
          100,
          Math.round((totalMinutes / dailyTargetMinutes) * 100)
        )
      : 0;

  return {
    totalMinutes,
    completedSessions,
    averageSessionMinutes: avgSession,
    targetMinutes: dailyTargetMinutes,
    completionPercent: percent,
    remainingMinutes: Math.max(
      0,
      dailyTargetMinutes - totalMinutes
    ),
  };
}
