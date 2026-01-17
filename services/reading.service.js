// services/reading.service.js
// Handles reading start / stop with full target logic

import {
  nowIST,
  formatTime,
  todayDate,
  diffMinutes,
  formatDuration,
  remainingTarget,
  DAILY_TARGET_MINUTES,
} from "../utils/time.js";

/*
KV STRUCTURE USED
reading:active:{userId}  -> { start, date }
reading:log:{date}:{userId} -> total minutes
*/

export async function startReading(env, userId) {
  const today = todayDate();
  const activeKey = `reading:active:${userId}`;

  const existing = await env.KV.get(activeKey, { type: "json" });
  if (existing && existing.date === today) {
    return {
      text: "📖 Reading already running today.\nKeep going Doctor 💪🦷",
    };
  }

  const now = nowIST();
  await env.KV.put(
    activeKey,
    JSON.stringify({
      start: now.getTime(),
      date: today,
    })
  );

  return {
    text:
      "📚 Reading STARTED ✅\n\n" +
      `🕒 Start Time: ${formatTime(now)}\n` +
      `🎯 Daily Target: ${formatDuration(DAILY_TARGET_MINUTES)}\n\n` +
      "🔥 Keep going Doctor 💪🦷",
  };
}

export async function stopReading(env, userId) {
  const activeKey = `reading:active:${userId}`;
  const session = await env.KV.get(activeKey, { type: "json" });

  if (!session) {
    return {
      text: "⚠️ No active reading session found.",
    };
  }

  const startTime = new Date(session.start);
  const endTime = nowIST();
  const durationMin = diffMinutes(session.start, endTime.getTime());

  const logKey = `reading:log:${session.date}:${userId}`;
  const prevTotal = Number(await env.KV.get(logKey)) || 0;
  const newTotal = prevTotal + durationMin;

  await env.KV.put(logKey, String(newTotal));
  await env.KV.delete(activeKey);

  const remaining = remainingTarget(newTotal);

  return {
    text:
      "⏸ Reading STOPPED ✅\n\n" +
      `🕒 Start: ${formatTime(startTime)}\n` +
      `🕒 End: ${formatTime(endTime)}\n` +
      `⏱ Duration: ${formatDuration(durationMin)}\n\n` +
      `📊 Today Total: ${formatDuration(newTotal)}\n` +
      `🎯 Target Left: ${formatDuration(remaining)}\n\n` +
      "🌟 Consistency beats intensity!",
  };
}
