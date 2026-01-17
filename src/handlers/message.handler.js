import { sendMessage } from "../telegram.js";

export async function sendUnknownCommand(chatId, env) {
  await sendMessage(chatId, "⚠️ Feature coming soon", env);
}

export async function sendComingSoon(chatId, env) {
  await sendMessage(chatId, "🚧 Feature coming soon", env);
}
