import { handleCommand } from "./src/services/command.router.js";
import { logger } from "./src/services/logger.js";

export default {
  async fetch(request, env) {
    const update = await request.json().catch(() => null);

    logger.info("Incoming update");

    const res = await handleCommand(update, env);
    return new Response(JSON.stringify(res), { status: 200 });
  },
};
