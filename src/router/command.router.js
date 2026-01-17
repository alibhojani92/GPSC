// src/router/command.router.js

import { sendMessage, answerCallback } from "../utils/telegram.js";
import { isAdmin } from "../services/admin.service.js";

import { handleReadingStart, handleReadingStop } from "../services/reading.service.js";
import { startDailyTest, startWeeklyTest, cancelTest } from "../services/test.service.js";
import { showProgress } from "../services/report.service.js";
import { showSubjectList } from "../services/mcq.service.js";
import { showHelp } from "../services/user.service.js";

/**
 * Main update handler
 */
export async function handleUpdate(update, env) {
  try {
    // MESSAGE HANDLER
    if (update.message) {
      await handleMessage(update.message, env);
      return;
    }

    // CALLBACK HANDLER (INLINE KEYBOARD)
    if (update.callback_query) {
      await handleCallback(update.callback_query, env);
      return;
    }
  } catch (err) {
    console.error("Router error:", err);
  }
}

/**
 * Handle normal messages (/commands)
 */
async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = (message.text || "").trim();

  // Normalize command (capital / small supported)
  const cmd = text.toLowerCase();

  switch (cmd) {
    case "/start":
      await sendMessage(
        chatId,
        "🌺 Dr. Arzoo Fatema 🌺\n\nWelcome ❤️\nUse the buttons below to prepare for GPSC Dental Exam 🦷",
        env,
        { keyboard: "main" }
      );
      break;

    case "/read":
      await handleReadingStart(chatId, userId, env);
      break;

    case "/stop":
      await handleReadingStop(chatId, userId, env);
      break;

    case "/dt":
      await startDailyTest(chatId, userId, env);
      break;

    case "/wt":
      await startWeeklyTest(chatId, userId, env);
      break;

    case "/dtc":
    case "/wtc":
      if (isAdmin(userId)) {
        await cancelTest(chatId, env);
      } else {
        await sendMessage(chatId, "⛔ Admin only command", env);
      }
      break;

    case "/progress":
      await showProgress(chatId, userId, env);
      break;

    case "/subjects":
      await showSubjectList(chatId, env);
      break;

    case "/help":
      await showHelp(chatId, env);
      break;

    default:
      // Ignore unknown text to avoid spam
      break;
  }
}

/**
 * Handle inline keyboard callbacks
 */
async function handleCallback(callback, env) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const data = callback.data;

  // Always acknowledge callback
  await answerCallback(callback.id, env);

  switch (data) {
    case "READ_START":
      await handleReadingStart(chatId, userId, env);
      break;

    case "READ_STOP":
      await handleReadingStop(chatId, userId, env);
      break;

    case "TEST_DAILY":
      await startDailyTest(chatId, userId, env);
      break;

    case "TEST_WEEKLY":
      await startWeeklyTest(chatId, userId, env);
      break;

    case "SHOW_PROGRESS":
      await showProgress(chatId, userId, env);
      break;

    case "SHOW_SUBJECTS":
      await showSubjectList(chatId, env);
      break;

    case "HELP":
      await showHelp(chatId, env);
      break;

    default:
      // Unknown callback ignored
      break;
  }
}
