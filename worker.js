/**
 * ROOT ENTRY — Cloudflare Worker
 * ONLY job:
 *  - Receive Telegram webhook
 *  - Forward update to router
 *  - Never crash
 */

import { handleCommand } from "./src/router/command.router.js";
import { handleCallback } from "./src/router/callback.router.js";
import { createTelegramClient } from "./src/telegram.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Only POST from Telegram
      if (request.method !== "POST") {
        return new Response("OK", { status: 200 });
      }

      const update = await request.json();

      // Attach telegram client once
      env.TELEGRAM = createTelegramClient(env.BOT_TOKEN);

      // Message (commands, text)
      if (update.message) {
        await handleCommand(update, env);
        return new Response("OK", { status: 200 });
      }

      // Callback query (inline keyboard)
      if (update.callback_query) {
        await handleCallback(update, env);
        return new Response("OK", { status: 200 });
      }

      return new Response("OK", { status: 200 });
    } catch (err) {
      // 🔥 NEVER let worker crash
      console.error("WORKER ERROR:", err);
      return new Response("OK", { status: 200 });
    }
  },
};
