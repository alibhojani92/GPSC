/**
 * ENTRY POINT — Cloudflare Worker
 * HARD RULES:
 * - No business logic here
 * - No feature logic
 * - Only routing Telegram updates
 */

import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";
import { TELEGRAM_API } from "./telegram.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    let update;
    try {
      update = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    try {
      // Callback queries (inline buttons)
      if (update.callback_query) {
        await handleCallback(update, env);
        return new Response("OK", { status: 200 });
      }

      // Normal messages (/start, /read, text, etc)
      if (update.message) {
        await handleCommand(update, env);
        return new Response("OK", { status: 200 });
      }

      return new Response("Ignored", { status: 200 });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response("Error", { status: 500 });
    }
  },
};
