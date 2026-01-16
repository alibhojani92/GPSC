import { handleCommand } from "./src/services/command.router.js";
import { logger } from "./src/services/logger.js";

export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method !== "POST") {
        return new Response("OK", { status: 200 });
      }

      const update = await request.json();
      ctx.waitUntil(processUpdate(update, env));
      return new Response("OK", { status: 200 });

    } catch (err) {
      logger.error("Worker crash", err);
      return new Response("Error", { status: 500 });
    }
  }
};

async function processUpdate(update, env) {
  const message =
    update.message ||
    update.callback_query?.message ||
    null;

  if (!message) return;

  const userId = message.from?.id;
  const chatId = message.chat?.id;

  if (!userId || !chatId) return;

  // 🔐 Admin guard preload
  const isAdmin = env.ADMIN_IDS?.split(",").includes(String(userId));

  await handleCommand({
    update,
    env,
    chatId,
    userId,
    isAdmin
  });
}
