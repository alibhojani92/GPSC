import { sendMessage, answerCallback } from "../utils/telegram";
import { mainKeyboard } from "../ui/keyboard";

export async function handleCallback(query, env) {
  const chatId = query.message.chat.id;
  const data = query.data;

  await answerCallback(query.id, env);

  switch (data) {
    case "START_READING":
      return sendMessage(
        chatId,
        env,
        "📚 Reading STARTED ✅\n⏱ Time tracking ON",
        mainKeyboard()
      );

    case "STOP_READING":
      return sendMessage(
        chatId,
        env,
        "⏸ Reading STOPPED ✅\nTake rest & resume later 🌿",
        mainKeyboard()
      );

    case "DAILY_TEST":
      return sendMessage(
        chatId,
        env,
        "📝 Daily Test coming soon ⏳",
        mainKeyboard()
      );

    case "MCQ_PRACTICE":
      return sendMessage(
        chatId,
        env,
        "✏️ MCQ Practice loading 📚",
        mainKeyboard()
      );

    case "MY_PROGRESS":
      return sendMessage(
        chatId,
        env,
        "📊 Your progress will appear here 📈",
        mainKeyboard()
      );

    case "SUBJECT_LIST":
      return sendMessage(
        chatId,
        env,
        "📚 Subject list loading...",
        mainKeyboard()
      );

    case "DAILY_TARGET":
      return sendMessage(
        chatId,
        env,
        "🎯 Daily Target: 8 Hours\n🔥 Stay consistent Doctor!",
        mainKeyboard()
      );

    case "READING_STATS":
      return sendMessage(
        chatId,
        env,
        "⏱ Reading stats will be shown here",
        mainKeyboard()
      );

    case "READING_REMINDER":
      return sendMessage(
        chatId,
        env,
        "🔔 Reading reminders enabled",
        mainKeyboard()
      );

    case "MOTIVATION":
      return sendMessage(
        chatId,
        env,
        "🔥 Consistency beats intensity 💪🦷",
        mainKeyboard()
      );

    case "SETTINGS":
      return sendMessage(
        chatId,
        env,
        "⚙️ Settings panel coming soon",
        mainKeyboard()
      );

    case "HELP":
      return sendMessage(
        chatId,
        env,
        "❓ Use buttons to navigate features",
        mainKeyboard()
      );

    default:
      return sendMessage(
        chatId,
        env,
        "❌ Unknown action",
        mainKeyboard()
      );
  }
  }
