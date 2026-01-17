// router/update.router.js

import { handleCommand } from "./command.router.js";
import { handleCallback } from "../handlers/callback.js";

/**
 * Main update router
 * Routes Telegram updates to:
 * - Commands (/start, /help, etc)
 * - Text messages
 * - Callback queries (inline keyboard)
 */
export async function routeUpdate(update, env) {
  try {
    // 1️⃣ CALLBACK QUERY (INLINE BUTTON CLICK)
    if (update.callback_query) {
      return await handleCallback(update.callback_query, env);
    }

    // 2️⃣ MESSAGE
    if (update.message) {
      const message = update.message;
      const text = message.text || "";

      // 2.1️⃣ COMMAND (/start, /xyz)
      if (text.startsWith("/")) {
        return await handleCommand(message, env);
      }

      // 2.2️⃣ NORMAL TEXT MESSAGE (future NLP / chat / ignore)
      return {
        ok: true,
        ignored: true,
        reason: "Non-command text message",
      };
    }

    // 3️⃣ UNKNOWN UPDATE TYPE
    return {
      ok: true,
      ignored: true,
      reason: "Unhandled update type",
    };
  } catch (err) {
    console.error("❌ Update Router Error:", err);
    return {
      ok: false,
      error: err.message,
    };
  }
}
