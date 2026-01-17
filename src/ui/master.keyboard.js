/**
 * src/ui/master.keyboard.js
 * ----------------------------------
 * MASTER INLINE KEYBOARD
 * ----------------------------------
 * RULES:
 * - UI ONLY
 * - No logic
 * - No handlers
 * - No API calls
 */

export function getMasterKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📖 Start Reading", callback_data: "READ_START" },
        { text: "⏸ Stop Reading", callback_data: "READ_STOP" }
      ],
      [
        { text: "🧪 Daily Test", callback_data: "DAILY_TEST" },
        { text: "✏️ MCQ Practice", callback_data: "MCQ_PRACTICE" }
      ],
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" }
      ],
      [
        { text: "⚙️ Settings", callback_data: "SETTINGS" }
      ]
    ]
  };
}
