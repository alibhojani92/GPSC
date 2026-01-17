// src/services/reading.service.js

const TARGET_SECONDS = 8 * 60 * 60; // 8 hours

export async function startReading(userId, env) {
  const kvKey = `reading:${userId}`;

  const active = await env.KV.get(kvKey, "json");
  if (active?.active) {
    return "⚠️ Reading already active.";
  }

  const startTime = new Date();
  await env.KV.put(
    kvKey,
    JSON.stringify({ active: true, start: startTime.toISOString() })
  );

  return (
    "📚 Reading STARTED ✅\n" +
    `🕒 Start Time: ${startTime.toLocaleTimeString("en-IN")}\n` +
    "🎯 Daily Target: 8 Hours\n" +
    "🔥 Keep going Doctor 💪🦷"
  );
}

export async function stopReading(userId, env) {
  const kvKey = `reading:${userId}`;
  const data = await env.KV.get(kvKey, "json");

  if (!data?.active) {
    return "⚠️ Reading not active.";
  }

  const start = new Date(data.start);
  const end = new Date();
  const durationSec = Math.floor((end - start) / 1000);

  // Save session to D1
  await env.DB.prepare(
    `
    INSERT INTO reading_sessions (user_id, start_time, end_time, duration)
    VALUES (?, ?, ?, ?)
  `
  )
    .bind(userId, start.toISOString(), end.toISOString(), durationSec)
    .run();

  await env.KV.delete(kvKey);

  // Calculate today total
  const today = new Date().toISOString().slice(0, 10);
  const result = await env.DB.prepare(
    `
    SELECT SUM(duration) as total
    FROM reading_sessions
    WHERE user_id = ? AND date(start_time) = ?
  `
  )
    .bind(userId, today)
    .first();

  const totalSec = result?.total || 0;
  const remaining = Math.max(TARGET_SECONDS - totalSec, 0);

  return (
    "⏸️ Reading STOPPED ✅\n" +
    `🕒 Session: ${format(durationSec)}\n` +
    `📊 Today: ${format(totalSec)} / 8h\n` +
    `⏳ Remaining: ${format(remaining)}\n` +
    "💙 Take rest & resume later"
  );
}

function format(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}
