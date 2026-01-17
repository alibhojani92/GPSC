export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    const update = await request.json();
    const TG = `https://api.telegram.org/bot${env.BOT_TOKEN}`;

    /* ================= /start ================= */
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === "/start") {
        await fetch(`${TG}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        });
      }
    }

    /* ================= INLINE BUTTONS ================= */
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const action = update.callback_query.data;
      const callbackId = update.callback_query.id;

      // ✅ REQUIRED: answer callback
      await fetch(`${TG}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackId }),
      });

      let text = "";

      if (action === "START_READING")
        text = "📖 Reading STARTED ✅\n⏱ Time tracking ON";

      else if (action === "STOP_READING")
        text = "⏸ Reading STOPPED ✅\nTake rest & resume later";

      else if (action === "DAILY_TEST")
        text = "📝 Daily Test coming soon ⏳";

      else if (action === "MCQ_PRACTICE")
        text = "✏️ MCQ Practice loading 📚";

      else if (action === "MY_PROGRESS")
        text = "📊 Your progress will appear here 📈";

      else if (action === "SUBJECT_LIST")
        text = "📚 Subject list loading… 🦷";

      if (text) {
        await fetch(`${TG}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }));
  },
};
