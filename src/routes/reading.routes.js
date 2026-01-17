/**
 * src/routes/reading.routes.js
 * ----------------------------------
 * Reading routes: commands + callbacks
 */

import {
  startReadingController,
  stopReadingController,
} from "../controllers/reading.controller.js";

/**
 * Register reading related routes
 */
export function registerReadingRoutes(router) {
  /**
   * COMMAND: /read
   */
  router.command("read", async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    await startReadingController(ctx.env, chatId, userId);
  });

  /**
   * COMMAND: /stop
   */
  router.command("stop", async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    await stopReadingController(ctx.env, chatId, userId);
  });

  /**
   * INLINE BUTTON: Start Reading
   */
  router.callback("start_reading", async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    await startReadingController(ctx.env, chatId, userId);
  });

  /**
   * INLINE BUTTON: Stop Reading
   */
  router.callback("stop_reading", async (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;

    await stopReadingController(ctx.env, chatId, userId);
  });
}
