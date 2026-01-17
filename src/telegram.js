export class Telegram {
  constructor(token) {
    this.token = token;
  }

  async sendMessage(chatId, payload) {
    return fetch(
      `https://api.telegram.org/bot${this.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          ...payload,
        }),
      }
    );
  }
}
