/**
 * src/env.js
 * ----------------------------------
 * Central environment & config loader
 * ----------------------------------
 * RULES:
 * - No business logic here
 * - Only read & normalize ENV values
 * - Used by ALL other files
 */

export function loadEnv(env) {
  if (!env) {
    throw new Error("ENV not provided to loadEnv()");
  }

  return {
    // ----------------------------
    // Telegram Bot Configuration
    // ----------------------------
    TELEGRAM: {
      TOKEN: env.BOT_TOKEN,
      API_BASE: "https://api.telegram.org",
    },

    // ----------------------------
    // Storage Bindings
    // ----------------------------
    STORAGE: {
      KV: env.KV,       // Cloudflare KV binding
      D1: env.DB,       // Cloudflare D1 binding
    },

    // ----------------------------
    // App Identity
    // ----------------------------
    APP: {
      NAME: "Dental Pulse V2",
      VERSION: "2.0.0",
      ENV: env.ENVIRONMENT || "production",
    },

    // ----------------------------
    // Reading Defaults
    // ----------------------------
    READING: {
      DAILY_TARGET_MINUTES: 8 * 60, // 8 hours
    },

    // ----------------------------
    // MCQ Defaults
    // ----------------------------
    MCQ: {
      PRACTICE_MODE_TIME_LIMIT: null, // unlimited (LOCKED RULE)
      TEST_MODE_TIME_LIMIT: 60, // seconds per question (future)
    },

    // ----------------------------
    // Feature Flags (future-safe)
    // ----------------------------
    FLAGS: {
      ENABLE_REPORTS: true,
      ENABLE_TESTS: true,
      ENABLE_MCQS: true,
      ENABLE_READING: true,
    },
  };
}
