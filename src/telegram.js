/**
 * src/telegram.js
 * ----------------------------------
 * Telegram API wrapper (SINGLE SOURCE)
 * ----------------------------------
 * RULES:
 * - All Telegram API calls MUST be here
 * - No business logic
 * - No DB / KV access
 */

export function createTelegramClient(config) {
  const { TOKEN, API_BASE } = config.TELEGRAM;
  const BASE_URL = `${API_BASE}/bot${TOKEN}`;

  async function call(method, payload) {
    const res = await fetch(`${BASE_URL}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram API Error:", data);
      throw new Error(data.description || "Telegram API failed");
    }
    return data.result;
  }

  return {
    // ----------------------------
    // Basic Messages
    // ----------------------------
    sendMessage(chat_id, text, options = {}) {
      return call("sendMessage", {
        chat_id,
        text,
        parse_mode: "HTML",
        ...options,
      });
    },

    editMessage(chat_id, message_id, text, options = {}) {
      return call("editMessageText", {
        chat_id,
        message_id,
        text,
        parse_mode: "HTML",
        ...options,
      });
    },

    deleteMessage(chat_id, message_id) {
      return call("deleteMessage", {
        chat_id,
        message_id,
      });
    },

    // ----------------------------
    // Inline Keyboard
    // ----------------------------
    sendKeyboard(chat_id, text, inline_keyboard) {
      return call("sendMessage", {
        chat_id,
        text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard,
        },
      });
    },

    editKeyboard(chat_id, message_id, text, inline_keyboard) {
      return call("editMessageText", {
        chat_id,
        message_id,
        text,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard,
        },
      });
    },

    // ----------------------------
    // Callback Queries
    // ----------------------------
    answerCallback(callback_query_id, text = "", showAlert = false) {
      return call("answerCallbackQuery", {
        callback_query_id,
        text,
        show_alert: showAlert,
      });
    },
  };
      }
