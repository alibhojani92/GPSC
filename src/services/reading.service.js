import { sendMessage } from "../utils/telegram";

const DAILY_TARGET_SECONDS = 8 * 60 * 60; // 8 hours

export async function startReading({ chatId, userId }, env) {
  const key = `reading:${userId}`;

  const existing = await env.KV.get(key, "json");
  if (existing?.startedAt) {
    return sendMessage(chatId, env, {
      text: "⚠️ Reading already in progress ⏳",
    });
  }

  const now = Date.now();

  await env.KV.put(
    key,
    JSON.stringify({
      startedAt: now,
      todaySeconds: existing?.todaySeconds || 0,
    })
  );

  return sendMessage(chatId, env, {
    text:
      "📚 Reading STARTED ✅\n" +
      `🕒 Start Time: ${new Date(now).toLocaleTimeString()}\n` +
      "🎯 Daily Target: 8 Hours\n" +
      "🔥 Keep going Doctor 💪🦷",
  });
}

export async function stopReading({ chatId, userId }, env) {
  const key = `reading:${userId}`;
  const data = await env.KV.get(key, "json");

  if (!data?.startedAt) {
    return sendMessage(chatId, env, {
      text: "⚠️ No active reading session found",
    });
  }

  const now = Date.now();
  const sessionSeconds = Math.floor((now - data.startedAt) / 1000);
  const totalToday = data.todaySeconds + sessionSeconds;
  const remaining = Math.max(DAILY_TARGET_SECONDS - totalToday, 0);

  // Save to D1
  await env.DB.prepare(
    `INSERT INTO reading_sessions (user_id, start_time, end_time, duration)
     VALUES (?, ?, ?, ?)`
  ).bind(
    userId,
    new Date(data.startedAt).toISOString(),
    new Date(now).toISOString(),
    sessionSeconds
  ).run();

  // Update KV
  await env.KV.put(
    key,
    JSON.stringify({
      startedAt: null,
      todaySeconds: totalToday,
    })
  );

  return sendMessage(chatId, env, {
    text:
      "⏸ Reading STOPPED ✅\n\n" +
      `🕒 Session Time: ${format(sessionSeconds)}\n` +
      `📊 Today Total: ${format(totalToday)}\n` +
      `🎯 Remaining: ${format(remaining)}\n\n` +
      "👏 Excellent effort Doctor 🦷🔥",
  });
}

export async function readingStatus({ chatId, userId }, env) {
  const key = `reading:${userId}`;
  const data = await env.KV.get(key, "json");

  if (!data) {
    return sendMessage(chatId, env, {
      text: "📊 No reading data yet",
    });
  }

  const remaining = Math.max(
    DAILY_TARGET_SECONDS - (data.todaySeconds || 0),
    0
  );

  return sendMessage(chatId, env, {
    text:
      "📊 Reading Progress\n\n" +
      `📚 Today Total: ${format(data.todaySeconds || 0)}\n` +
      `🎯 Remaining: ${format(remaining)}\n`,
  });
}

function format(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
