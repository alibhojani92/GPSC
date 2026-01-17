import { handleStart } from "../src/handlers/start.handler.js";
import { handleReadingCommand } from "../src/handlers/reading.handler.js";
import { sendUnknownCommand } from "../src/handlers/message.handler.js";

export async function handleCommand(update, env) {
  const text = update.message?.text || "";

  if (text === "/start") {
    return handleStart(update, env);
  }

  if (text === "/read") {
    return handleReadingCommand(update, env);
  }

  return sendUnknownCommand(update, env);
}
