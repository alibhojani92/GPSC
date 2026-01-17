// handlers/message.handler.js

/**
 * Handles normal text messages (non-command).
 * Currently we DO NOT reply to random text.
 * This keeps bot clean and controlled via:
 *  - Commands (/start, /help, etc.)
 *  - Inline keyboard callbacks
 */

export async function handleMessage(update, env) {
  const message = update.message;

  if (!message || !message.text) {
    return null;
  }

  const text = message.text.trim();

  // Ignore commands (they are handled elsewhere)
  if (text.startsWith("/")) {
    return null;
  }

  // 🔒 SILENT MODE (by design)
  // No reply for free text to avoid confusion/spam
  return null;
}
