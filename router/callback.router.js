import { handleReadingCallback } from "../src/handlers/reading.handler.js";
import { sendComingSoon } from "../src/handlers/message.handler.js";

export async function handleCallback(update, env) {
  const data = update.callback_query?.data || "";

  if (data.startsWith("read_")) {
    return handleReadingCallback(update, env);
  }

  return sendComingSoon(update, env);
}
