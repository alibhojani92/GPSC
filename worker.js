// worker.js
import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Telegram webhook only sends POST
      if (request.method !== "POST") {
        return new Response("GPSC Dental Bot Running ✅", { status: 200 });
      }

      const update = await request.json();

      // 🔹 Message commands (/start, /read, etc.)
      if (update.message) {
        await handleCommand(update, env);
      }

      // 🔹 Inline keyboard callbacks
      if (update.callback_query) {
        await handleCallback(update, env);
      }

      return new Response("OK", { status: 200 });

    } catch (err) {
      console.error("Worker Error:", err);
      return new Response("Internal Error", { status: 500 });
    }
  }
};
