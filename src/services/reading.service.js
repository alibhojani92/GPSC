const DAILY_TARGET_SECONDS = 8 * 60 * 60; // 8 hours

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h > 0 ? h + "h " : ""}${m}m`;
}

export async function startReading(userId, env) {
  const startTime = Date.now();

  await env.KV.put(
    `reading:${userId}`,
    JSON.stringify({ startTime })
  );

  await env.DB.prepare(
    `INSERT INTO reading_sessions (user_id, start_time)
     VALUES (?, ?)`
  ).bind(userId, startTime).run();

  return `📘 Reading STARTED ✅
⏱️ Time tracking ON`;
}

export async function stopReading(userId, env) {
  const kvData = await env.KV.get(`reading:${userId}`, "json");

  if (!kvData) {
    return `⚠️ No active reading session found`;
  }

  const endTime = Date.now();
  const durationSec = Math.floor((endTime - kvData.startTime) / 1000);

  await env.DB.prepare(
    `UPDATE reading_sessions
     SET end_time = ?, duration = ?
     WHERE user_id = ? AND end_time IS NULL`
  ).bind(endTime, durationSec, userId).run();

  await env.KV.delete(`reading:${userId}`);

  // total today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { results } = await env.DB.prepare(
    `SELECT SUM(duration) as total
     FROM reading_sessions
     WHERE user_id = ?
     AND start_time >= ?`
  ).bind(userId, todayStart.getTime()).all();

  const totalToday = results[0]?.total || 0;
  const remaining = Math.max(0, DAILY_TARGET_SECONDS - totalToday);

  return `📘 Reading Session Completed ✅

🕒 Started at: ${formatTime(kvData.startTime)}
🕔 Ended at: ${formatTime(endTime)}
⏱️ Session Duration: ${formatDuration(durationSec)}

📊 Today's Progress:
• Total studied today: ${formatDuration(totalToday)}
• Daily Target: 8h
• Remaining: ${formatDuration(remaining)}

💪 Keep going! You're doing great 🔥`;
         }
