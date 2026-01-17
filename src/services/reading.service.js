export async function startReading(chatId) {
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: "📖 Reading STARTED ✅\n⏱ Time tracking ON",
  };
}

export async function stopReading(chatId) {
  return {
    method: "sendMessage",
    chat_id: chatId,
    text: "⏸ Reading STOPPED ✅\nTake rest & resume later",
  };
}
