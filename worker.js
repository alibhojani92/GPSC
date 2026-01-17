// ================= WORKER =================
export default {
  async fetch(req, env) {
    const update = await req.json();

    // ---------- /start ----------
    if (update.message && update.message.text === "/start") {
      const chatId = update.message.chat.id;
      return sendMenu(chatId, env);
    }

    // ---------- INLINE BUTTONS ----------
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const action = update.callback_query.data;

      let text = "⚠️ Unknown action";

      // ===== START READING =====
      if (action === "START_READING") {
        const sessionKey = `session:${chatId}`;
        const existing = await env.READING_KV.get(sessionKey);

        if (existing) {
          text =
            "⚠️ Reading already started 📖\n" +
            "⏱ Time is running...\n" +
            "👉 Press ⏸ Stop Reading when done";
        } else {
          const startTime = Date.now();
          await env.READING_KV.put(
            sessionKey,
            JSON.stringify({ startTime })
          );

          text =
            "📚 Reading STARTED ✅\n\n" +
            "🕒 Start Time: " + formatTime(new Date(startTime)) + "\n" +
            "🎯 Daily Target: 8 Hours\n\n" +
            "🔥 Keep going Doctor 💪🦷";
        }
      }

      // ===== STOP READING =====
      if (action === "STOP_READING") {
        const sessionKey = `session:${chatId}`;
        const session = await env.READING_KV.get(sessionKey, "json");

        if (!session) {
          text =
            "⚠️ No active reading session 🤔\n" +
            "👉 Press 📚 Start Reading to begin";
        } else {
          const end = Date.now();
          const minutes = Math.floor((end - session.startTime) / 60000);

          await env.READING_KV.delete(sessionKey);

          const date = today();
          const dailyKey = `daily:${chatId}:${date}`;
          const prev = await env.READING_KV.get(dailyKey);
          const total = (parseInt(prev || "0") + minutes);

          await env.READING_KV.put(dailyKey, total.toString());

          const remaining = Math.max(480 - total, 0);

          text =
            "⏸ Reading STOPPED ✅\n\n" +
            "⏱ Session Duration: " + formatDuration(minutes) + "\n\n" +
            "📊 Today Total: " + formatDuration(total) + "\n" +
            "🎯 Target Left: " + formatDuration(remaining) + "\n\n" +
            "🌟 Consistency beats intensity!";
        }
      }

      // ===== OTHER BUTTONS =====
      if (action === "DAILY_TEST") text = "📝 Daily Test coming soon ⏳";
      if (action === "MCQ_PRACTICE") text = "✍️ MCQ Practice coming 📚";
      if (action === "MY_PROGRESS") text = "📊 Progress loading...";
      if (action === "SUBJECT_LIST") text = "📚 Subject list loading...";
      if (action === "SET_TARGET") text = "🎯 Target setting coming soon";
      if (action === "REMINDER") text = "⏰ Reading reminder coming";
      if (action === "SETTINGS") text = "⚙️ Settings coming";
      if (action === "HELP") text = "❓ Help coming";

      return sendText(chatId, text, env);
    }

    return new Response("OK");
  }
};

// ================= HELPERS =================
function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

async function sendMenu(chatId, env) {
  const payload = {
    chat_id: chatId,
    text:
      "👋 Welcome Dr Arzoo Fatema ❤️🌺\n\n" +
      "USE me to prepare for GPSC Dental Exam 🦷📚\n\n" +
      "🎯 Daily Target: 8 Hours\n\n" +
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
  const payload = { chat_id: chatId, text };

  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return new Response("OK");
      }
