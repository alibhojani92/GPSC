export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("GPSC Dental Bot Running ✅");
    }

    const update = await request.json();

    // TEXT MESSAGE
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === "/start") {
        await send(chatId, env,
`🌺 Welcome Dr. Arzoo Fatema 🌺

Use me to prepare for GPSC Dental Exam 🦷

📚 Start Reading
⏸ Stop Reading
📊 My Progress`);

        await sendButtons(chatId, env);
      }
    }

    // INLINE BUTTONS
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const action = update.callback_query.data;

      if (action === "START_READING") {
        await startReading(chatId, env);
      }

      if (action === "STOP_READING") {
        await stopReading(chatId, env);
      }
    }

    return new Response("OK");
  },
};

// ---------------- HELPERS ----------------

async function send(chatId, env, text) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function sendButtons(chatId, env) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "Choose an action 👇",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📚 Start Reading", callback_data: "START_READING" }],
          [{ text: "⏸ Stop Reading", callback_data: "STOP_READING" }],
        ],
      },
    }),
  });
}

// ---------------- READING LOGIC ----------------

const TARGET_MIN = 480;

async function startReading(chatId, env) {
  const key = `reading:${chatId}`;
  const existing = await env.KV.get(key, "json");

  if (existing) {
    await send(chatId, env, "⚠️ Reading already in progress 📖");
    return;
  }

  const start = Date.now();
  await env.KV.put(key, JSON.stringify({ start }));

  await send(chatId, env,
`📚 Reading STARTED ✅
🕒 Start Time: ${formatTime(start)}
🎯 Daily Target: 8 Hours
🔥 Keep going Doctor 💪🦷`);
}

async function stopReading(chatId, env) {
  const key = `reading:${chatId}`;
  const session = await env.KV.get(key, "json");

  if (!session) {
    await send(chatId, env, "⚠️ No active reading session");
    return;
  }

  const end = Date.now();
  const duration = Math.floor((end - session.start) / 60000);

  const todayKey = `total:${chatId}:${today()}`;
  const prev = Number(await env.KV.get(todayKey)) || 0;
  const total = prev + duration;

  await env.KV.put(todayKey, String(total));
  await env.KV.delete(key);

  await send(chatId, env,
`⏸ Reading STOPPED ✅

🕒 Start: ${formatTime(session.start)}
🕒 End: ${formatTime(end)}
⏱ Duration: ${formatDur(duration)}

📊 Today Total: ${formatDur(total)}
🎯 Target Left: ${formatDur(Math.max(TARGET_MIN - total, 0))}

🌟 Consistency beats intensity!`);
}

// ---------------- UTILS ----------------

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDur(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
  }
