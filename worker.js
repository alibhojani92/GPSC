export default {
  async fetch(req, env) {
    const update = await req.json();

    // ========== /start ==========
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;
      return sendMenu(chatId, env);
    }

    // ========== INLINE BUTTONS ==========
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const action = update.callback_query.data;

      let text = "⚠️ Unknown action";

      switch (action) {
        case "START_READING":
          text = "📚 Reading STARTED ✅\n⏱ Time tracking ON";
          break;

        case "STOP_READING":
          text = "⏸ Reading STOPPED ✅\n🛌 Take rest & resume later";
          break;

        case "DAILY_TEST":
          text = "📝 Daily Test will start soon ⏳";
          break;

        case "MCQ_PRACTICE":
          text = "✍️ MCQ Practice mode coming 📚";
          break;

        case "MY_PROGRESS":
          text = "📊 Your progress will be shown here 📈";
          break;

        case "SUBJECT_LIST":
          text = "📚 Subject list loading...";
          break;

        case "SET_TARGET":
          text = "🎯 Target setting coming soon";
          break;

        case "REMINDER":
          text = "⏰ Reading reminders will be configured";
          break;

        case "SETTINGS":
          text = "⚙️ Settings panel coming";
          break;

        case "HELP":
          text = "❓ Help section coming soon";
          break;
      }

      return sendText(chatId, text, env);
    }

    return new Response("OK");
  }
};

// ================= HELPERS =================

async function sendMenu(chatId, env) {
  const payload = {
    chat_id: chatId,
    text:
      "👋 Welcome Dr Arzoo Fatema ❤️🌺\n\n" +
      "USE me to prepare for GPSC Dental Exam 🦷📚\n\n" +
      "👇 Choose an action",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📚 Start Reading", callback_data: "START_READING" },
          { text: "⏸ Stop Reading", callback_data: "STOP_READING" }
        ],
        [
          { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
          { text: "✍️ MCQ Practice", callback_data: "MCQ_PRACTICE" }
        ],
        [
          { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
          { text: "📚 Subject List", callback_data: "SUBJECT_LIST" }
        ],
        [
          { text: "🎯 Set Target", callback_data: "SET_TARGET" },
          { text: "⏰ Reading Reminder", callback_data: "REMINDER" }
        ],
        [
          { text: "⚙️ Settings", callback_data: "SETTINGS" },
          { text: "❓ Help", callback_data: "HELP" }
        ]
      ]
    }
  };

  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return new Response("OK");
}

async function sendText(chatId, text, env) {
  const payload = {
    chat_id: chatId,
    text
  };

  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return new Response("OK");
}
