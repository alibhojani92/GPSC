// src/env.js
/**
 * MASTER BOT – Dental GPSC (Pulse Edition 18)
 * Environment & Binding Configuration
 * ONE-SHOT FINAL VERSION
 */

/**
 * @typedef {Object} Env
 * @property {string} BOT_TOKEN
 * @property {string} WEBHOOK_SECRET
 * @property {KVNamespace} KV
 * @property {D1Database} D1
 */

/* ================= CORE CONFIG ================= */

export const APP_NAME = "Dental GPSC Master Bot";
export const TIMEZONE = "Asia/Kolkata";

/* ================= TELEGRAM ================= */

export const TELEGRAM_API = "https://api.telegram.org";
export const TELEGRAM_TIMEOUT_MS = 5000;

/* ================= ROLES ================= */

// 🔐 Replace with your real values in Cloudflare bindings
export const ADMIN_IDS = [
  7539477188, // Primary Admin
];

export const GROUP_IDS = [
  -5154292869, // Main Study Group
];

/* ================= EXAM CONFIG ================= */

export const EXAM = {
  name: "GPSC Dental Class-2",
  source: "Dental Pulse Edition 18",
  examDate: "2026-02-18", // YYYY-MM-DD
};

/* ================= READING CONFIG ================= */

export const READING = {
  DAILY_TARGET_MINUTES: 8 * 60, // 8 hours
};

/* ================= TEST CONFIG ================= */

export const TEST = {
  DAILY_COUNT: 20,
  WEEKLY_COUNT: 50,
  PER_QUESTION_TIME_SEC: 5 * 60, // 5 minutes
  NO_REPEAT_DAYS_DAILY: 1,
  NO_REPEAT_DAYS_WEEKLY: 30,
};

/* ================= AUTOMATION TIMES (IST) ================= */

export const AUTOMATION = {
  GOOD_MORNING: "06:01",
  TEST_REMINDER_1: "18:00",
  TEST_REMINDER_2: "21:30",
  GOOD_NIGHT: "23:59",
  WEAK_SUBJECT_REMINDER_1: "14:00",
  WEAK_SUBJECT_REMINDER_2: "19:00",
};

/* ================= STORAGE KEYS ================= */

export const KV_KEYS = {
  USER_STATE: (id) => `user:state:${id}`,
  READING_SESSION: (id) => `reading:session:${id}`,
  DAILY_READING: (id, date) => `reading:daily:${id}:${date}`,
  ACTIVE_TEST: (chatId) => `test:active:${chatId}`,
  REMINDER_QUEUE: "automation:queue",
};

/* ================= SAFE EXPORT ================= */

export function getEnv(env) {
  if (!env || !env.BOT_TOKEN || !env.KV || !env.D1) {
    throw new Error("❌ Missing required environment bindings");
  }
  return env;
    }
