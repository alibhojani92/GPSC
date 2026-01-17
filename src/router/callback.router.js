/**
 * src/router/callback.router.js
 * ----------------------------------
 * Inline Keyboard Callback Router
 * ----------------------------------
 * RULES:
 * - Only routing
 * - No business logic
 * - No DB / KV access
 */

import { handleReadingCallback } from "../handlers/reading.handler";
import { sendComingSoon } from "../handlers/message.handler";

export async function routeCallback(query, ctx) {
  const action = query.data;
  const chatId = query.message.chat.id;

  switch (action) {
    // 📖 Reading
    case "READ_START":
    case "READ_STOP":
      return handleReadingCallback(query, ctx);

    // 📊 Progress
    case "MY_PROGRESS":
      return ctx.telegram.sendMessage(
        chatId,
        "📊 <b>Your progress dashboard is coming soon!</b>\n\nStay consistent 💪🦷"
      );

    // 🧪 Daily Test
    case "DAILY_TEST":
      return sendComingSoon(chatId, ctx, "🧪 Daily Test");

    // ✏️ MCQ Practice
    case "MCQ_PRACTICE":
      return sendComingSoon(chatId, ctx, "✏️ MCQ Practice");

    // 📚 Subject List
    case "SUBJECT_LIST":
      return sendComingSoon(chatId, ctx, "📚 Subject List");

    default:
      return ctx.telegram.sendMessage(
        chatId,
        "⚠️ <b>Unknown action</b>\n\nThis feature will be available soon 🚧"
      );
  }
}
