import { handleStart } from "./services/user.service";
import {
  startReading,
  stopReading,
} from "./services/reading.service";

export async function handleUpdate(update, env) {
  // /start command
  if (update.message?.text === "/start") {
    return await handleStart(update, env);
  }

  // Inline keyboard buttons
  if (update.callback_query) {
    const action = update.callback_query.data;
    const chatId = update.callback_query.message.chat.id;

    if (action === "START_READING") {
      return await startReading(chatId, env);
    }

    if (action === "STOP_READING") {
      return await stopReading(chatId, env);
    }
  }

  return new Response("OK");
}
