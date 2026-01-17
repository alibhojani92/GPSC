export async function sendMessage(env, chatId, text, replyMarkup = null) {
  const url = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;

  const body = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };

  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
