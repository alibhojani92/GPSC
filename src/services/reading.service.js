// reading.service.js
// A.E.5 – Reading & Target Engine (FINAL LOCKED)

const DAILY_TARGET_MINUTES = 480; // 8 hours

/* ================= HELPERS ================= */

function nowIST() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

function todayKey() {
  return nowIST().toISOString().slice(0, 10);
}

function mmToHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/* ================= START READING ================= */

export async function startReading(update, env) {
  const userId = update.message.from.id;
  const chatId = update.message.chat.id;
  const key = `reading:${userId}`;
  const today = todayKey();

  const active = await env.SESSION_KV.get(key, { type: "json" });
  if (active && active.date === today) {
    return send(
      chatId,
      `🌺 Dr. Arzoo Fatema 🌺

📖 Reading already running
⏳ Started at: ${active.startTime}

Keep going 💪🦷`
    );
  }

  const start = nowIST();
  const startTime = start.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await env.SESSION_KV.put(
    key,
    JSON.stringify({
      startISO: start.toISOString(),
      startTime,
      date: today,
    })
  );

  await notifyAdmin(
    env,
    `📚 Reading STARTED
👩‍⚕️ Student: ${userId}
🕒 Time: ${startTime}`
  );

  return send(
    chatId,
    `🌺 Dr. Arzoo Fatema 🌺

📚 Reading STARTED ✅
🕒 Start Time: ${startTime}
🎯 Daily Target: 08:00 hours

🔥 Keep going Doctor 💪🦷`
  );
}

/* ================= STOP READING ================= */

export async function stopReading(update, env) {
  const userId = update.message.from.id;
  const chatId = update.message.chat.id;
  const key = `reading:${userId}`;
  const today = todayKey();

  const active = await env.SESSION_KV.get(key, { type: "json" });
  if (!active || active.date !== today) {
    return send(
      chatId,
      `🌺 Dr. Arzoo Fatema 🌺

⚠️ No active reading session found
Start reading first 📖`
    );
  }

  const start = new Date(active.startISO);
  const end = nowIST();
  const minutes = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 60000)
  );

  // save to D1
  await env.DB.prepare(
    `INSERT INTO reading_log (user_id, date, minutes)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, date)
     DO UPDATE SET minutes = minutes + excluded.minutes`
  )
    .bind(userId, today, minutes)
    .run();

  await env.SESSION_KV.delete(key);

  const row = await env.DB.prepare(
    `SELECT minutes FROM reading_log WHERE user_id=? AND date=?`
  )
    .bind(userId, today)
    .first();

  const totalToday = row?.minutes || minutes;
  const remaining = Math.max(0, DAILY_TARGET_MINUTES - totalToday);

  const endTime = end.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await notifyAdmin(
    env,
    `📕 Reading STOPPED
👩‍⚕️ Student: ${userId}
⏱️ Session: ${mmToHHMM(minutes)}
📊 Today Total: ${mmToHHMM(totalToday)}`
  );

  return send(
    chatId,
    `🌺 Dr. Arzoo Fatema 🌺

📕 Reading STOPPED ✅

🕒 Start: ${active.startTime}
🕔 End: ${endTime}
⏱️ Session: ${mmToHHMM(minutes)}

📊 Today Total: ${mmToHHMM(totalToday)}
🎯 Target: 08:00
⏳ Remaining: ${mmToHHMM(remaining)}

🌟 Consistency brings success 🦷📘`
  );
}

/* ================= UTIL ================= */

function send(chatId, text) {
  return {
    method: "POST",
    body: JSON.stringify({
      method: "sendMessage",
      chat_id: chatId,
      text,
    }),
  };
}

async function notifyAdmin(env, text) {
  if (!env.ADMIN_ID) return;
  await fetch("https://api.telegram.org/bot" + env.BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.ADMIN_ID,
      text,
    }),
  });
          }
