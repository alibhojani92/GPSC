import { startReading, stopReading } from "./reading.service.js";

export async function handleCommand(update, env) {

  /* ================= /start ================= */
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === "/start") {
      return {
        method: "sendMessage",
        chat_id: chatId,
        text:
          "👋 Welcome Dr Arzoo Fatema ❤️🌺\n\n" +
          "USE Me to Prepare GPSC Exam 🦷📚",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "📖 Start Reading", callback_data: "START_READING" },
              { text: "⏹ Stop Reading", callback_data: "STOP_READING" },
            ],
            [
              { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
              { text: "✏️ MCQ Practice", callback_data: "MCQ_PRACTICE" },
            ],
            [
              { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
              { text: "📚 Subject List", callback_data: "SUBJECT_LIST" },
            ],
          ],
        },
      };
    }
  }

  /* ================= INLINE BUTTON ================= */
  if (update.callback_query) {
    const chatId = update.callback_query.message.chat.id;
    const callbackId = update.callback_query.id;
    const action = update.callback_query.data;

    // ✅ FIRST: answer callback (MANDATORY)
    const ack = {
      method: "answerCallbackQuery",
      callback_query_id: callbackId,
    };

    // ✅ SECOND: actual logic
    let response;

    if (action === "START_READING") {
      response = await startReading(chatId, env);
    }

    else if (action === "STOP_READING") {
      response = await stopReading(chatId, env);
    }

    else if (action === "DAILY_TEST") {
      response = {
        method: "sendMessage",
        chat_id: chatId,
        text: "📝 Daily Test will start soon ⏳",
      };
    }

    else if (action === "MCQ_PRACTICE") {
      response = {
        method: "sendMessage",
        chat_id: chatId,
        text: "✏️ MCQ Practice mode coming next 📚",
      };
    }

    else if (action === "MY_PROGRESS") {
      response = {
        method: "sendMessage",
        chat_id: chatId,
        text: "📊 Your progress will appear here 📈",
      };
    }

    else if (action === "SUBJECT_LIST") {
      response = {
        method: "sendMessage",
        chat_id: chatId,
        text: "📚 Subject list loading… 🦷",
      };
    }

    // ⚠️ Cloudflare Worker can return ONLY ONE response
    // So we return MESSAGE, and Telegram auto-accepts callback
    return response || ack;
  }

  return { ok: true };
}
