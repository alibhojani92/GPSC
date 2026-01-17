export default {
  async fetch(req, env) {
    const update = await req.json();

    // ---------- /start command ----------
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;

      return sendMenu(chatId, env);
    }

    // ---------- Inline button click ----------
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const action = update.callback_query.data;

      let text = "⚠️ Unknown action";

      if (action === "START_READING") {
        text = "📚 Reading STARTED ✅\n⏱ Time tracking ON";
      }

      if (action === "STOP_READING") {
        text = "⏸ Reading STOPPED ✅\n🛌 Take rest & resume later";
      }

      if (action === "DAILY_TEST") {
        text = "📝 Daily Test will start soon ⏳";
      }

      return sendText(chatId, text, env);
    }

    return new Response("OK");
  }
};

// ---------- Helpers ----------

async function sendMenu(chatId, env) {
  const payload = {
    chat_id: chatId,
    text:
      "👋 Welcome Dr Arzoo Fatema ❤️🌺\n\n" +
      "USE me to prepare for GPSC Dental Exam 🦷📚\n\n" +
      "👇 Use buttons below",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📚 Start Reading", callback_data: "START_READING" },
          { text: "⏸ Stop Reading", callback_data: "STOP_READING" }
        ],
        [
          { text: "📝 Daily Test", callback_data: "DAILY_TEST" }
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
