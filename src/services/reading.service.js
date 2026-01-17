export async function startReading(chatId, env) {
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: "📖 Reading STARTED\n\n⏱ Daily study tracking is now ON ✅",
  };
}

export async function stopReading(chatId, env) {
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: "⏸ Reading STOPPED\n\n🧠 You can resume anytime ✅",
  };
}
