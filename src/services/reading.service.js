import {
  startSession,
  stopSession,
  getTodayTotal,
} from "../repos/reading.repo";
import { sendMessage } from "../utils/telegram";

const DAILY_TARGET = 8 * 60; // minutes

function time(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dur(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export async function startReading(chatId, env) {
  const session = await startSession(env, chatId);

  if (!session) {
    await sendMessage(env, chatId, "⚠️ Reading already in progress 📖");
    return new Response("OK");
  }

  await sendMessage(
    env,
    chatId,
`📚 Reading STARTED ✅
🕒 Start Time: ${time(session.start_time)}
🎯 Daily Target: 8 Hours
🔥 Keep going Doctor 💪🦷`
  );

  return new Response("OK");
}

export async function stopReading(chatId, env) {
  const session = await stopSession(env, chatId);

  if (!session) {
    await sendMessage(env, chatId, "⚠️ No active reading session");
    return new Response("OK");
  }

  const total = await getTodayTotal(env, chatId);
  const remaining = Math.max(DAILY_TARGET - total, 0);

  await sendMessage(
    env,
    chatId,
`⏸ Reading STOPPED ✅

🕒 Start: ${time(session.start_time)}
🕒 End: ${time(session.end_time)}
⏱ Duration: ${dur(session.duration)}

📊 Today Total: ${dur(total)}
🎯 Target Left: ${dur(remaining)}

🌟 Consistency beats intensity!`
  );

  return new Response("OK");
}
