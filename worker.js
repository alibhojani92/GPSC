import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";
import { routeMessage } from "./handlers/message.handler.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("GPSC Dental Bot running ✅");
    }

    const update = await request.json();

    // TEXT MESSAGE
    if (update.message) {
      // First: route via message handler (start, reading, etc.)
      await routeMessage(update, env);

      // Then: fallback to command router if needed
      await handleCommand(update, env);
    }

    // CALLBACK QUERY (INLINE BUTTONS)
    if (update.callback_query) {
      await handleCallback(update, env);
    }

    return new Response("ok");
  },
};
