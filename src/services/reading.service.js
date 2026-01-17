import {
  startSession,
  stopSession,
  getTodayTotal,
} from "../repos/reading.repo";
import { sendMessage } from "../utils/telegram";

const DAILY_TARGET_MIN = 8 * 60; // 8 hours

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export async function startReading(chatId, env) {
  const started = await startSession(env, chatId);

  if (!started) {
    await sendMessage(
      env,
      chatId,
      "⚠️ Reading already in progress 📖"
    );
    return new Response("OK");
  }

  const text =
`📚 Reading STARTED ✅
🕒 Start Time: ${formatTime(Date.now())}
🎯 Daily Target: 8 Hours
🔥 Keep going Doctor 💪🦷`;

  await sendMessage(env, chatId, text);
  return new Response("OK");
}

export async function stopReading(chatId, env) {
  const session = await stopSession(env, chatId);

  if (!session) {
    await sendMessage(
      env,
      chatId,
      "⚠️ No active reading session found"
    );
    return new Response("OK");
  }

  const todayTotal = await getTodayTotal(env, chatId);
  const remaining = Math.max(DAILY_TARGET_MIN - todayTotal, 0);

  const text =
`⏸ Reading STOPPED ✅

🕒 Start: ${formatTime(session.start_time)}
🕒 End: ${formatTime(session.end_time)}
⏱ Duration: ${formatDuration(session.duration)}

📊 Today Total: ${formatDuration(todayTotal)}
🎯 Target Left: ${formatDuration(remaining)}

🌟 Consistency beats intensity!`;

  await sendMessage(env, chatId, text);
  return new Response("OK");
}
