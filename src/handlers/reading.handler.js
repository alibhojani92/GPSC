/**
 * src/handlers/reading.handler.js
 * ----------------------------------
 * Handles reading start / stop (logic only)
 */

import { sendMessage } from "../telegram.js";

/**
 * In-memory session holder (temporary)
 * Will be replaced by KV/D1 later
 */
const readingSessions = new Map();

/**
 * START READING
 */
export async function handleStartReading(chatId, userId) {
  if (readingSessions.has(userId)) {
    await sendMessage(
      chatId,
      `⚠️ Reading already in progress.\n\n⏸ Tap *Stop Reading* when you finish.`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  const startTime = Date.now();
  readingSessions.set(userId, startTime);

  const timeText = new Date(startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await sendMessage(
    chatId,
    `📚 *Reading STARTED* ✅

🕒 Start Time: *${timeText}*
🎯 Daily Target: *8 Hours*

🔥 Keep going Doctor 💪🦷`,
    { parse_mode: "Markdown" }
  );
}

/**
 * STOP READING
 */
export async function handleStopReading(chatId, userId) {
  if (!readingSessions.has(userId)) {
    await sendMessage(
      chatId,
      `⚠️ No active reading session found.\n\n📖 Tap *Start Reading* to begin.`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  const startTime = readingSessions.get(userId);
  const endTime = Date.now();
  readingSessions.delete(userId);

  const durationMs = endTime - startTime;
  const minutes = Math.floor(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

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
⏱ Duration: *${hours}h ${mins}m*

🌟 Consistency beats intensity!`,
    { parse_mode: "Markdown" }
  );
}
