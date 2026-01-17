// services/reading.service.js

import { nowIST, formatDuration } from "../utils/time.js";

const DAILY_TARGET_MIN = 8 * 60; // 8 hours

export async function startReading(userId, env) {
  const key = `reading:${userId}`;
  const existing = await env.KV.get(key, "json");

  if (existing?.active) {
    return {
      text: "📖 Reading already in progress.\nKeep going 💪🦷",
    };
  }

  const startTime = nowIST();
  await env.KV.put(
    key,
    JSON.stringify({
      active: true,
      start: startTime,
      today: existing?.today || 0,
      date: startTime.slice(0, 10),
    })
  );

  return {
    text:
      "📚 Reading STARTED ✅\n" +
      `🕒 Start Time: ${startTime}\n` +
      "🎯 Daily Target: 8 Hours\n" +
      "🔥 Keep going Doctor 💪🦷",
  };
}

export async function stopReading(userId, env) {
  const key = `reading:${userId}`;
  const data = await env.KV.get(key, "json");

  if (!data?.active) {
    return {
      text: "⚠️ No active reading session found.",
    };
  }

  const endTime = nowIST();
  const start = new Date(data.start);
  const end = new Date(endTime);

  const durationMin = Math.floor((end - start) / 60000);
  const todayTotal = (data.today || 0) + durationMin;
  const remaining = Math.max(DAILY_TARGET_MIN - todayTotal, 0);

  await env.KV.put(
    key,
    JSON.stringify({
      active: false,
      today: todayTotal,
      date: data.date,
    })
  );

  return {
    text:
      "⏸ Reading STOPPED ✅\n\n" +
      `🕒 Start: ${data.start}\n` +
      `🕒 End: ${endTime}\n` +
      `⏱ Duration: ${formatDuration(durationMin)}\n\n` +
      `📊 Today Total: ${formatDuration(todayTotal)}\n` +
      `🎯 Target Left: ${formatDuration(remaining)}\n\n` +
      "🌟 Consistency beats intensity!",
  };
    }
