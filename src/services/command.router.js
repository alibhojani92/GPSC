export async function handleCommand(update, env) {
  if (!update.message) {
    return { ok: true };
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  if (text === "/start") {
    await sendMessage(env, chatId, "👋 Welcome to Dental Pulse V2\n\nBot is LIVE ✅");
  } else {
    await sendMessage(env, chatId, "❓ Unknown command");
  }

  return { ok: true };
}

async function sendMessage(env, chatId, text) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
    }
