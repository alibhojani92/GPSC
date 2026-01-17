import { Telegram } from "./telegram.js";
import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";
import { routeMessage } from "./handlers/message.handler.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("GPSC Dental Bot running ✅");
    }

    const update = await request.json();

    // 🔑 CREATE TELEGRAM CLIENT
    env.TELEGRAM = new Telegram(env.BOT_TOKEN);

    // TEXT MESSAGE
    if (update.message) {
      await routeMessage(update, env);
    }

    // CALLBACK QUERY (INLINE BUTTON)
    if (update.callback_query) {
      await handleCallback(update, env);
    }

    return new Response("ok");
  },
};
