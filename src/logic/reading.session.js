/**
 * src/logic/reading.session.js
 * ----------------------------------
 * Handles reading start/stop session logic
 */

const activeSessions = new Map();

/**
 * Start a reading session
 */
export function startReadingSession(userId) {
  if (activeSessions.has(userId)) {
    return {
      success: false,
      error: "SESSION_ALREADY_ACTIVE",
    };
  }

  const startTime = Date.now();

  activeSessions.set(userId, {
    start: startTime,
  });

  return {
    success: true,
    startTime,
  };
}

/**
 * Stop a reading session
 */
export function stopReadingSession(userId) {
  const session = activeSessions.get(userId);

  if (!session) {
    return {
      success: false,
      error: "NO_ACTIVE_SESSION",
    };
  }

  const endTime = Date.now();
  const durationMs = endTime - session.start;
  const durationMinutes = Math.floor(durationMs / 60000);

  activeSessions.delete(userId);

  return {
    success: true,
    startTime: session.start,
    endTime,
    durationMinutes,
  };
}

/**
 * Check if reading is active
 */
export function isReadingActive(userId) {
  return activeSessions.has(userId);
}
