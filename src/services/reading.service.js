// reading.service.js
// AE.5 FULL IMPLEMENTATION (5.1 → 5.5)
// Cloudflare Workers compatible

import { saveSession, endSession, getTodayStats } from "./reading.repo";

/**
 * Start Reading
 */
export async function startReading(chatId, env) {
  const now = new Date();

  await saveSession(chatId, now, env);

  const stats = await getTodayStats(chatId, env);

  const TARGET_MINUTES = 8 * 60; // 🎯 8 hours
  const remaining = Math.max(TARGET_MINUTES - stats.totalMinutes, 0);

  return {
    text: `📚 *Reading STARTED* ✅
🕒 *Start Time:* ${now.toLocaleTimeString()}
📊 *Today's Reading:* ${formatMinutes(stats.totalMinutes)}
🎯 *Daily Target:* 8 Hours
⏳ *Remaining:* ${formatMinutes(remaining)}
🔥 Keep going Doctor 💪🦷`,
  };
}

/**
 * Stop Reading
 */
export async function stopReading(chatId, env) {
  const now = new Date();

  const session = await endSession(chatId, now, env);

  if (!session) {
    return {
      text: `⚠️ *No active reading session found*
📖 Please start reading first 😊`,
    };
  }

  const stats = await getTodayStats(chatId, env);
  const TARGET_MINUTES = 8 * 60;
  const remaining = Math.max(TARGET_MINUTES - stats.totalMinutes, 0);

  return {
    text: `⏸ *Reading STOPPED* ✅
🕒 *End Time:* ${now.toLocaleTimeString()}
⏱ *Session Duration:* ${formatMinutes(session.duration)}
📊 *Today's Total:* ${formatMinutes(stats.totalMinutes)}
🎯 *Target Remaining:* ${formatMinutes(remaining)}
😌 Take rest & resume later 🌿`,
  };
}

/**
 * My Progress
 */
export async function myProgress(chatId, env) {
  const stats = await getTodayStats(chatId, env);
  const TARGET_MINUTES = 8 * 60;
  const remaining = Math.max(TARGET_MINUTES - stats.totalMinutes, 0);

  return {
    text: `📈 *Your Progress Today*
📚 Sessions: ${stats.sessions}
⏱ Total Reading: ${formatMinutes(stats.totalMinutes)}
🎯 Daily Target: 8 Hours
⏳ Remaining: ${formatMinutes(remaining)}
🚀 Consistency beats intensity Doctor 🦷🔥`,
  };
}

/**
 * Daily Test (Placeholder)
 */
export function dailyTest() {
  return {
    text: `📝 *Daily Test*
⏳ Coming soon...
Prepare well Doctor 💪📖`,
  };
}

/**
 * MCQ Practice (Placeholder)
 */
export function mcqPractice() {
  return {
    text: `✍️ *MCQ Practice*
📚 Loading questions...
Sharpen your concepts 🧠✨`,
  };
}

/**
 * Subject List (Placeholder)
 */
export function subjectList() {
  return {
    text: `📚 *Subject List*
🦷 Dental Anatomy
🦷 Dental Materials
🦷 Pathology
🦷 Pharmacology
📖 More coming soon...`,
  };
}

/**
 * Helpers
 */
function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
    }
