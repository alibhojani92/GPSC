// src/services/reading.service.js
// A.E.2 – Start Reading (LOGIC ONLY, NO KV/D1) 📖🧠

import { sendMessage } from "../utils/telegram.js";

/**
 * Temporary in-memory tracker
 * ⚠️ This will be replaced by KV/D1 later
 */
const readingSessions = new Map();

/**
 * Start Reading Handler
 * @param {Object} update - Telegram update
 * @param {Object} env - Cloudflare env
 */
export async function startReading(update, env) {
  const message = update.message;
  const chatId = message.chat.id;
  const userName =
    message.from.first_name ||
    message.from.username ||
    "Doctor";

  // 🛑 If already reading
  if (readingSessions.has(chatId)) {
    return sendMessage(env, chatId,
      "📖 You are already in *Reading Mode* ✅\n\n" +
      "⏳ Stay consistent, Doctor!\n" +
      "Use ⏹ *Stop Reading* when you want to pause.",
      { parse_mode: "Markdown" }
    );
  }

  // ▶️ Start reading
  const startedAt = new Date().toISOString();

  readingSessions.set(chatId, {
    startedAt,
    subject: null, // will be added later
  });

  // 🎉 Welcome message
  const text =
    `👋 *Welcome Dr. ${userName}* ❤️🌺\n\n` +
    `📖 *Reading Session Started!* ✅\n\n` +
    `⏱ Start Time: ${new Date().toLocaleTimeString("en-IN")}\n\n` +
    `🧠 Stay focused. Small steps daily = BIG success.\n\n` +
    `👉 When done, tap *Stop Reading* ⏹`;

  return sendMessage(env, chatId, text, {
    parse_mode: "Markdown",
  });
}

/**
 * Utility (TEMP) – used only for testing/debug
 * Will be removed once KV/D1 is added
 */
export function _debugGetReadingSessions() {
  return readingSessions;
}
