// utils/telegram.js
// Master Telegram helper – DO NOT PATCH LATER

export async function tgSend(env, payload) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function tgEdit(env, payload) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/editMessageText`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function tgAnswerCallback(env, callback_query_id, text = "") {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id,
      text,
      show_alert: false,
    }),
  });
}

/* ================================
   MASTER INLINE KEYBOARD
================================ */

export function masterKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📚 Start Reading", callback_data: "READ_START" },
        { text: "⏸ Stop Reading", callback_data: "READ_STOP" },
      ],
      [
        { text: "📝 Daily Test", callback_data: "TEST_DAILY" },
        { text: "🧪 MCQ Practice", callback_data: "MCQ_PRACTICE" },
      ],
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" },
      ],
    ],
  };
}

/* ================================
   STANDARD INTRO TEXT
================================ */

export function introText() {
  return (
    "🌺 *Welcome Dr. Arzoo Fatema* 🌺\n\n" +
    "🦷 *GPSC Dental Class-2 Preparation Bot*\n\n" +
    "✨ Use me to:\n" +
    "• Track daily reading\n" +
    "• Practice MCQs\n" +
    "• Give tests\n" +
    "• Monitor progress\n\n" +
    "💪 Consistency beats intensity!"
  );
        }
