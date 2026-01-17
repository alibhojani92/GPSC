import { handleUpdate } from "./command.router";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK ✅");
    }

    const update = await request.json();
    return await handleUpdate(update, env);
  },
};
