// worker.js (ROOT LEVEL)
import { handleUpdate } from "./router/command.router.js";

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === "GET") {
        return new Response("Dental GPSC Bot Running ✅", { status: 200 });
      }

      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      const update = await request.json();
      await handleUpdate(update, env);

      return new Response("OK", { status: 200 });
    } catch (err) {
      return new Response("Internal Error", { status: 500 });
    }
  }
};
