/**
 * Reading Session Model
 * Master Bot – Reading Start/Stop Tracking
 */

export function createReadingSession({
  userId,
  date, // YYYY-MM-DD
  startTime, // ISO string
  endTime = null, // ISO string
  durationMinutes = 0,
}) {
  return {
    userId,
    date,

    startTime,
    endTime,

    durationMinutes, // calculated on stop

    meta: {
      source: "manual", // manual | auto (future)
    },
  };
}
