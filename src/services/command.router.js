import { startReading, stopReading } from "./reading.service.js";

export async function handleCommand(update, env) {
  /* ---------------- MESSAGE (/start) ---------------- */
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

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

  /* ---------------- INLINE BUTTON CLICK ---------------- */
  if (update.callback_query) {
    const chatId = update.callback_query.message.chat.id;
    const action = update.callback_query.data;

    if (action === "START_READING") {
      return await startReading(chatId, env);
    }

    if (action === "STOP_READING") {
      return await stopReading(chatId, env);
    }

    if (action === "DAILY_TEST") {
      return {
        method: "sendMessage",
        chat_id: chatId,
        text: "📝 Daily Test feature coming next 🚀",
      };
    }

    if (action === "MCQ_PRACTICE") {
      return {
        method: "sendMessage",
        chat_id: chatId,
        text: "✏️ MCQ Practice activated soon 📚",
      };
    }

    if (action === "MY_PROGRESS") {
      return {
        method: "sendMessage",
        chat_id: chatId,
        text: "📊 Progress tracking will be shown here 📈",
      };
    }

    if (action === "SUBJECT_LIST") {
      return {
        method: "sendMessage",
        chat_id: chatId,
        text: "📚 Subject list loading soon 🦷",
      };
    }
  }

  /* ---------------- FALLBACK ---------------- */
  return {
    ok: true,
  };
  }
