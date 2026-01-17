// services/reading.service.js
// A.E.5 FINAL – Reading Tracker + Target + Smart Replies
// Uses: D1 (reading_sessions) + KV (daily_target, today_total)

const DAILY_TARGET_SECONDS = 8 * 60 * 60; // 8 hours

function nowIST() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export async function startReading(update, env) {
  const userId = String(update.message.from.id);
  const startTime = nowIST();

  // close any open session (safety)
  await env.DB.prepare(
    `UPDATE reading_sessions 
     SET end_time = ?, duration = CAST((julianday(?) - julianday(start_time)) * 86400 AS INTEGER)
     WHERE user_id = ? AND end_time IS NULL`
  ).bind(startTime.toISOString(), startTime.toISOString(), userId).run();

  // start new session
  await env.DB.prepare(
    `INSERT INTO reading_sessions (user_id, start_time) VALUES (?, ?)`
  ).bind(userId, startTime.toISOString()).run();

  return {
    text:
`📚 Reading STARTED ✅
🕒 Start Time: ${formatTime(startTime)}
🎯 Daily Target: 8 Hours
🔥 Keep going Doctor 💪🦷`,
  };
}

export async function stopReading(update, env) {
  const userId = String(update.message.from.id);
  const endTime = nowIST();

  // get active session
  const session = await env.DB.prepare(
    `SELECT id, start_time FROM reading_sessions 
     WHERE user_id = ? AND end_time IS NULL 
     ORDER BY id DESC LIMIT 1`
  ).bind(userId).first();

  if (!session) {
    return {
      text: "⚠️ No active reading session found.",
    };
  }

  const startTime = new Date(session.start_time);
  const durationSec = Math.max(
    0,
    Math.floor((endTime - startTime) / 1000)
  );

  // close session
  await env.DB.prepare(
    `UPDATE reading_sessions 
     SET end_time = ?, duration = ?
     WHERE id = ?`
  ).bind(endTime.toISOString(), durationSec, session.id).run();

  // get today's total
  const todayKey = `${userId}:today_total`;
  const prevTotal = Number(await env.KV.get(todayKey)) || 0;
  const newTotal = prevTotal + durationSec;
  await env.KV.put(todayKey, String(newTotal));

  const remaining = Math.max(0, DAILY_TARGET_SECONDS - newTotal);

  return {
    text:
`⏸ Reading STOPPED ✅
🕒 End Time: ${formatTime(endTime)}
⏳ Session Duration: ${formatDuration(durationSec)}

📊 Today Total: ${formatDuration(newTotal)}
🎯 Target: 8h
⏱ Remaining: ${formatDuration(remaining)}

🌟 Take rest & resume later Doctor 💙`,
  };
}

export async function readingStatus(update, env) {
  const userId = String(update.message.from.id);

  const todayKey = `${userId}:today_total`;
  const total = Number(await env.KV.get(todayKey)) || 0;
  const remaining = Math.max(0, DAILY_TARGET_SECONDS - total);

  return {
    text:
`📊 Reading Progress 📚
⏳ Today Read: ${formatDuration(total)}
🎯 Target: 8h
⏱ Remaining: ${formatDuration(remaining)}

🔥 Consistency = Success Doctor 💪🦷`,
  };
}

/*
A.E.5.6 – Reminder hooks (future ready)
--------------------------------------
• Cron trigger can check KV today_total
• If remaining > 0 → send reminder
• No code here yet (LOCKED FOR NEXT STEP)
*/
