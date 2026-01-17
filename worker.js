// ===============================
// MASTER BOT – worker.js
// Entry point for Cloudflare Worker
// ===============================

import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";
import { sendMessage } from "./utils/telegram.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Only POST from Telegram
      if (request.method !== "POST") {
        return new Response("OK", { status: 200 });
      }

      const update = await request.json();

      // Callback query (inline keyboard)
      if (update.callback_query) {
        await handleCallback(update, env);
        return new Response("OK");
      }

      // Message
      if (update.message) {
        const text = update.message.text || "";

        // Command (starts with /)
        if (text.startsWith("/")) {
          await handleCommand(update, env);
          return new Response("OK");
        }

        // Non-command text (fallback)
        await sendMessage(
          env,
          update.message.chat.id,
          "🚧 This feature is coming soon\n\nUse the buttons below 👇"
        );
        return new Response("OK");
      }

      return new Response("OK");
    } catch (err) {
      console.error("Worker Error:", err);
      return new Response("Error", { status: 500 });
    }
  },
};
