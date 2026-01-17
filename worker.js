import { handleCommand } from "./src/router/command.router.js";
import { handleCallback } from "./src/router/callback.router.js";
import { getEnv } from "./src/env.js";
import { sendMessage } from "./src/utils/telegram.js";

export default {
  async fetch(request, env, ctx) {
    const ENV = getEnv(env);

    // Health check (browser / uptime monitor)
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          ok: true,
          bot: "Dental GPSC Master Bot",
          status: "running",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Telegram always sends POST
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let update;
    try {
      update = await request.json();
    } catch (err) {
      return new Response("Invalid JSON", { status: 400 });
    }

    try {
      // Inline keyboard callbacks
      if (update.callback_query) {
        await handleCallback(update.callback_query, ENV);
        return new Response("OK");
      }

      // Normal messages & commands
      if (update.message) {
        await handleCommand(update.message, ENV);
        return new Response("OK");
      }

      // Other update types ignored safely
      return new Response("IGNORED");
    } catch (error) {
      console.error("Worker Error:", error);

      // Notify admin if possible
      if (ENV.ADMIN_ID) {
        try {
          await sendMessage(
            ENV,
            ENV.ADMIN_ID,
            "⚠️ Bot Error\n\n" + (error.message || "Unknown error")
          );
        } catch (_) {}
      }

      return new Response("Internal Error", { status: 500 });
    }
  },
};
