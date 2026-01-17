/**
 * src/router/command.router.js
 * ----------------------------------
 * Telegram Command Router
 * ----------------------------------
 * RULES:
 * - Only routing
 * - No business logic
 * - No Telegram API calls
 */

import { handleStart } from "../handlers/start.handler";
import { handleReadingCommand } from "../handlers/reading.handler";
import { sendUnknownCommand } from "../handlers/message.handler";

export async function routeCommand(message, ctx) {
  const text = message.text || "";
  const chatId = message.chat.id;

  // Extract command (remove bot username if exists)
  const command = text.split(" ")[0].split("@")[0];

  switch (command) {
    case "/start":
      return handleStart(message, ctx);

    case "/read":
    case "/reading":
      return handleReadingCommand(message, ctx);

    case "/progress":
      return ctx.telegram.sendMessage(
        chatId,
        "📊 <b>Your progress section is coming soon!</b>\n\nStay consistent 💪🦷"
      );

    case "/help":
      return ctx.telegram.sendMessage(
        chatId,
        "ℹ️ <b>Help</b>\n\nUse the buttons below to navigate the bot 👇"
      );

    default:
      return sendUnknownCommand(message, ctx);
  }
}
  
