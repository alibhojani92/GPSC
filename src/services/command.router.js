const TELEGRAM_API = "https://api.telegram.org";

async function sendMessage(token, chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📖 Start Reading", callback_data: "START_READING" },
        { text: "⏹ Stop Reading", callback_data: "STOP_READING" },
      ],
      [
        { text: "🧪 Daily Test", callback_data: "DAILY_TEST" },
        { text: "📝 MCQ Practice", callback_data: "MCQ_PRACTICE" },
      ],
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" },
      ],
    ],
  };
}

export async function handleCommand(update, env) {
  const token = env.BOT_TOKEN;

  // TEXT MESSAGE (/start)
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      const welcomeText =
`👋 *Welcome Dr Arzoo Fatema* ❤️🌺

*USE Me to Prepare GPSC Exam*`;

      await sendMessage(
        token,
        chatId,
        welcomeText,
        mainMenuKeyboard()
      );

      return { ok: true };
    }
  }

  // BUTTON CLICK
  if (update.callback_query) {
    const chatId = update.callback_query.message.chat.id;
    const action = update.callback_query.data;

    await sendMessage(
      token,
      chatId,
      `✅ *Selected:* ${action.replaceAll("_", " ")}`
    );

    return { ok: true };
  }

  return { ok: true };
    }
