import { handleCommand } from "./router/command.router.js";
import { handleCallback } from "./router/callback.router.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("GPSC Bot Running ✅", { status: 200 });
    }

    const update = await request.json();

    if (update.message) {
      await handleCommand(update, env);
    }

    if (update.callback_query) {
      await handleCallback(update, env);
    }

    return new Response("OK", { status: 200 });
  }
};
