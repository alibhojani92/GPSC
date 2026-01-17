// command.router.js

import { startReading, stopReading } from "./services/reading.service.js";

export async function handleCommand(update, env) {
  const message = update.message || update.callback_query?.message;
  const data = update.callback_query?.data;
  const user = message.from;

  // 🎯 INLINE BUTTON HANDLING
  if (data === "START_READING") {
    return startReading(user);
  }

  if (data === "STOP_READING") {
    return stopReading(user);
  }

  // 🏠 DEFAULT START
  if (message.text === "/start") {
    return {
      text:
        "👋 *Welcome Dr Arzoo Fatema* ❤️🌺\n\n" +
        "🎯 *USE Me to Prepare GPSC Exam*\n\n" +
        "👇 Choose an option below",
      parse_mode: "Markdown",
    };
  }

  return {
    text: "⚠️ Unknown command",
  };
}
