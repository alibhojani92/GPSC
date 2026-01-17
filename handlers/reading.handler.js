// handlers/reading.handler.js
// Routes reading-related commands & buttons

import { startReading, stopReading } from "../services/reading.service.js";
import { sendMessage } from "../utils/telegram.js";

export async function handleReadingCommand(update, env) {
  const message = update.message;
  const userId = message.from.id;
  const text = (message.text || "").toLowerCase();

  let response;

  if (text === "/read" || text === "start reading") {
    response = await startReading(env, userId);
  } else if (text === "/stop" || text === "stop reading") {
    response = await stopReading(env, userId);
  } else {
    return;
  }

  await sendMessage(env, message.chat.id, response.text);
}

export async function handleReadingCallback(update, env) {
  const callback = update.callback_query;
  const userId = callback.from.id;
  const chatId = callback.message.chat.id;
  const action = callback.data;

  let response;

  if (action === "READ_START") {
    response = await startReading(env, userId);
  } else if (action === "READ_STOP") {
    response = await stopReading(env, userId);
  } else {
    return;
  }

  await sendMessage(env, chatId, response.text);
}
