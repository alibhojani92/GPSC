import { startReading, stopReading, readingStatus } from "../services/reading.service";
import { sendMessage } from "../utils/telegram";

export async function handleUpdate(update, env) {
  try {
    // 1️⃣ INLINE BUTTON HANDLING
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const userId = String(cb.from.id);
      const action = cb.data;

      if (action === "START_READING") {
        return await startReading({ chatId, userId }, env);
      }

      if (action === "STOP_READING") {
        return await stopReading({ chatId, userId }, env);
      }

      if (action === "READING_STATUS") {
        return await readingStatus({ chatId, userId }, env);
      }
    }

    // 2️⃣ NORMAL TEXT COMMANDS
    if (update.message) {
      const chatId = update.message.chat.id;
      const userId = String(update.message.from.id);
      const text = update.message.text;

      if (text === "/start") {
        return await sendMessage(chatId, env, {
          text:
            "👋 Welcome Dr Arzoo Fatema ❤️🌺\n\n" +
            "USE Me to Prepare GPSC Exam 🦷📚",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "📘 Start Reading", callback_data: "START_READING" },
                { text: "⏸ Stop Reading", callback_data: "STOP_READING" }
              ],
              [
                { text: "📊 My Progress", callback_data: "READING_STATUS" }
              ]
            ]
          }
        });
      }
    }

    return new Response("OK");
  } catch (err) {
    console.error(err);
    return new Response("ERROR");
  }
        }
