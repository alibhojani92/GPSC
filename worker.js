/**
 * GPSC Dental Bot – Worker Entry
 * Stable Build – Cloudflare Workers
 */

import { sendMessage, sendKeyboard } from "./src/telegram.js";

/* ================= ENTRY ================= */
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ ok: true, message: "Bot alive ✅" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const update = await request.json();

    try {
      if (update.message) {
        await handleMessage(update.message, env);
      }

      if (update.callback_query) {
        await handleCallback(update.callback_query, env);
      }

      return new Response(JSON.stringify({ ok: true }));
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }
  },
};

/* ================= MESSAGE HANDLER ================= */
async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = message.text?.trim() || "";

  // /start command
  if (text === "/start") {
    await sendStart(chatId, env);
    return;
  }

  // Text command fallback
  await sendMessage(
    chatId,
    "🚧 Feature coming soon\n\nUse the buttons below 👇",
    env
  );
}

/* ================= CALLBACK HANDLER ================= */
async function handleCallback(query, env) {
  const chatId = query.message.chat.id;
  const action = query.data;

  switch (action) {
    case "READ_START":
      await sendMessage(chatId, "📚 Reading STARTED ✅", env);
      break;

    case "READ_STOP":
      await sendMessage(chatId, "⏸ Reading STOPPED ✅", env);
      break;

    case "DAILY_TEST":
      await sendMessage(chatId, "📝 Daily Test coming soon", env);
      break;

    case "MCQ_PRACTICE":
      await sendMessage(chatId, "📖 MCQ Practice coming soon", env);
      break;

    case "PROGRESS":
      await sendMessage(chatId, "📊 Progress feature coming soon", env);
      break;

    case "SUBJECTS":
      await sendMessage(chatId, "📚 Subject list coming soon", env);
      break;

    default:
      await sendMessage(chatId, "⚠️ Feature coming soon", env);
  }
}

/* ================= START MESSAGE ================= */
async function sendStart(chatId, env) {
  const text = `🌺 *Dr. Arzoo Fatema* 🌺

Welcome Doctor ❤️🦷  
This bot will help you prepare for  
🎯 *GPSC Dental Class-2 Exam*

📌 Use the buttons below to:
• Track daily reading
• Practice MCQs
• Attempt tests
• Analyze performance

💪 Let’s build consistency, not stress`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: "📚 Start Reading", callback_data: "READ_START" },
        { text: "⏸ Stop Reading", callback_data: "READ_STOP" },
      ],
      [
        { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
        { text: "📖 MCQ Practice", callback_data: "MCQ_PRACTICE" },
      ],
      [
        { text: "📊 My Progress", callback_data: "PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECTS" },
      ],
    ],
  };

  await sendKeyboard(chatId, text, keyboard, env);
}
