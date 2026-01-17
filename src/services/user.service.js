import { saveUserIfNotExists } from "../repos/user.repo";
import { sendMessage } from "../utils/telegram";

export async function handleStart(update, env) {
  const chatId = update.message.chat.id;
  const name = update.message.from.first_name || "Doctor";

  await saveUserIfNotExists(env, {
    id: update.message.from.id,
    name,
  });

  const text =
`👋 Welcome Dr ${name} ❤️🌺

USE Me to Prepare GPSC Exam 🦷📚`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: "📖 Start Reading", callback_data: "START_READING" },
        { text: "⏸ Stop Reading", callback_data: "STOP_READING" },
      ],
      [
        { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
        { text: "✏️ MCQ Practice", callback_data: "MCQ_PRACTICE" },
      ],
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" },
      ],
    ],
  };

  await sendMessage(env, chatId, text, keyboard);

  return new Response("OK ✅");
}
