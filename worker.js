// src/worker.js
import { handleUpdate } from "./router/command.router.js";

/**
 * MASTER BOT – Dental GPSC (Pulse Edition 18)
 * Entry Point (Cloudflare Worker)
 * ONE-SHOT FINAL VERSION
 */

export default {
  async fetch(request, env, ctx) {
    try {
      // Health check
      if (request.method === "GET") {
        return new Response(
          JSON.stringify({
            ok: true,
            service: "Dental GPSC Master Bot",
            status: "running",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // Only POST allowed for Telegram
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      // Parse Telegram update
      const update = await request.json();

      // Route update
      await handleUpdate(update, env);

      // Telegram requires fast 200 OK
      return new Response("OK", { status: 200 });

    } catch (error) {
      console.error("Worker Error:", error);
      return new Response("Internal Error", { status: 500 });
    }
  },
};
