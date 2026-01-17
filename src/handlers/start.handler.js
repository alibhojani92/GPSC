/**
 * src/handlers/start.handler.js
 * ----------------------------------
 * Handles /start command
 * Sends bot intro + master keyboard
 */

import { sendMessage } from "../telegram.js";
import { getMasterKeyboard } from "../ui/master.keyboard.js";

export async function handleStartCommand(chatId) {
  const introMessage = `
🌺 Dr. Arzoo Fatema 🌺

Welcome Doctor ❤️🦷  
This bot will help you prepare for  
🎯 GPSC Dental Class-2 Exam

📌 Use the buttons below to:
• Track daily reading
• Practice MCQs
• Attempt tests
• Analyze performance

💪 Let’s build consistency, not stress
`;

  await sendMessage(chatId, introMessage, {
    reply_markup: getMasterKeyboard()
  });
}
