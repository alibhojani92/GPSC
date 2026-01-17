/**
 * src/controllers/reading.controller.js
 * ----------------------------------
 * Orchestrates reading handler + store
 */

import { sendMessage } from "../telegram.js";
import {
  saveReadingSession,
  getRemainingTarget,
  formatMinutes,
} from "../storage/reading.store.js";

/**
 * Active in-memory sessions (start time)
 * Session lifecycle only
 */
const activeSessions = new Map();

/**
 * START READING
 */
export async function startReadingController(env, chatId, userId) {
  if (activeSessions.has(userId)) {
    await sendMessage(
      chatId,
      `⚠️ Reading already in progress.\n\n⏸ Please stop before starting again.`
    );
    return;
  }

  const startTime = Date.now();
  activeSessions.set(userId, startTime);

  const startText = new Date(startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await sendMessage(
    chatId,
`📚 *Reading STARTED* ✅

🕒 Start Time: *${startText}*
🎯 Daily Target: *8 Hours*

🔥 Keep going Doctor 💪🦷`,
    { parse_mode: "Markdown" }
  );
}

/**
 * STOP READING
 */
export async function stopReadingController(env, chatId, userId) {
  if (!activeSessions.has(userId)) {
    await sendMessage(
      chatId,
      `⚠️ No active reading session found.\n\n📖 Tap *Start Reading* to begin.`
    );
    return;
  }

  const startTime = activeSessions.get(userId);
  const endTime = Date.now();
  activeSessions.delete(userId);

  const result = await saveReadingSession(
    env,
    userId,
    startTime,
    endTime
  );

  const startText = new Date(startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endText = new Date(endTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await sendMessage(
    chatId,
`⏸ *Reading STOPPED* ✅

🕒 Start: *${startText}*
🕒 End: *${endText}*
⏱ Session: *${formatMinutes(result.addedMinutes)}*

📊 Today Total: *${formatMinutes(result.totalMinutes)}*
🎯 Target Left: *${formatMinutes(result.remainingMinutes)}*

🌟 Consistency beats intensity!`,
    { parse_mode: "Markdown" }
  );
}
