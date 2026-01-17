// handlers/start.handler.js
// Handles /start command & master inline keyboard

import { sendMessage } from "../utils/telegram.js";

export async function handleStart(update, env) {
  const chatId = update.message.chat.id;

  const text = `
🌺 *Dr. Arzoo Fatema* 🌺

Welcome ❤️  
Use me to prepare for *GPSC Dental Class-2 Exam* 🦷📚

Choose an option below 👇
  `;

  const keyboard = {
    inline_keyboard: [
      [
        { text: "📚 Start Reading", callback_data: "READ_START" },
        { text: "⏸ Stop Reading", callback_data: "READ_STOP" }
      ],
      [
        { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
        { text: "🎯 MCQ Practice", callback_data: "MCQ_PRACTICE" }
      ],
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" }
      ]
    ]
  };

  await sendMessage(env, chatId, text, keyboard);
}
