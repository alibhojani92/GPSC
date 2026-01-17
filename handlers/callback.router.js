// handlers/callback.router.js
// Routes all inline keyboard callbacks

import { handleReadStart, handleReadStop } from "./reading.handler.js";
import { sendMessage } from "../utils/telegram.js";

export async function handleCallback(update, env) {
  const query = update.callback_query;
  const chatId = query.message.chat.id;
  const action = query.data;

  // Remove loading state on button
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: query.id
    })
  });

  switch (action) {

    case "READ_START":
      return handleReadStart(chatId, query.from.id, env);

    case "READ_STOP":
      return handleReadStop(chatId, query.from.id, env);

    case "DAILY_TEST":
      return sendMessage(
        env,
        chatId,
        "📝 Daily Test will start at 11:00 PM ⏰\nStay prepared Doctor 💪🦷"
      );

    case "MCQ_PRACTICE":
      return sendMessage(
        env,
        chatId,
        "🎯 MCQ Practice Mode\nUse /mcq to practice subject-wise questions 📚"
      );

    case "MY_PROGRESS":
      return sendMessage(
        env,
        chatId,
        "📊 Progress feature coming next 🚀\nReading + Tests + Reports"
      );

    case "SUBJECT_LIST":
      return sendMessage(
        env,
        chatId,
        "📚 Subjects:\n• Oral Anatomy\n• Oral Pathology\n• Prosthodontics\n• Periodontology\n• Conservative Dentistry\n• Public Health Dentistry"
      );

    default:
      return sendMessage(env, chatId, "⚠️ Unknown action");
  }
}
