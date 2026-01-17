// ================= GLOBAL STATE (TEMP) =================
const readingSessions = {};   // { chatId: startTimestamp }
const dailyTotals = {};       // { chatId: minutes }

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
        if (readingSessions[chatId]) {
          text =
            "⚠️ Reading already started 📖\n" +
            "⏱ Time is running...\n" +
            "👉 Press ⏸ Stop Reading when done";
        } else {
          readingSessions[chatId] = Date.now();
          text =
            "📚 Reading STARTED ✅\n\n" +
            "🕒 Start Time: " + formatTime(new Date()) + "\n" +
            "🎯 Daily Target: 8 Hours\n\n" +
            "🔥 Keep going Doctor 💪🦷";
        }
      }

      // ===== STOP READING =====
      if (action === "STOP_READING") {
        if (!readingSessions[chatId]) {
          text =
            "⚠️ No active reading session found 🤔\n" +
            "👉 Press 📚 Start Reading to begin";
        } else {
          const start = readingSessions[chatId];
          const end = Date.now();
          delete readingSessions[chatId];

          const minutes = Math.floor((end - start) / 60000);
          dailyTotals[chatId] = (dailyTotals[chatId] || 0) + minutes;

          const totalMin = dailyTotals[chatId];
          const remaining = Math.max(480 - totalMin, 0);

          text =
            "⏸ Reading STOPPED ✅\n\n" +
            "⏱ Session Duration: " + formatDuration(minutes) + "\n\n" +
            "📊 Today Total: " + formatDuration(totalMin) + "\n" +
            "🎯 Target Left: " + formatDuration(remaining) + "\n\n" +
            "🌟 Consistency beats intensity!";
        }
      }

      // ===== OTHER BUTTONS (PLACEHOLDER) =====
      if (action === "DAILY_TEST") text = "📝 Daily Test coming soon ⏳";
      if (action === "MCQ_PRACTICE") text = "✍️ MCQ Practice coming 📚";
      if (action === "MY_PROGRESS") text = "📊 Progress will appear here";
      if (action === "SUBJECT_LIST") text = "📚 Subject list loading...";
      if (action === "SET_TARGET") text = "🎯 Target setting coming soon";
      if (action === "REMINDER") text = "⏰ Reminder settings coming";
      if (action === "SETTINGS") text = "⚙️ Settings coming";
      if (action === "HELP") text = "❓ Help coming";

      return sendText(chatId, text, env);
    }

    return new Response("OK");
  }
};

// ================= HELPERS =================

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
