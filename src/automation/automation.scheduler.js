/**
 * FILE 27 – automation.scheduler.js
 * Purpose: Handle all time-based automatic events
 */

import { sendMessage } from "../utils/telegram.js";
import { getTodayKey } from "../utils/date.js";

/* ================= INTERNAL GUARD ================= */

function canRun(now, hour, minute) {
  return now.getHours() === hour && now.getMinutes() === minute;
}

/* ================= MAIN SCHEDULER ================= */

export async function runAutomation(env) {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const today = getTodayKey();

  /* 🌅 GOOD MORNING – 06:01 AM */
  if (canRun(now, 6, 1)) {
    await sendMessage(
      env.GROUP_ID,
      `🌺 *Dr. Arzoo Fatema* 🌺

🌅 *Good Morning Doctor*  
🎯 New day, new consistency

📚 Today's Goal: *8 Hours Reading*  
💪 Small steps daily = GPSC Rank`,
      { parse_mode: "Markdown" }
    );
  }

  /* 📖 READING REMINDERS */
  if (
    (canRun(now, 10, 0) ||
      canRun(now, 14, 0) ||
      canRun(now, 18, 0)) &&
    now.getHours() >= 6 &&
    now.getHours() <= 22
  ) {
    await sendMessage(
      env.GROUP_ID,
      `📚 *Reading Reminder*  

Even *30 minutes* today matters.  
Consistency beats motivation 💪`,
      { parse_mode: "Markdown" }
    );
  }

  /* 📝 DAILY TEST REMINDER */
  if (canRun(now, 18, 0)) {
    await sendMessage(
      env.GROUP_ID,
      `📝 *Daily Test Alert*  

⏰ Test at *11:00 PM*  
⏳ 5 hours left  

Revise weak subjects today 🔥`,
      { parse_mode: "Markdown" }
    );
  }

  /* 📝 FINAL TEST REMINDER */
  if (canRun(now, 21, 30)) {
    await sendMessage(
      env.GROUP_ID,
      `⏰ *Final Reminder*  

Daily Test at *11:00 PM*  
⌛ Only *1.5 hours left*`,
      { parse_mode: "Markdown" }
    );
  }

  /* 🌙 GOOD NIGHT – 11:59 PM */
  if (canRun(now, 23, 59)) {
    await sendMessage(
      env.GROUP_ID,
      `🌙 *Good Night Doctor*  

📊 Review today  
🧠 Learn from mistakes  
🌟 Tomorrow is another chance  

Sleep well 😴`,
      { parse_mode: "Markdown" }
    );
  }
}
