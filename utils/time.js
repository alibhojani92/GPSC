// utils/time.js
// Master time utilities – IST + duration + target math

export const DAILY_TARGET_MINUTES = 480; // 8 hours

/* ================================
   CURRENT IST TIME
================================ */

export function nowIST() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
}

/* ================================
   FORMAT TIME (AM / PM)
================================ */

export function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* ================================
   FORMAT DATE (YYYY-MM-DD)
================================ */

export function todayDate() {
  return nowIST().toISOString().slice(0, 10);
}

/* ================================
   DURATION (MINUTES → h m)
================================ */

export function formatDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

/* ================================
   CALCULATE SESSION MINUTES
================================ */

export function diffMinutes(startMs, endMs) {
  return Math.max(0, Math.floor((endMs - startMs) / 60000));
}

/* ================================
   TARGET LEFT CALCULATION
================================ */

export function remainingTarget(totalReadMinutes) {
  return Math.max(0, DAILY_TARGET_MINUTES - totalReadMinutes);
}

/* ================================
   RESET CHECK (MIDNIGHT IST)
================================ */

export function isMidnightIST() {
  const n = nowIST();
  return n.getHours() === 0 && n.getMinutes() === 0;
  }
