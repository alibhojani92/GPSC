import { sendMessage } from "../utils/telegram";
import { mainKeyboard } from "../ui/keyboard";

export async function startCommand(chatId, env) {
  const text =
    "👋 Welcome Dr. Arzoo Fatema ❤️🌺\n\n" +
    "USE Me to Prepare GPSC Dental Exam 🦷📚\n\n" +
    "👇 Choose an action";

  await sendMessage(chatId, env, text, mainKeyboard());
}
