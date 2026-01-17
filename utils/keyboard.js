// utils/keyboard.js
// 🔒 MASTER INLINE KEYBOARD – ALL FEATURES LOCKED

export function getMasterKeyboard() {
  return {
    inline_keyboard: [

      // 📚 READING
      [
        { text: "📖 Start Reading", callback_data: "READ_START" },
        { text: "⏸ Stop Reading", callback_data: "READ_STOP" }
      ],
      [
        { text: "▶️ Resume Reading", callback_data: "READ_RESUME" },
        { text: "🎯 Set Daily Target", callback_data: "SET_TARGET" }
      ],

      // ⏰ REMINDER & PLANNER
      [
        { text: "⏰ Reading Reminder", callback_data: "READ_REMINDER" },
        { text: "🗓 Study Planner", callback_data: "STUDY_PLANNER" }
      ],

      // 📝 TESTS & MCQ
      [
        { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
        { text: "✍️ MCQ Practice", callback_data: "MCQ_PRACTICE" }
      ],
      [
        { text: "📊 Test History", callback_data: "TEST_HISTORY" },
        { text: "📈 Accuracy Report", callback_data: "ACCURACY_REPORT" }
      ],

      // 📊 PROGRESS
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "🔥 My Streak", callback_data: "MY_STREAK" }
      ],
      [
        { text: "🏆 Weekly Summary", callback_data: "WEEKLY_SUMMARY" },
        { text: "📅 Monthly Report", callback_data: "MONTHLY_REPORT" }
      ],

      // 📚 CONTENT
      [
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" },
        { text: "📖 Notes & PDFs", callback_data: "NOTES_PDF" }
      ],

      // 👨‍⚕️ PROFILE & SETTINGS
      [
        { text: "👩‍⚕️ My Profile", callback_data: "MY_PROFILE" },
        { text: "⚙️ Settings", callback_data: "SETTINGS" }
      ],

      // ℹ️ SUPPORT
      [
        { text: "❓ Help", callback_data: "HELP" },
        { text: "ℹ️ About Bot", callback_data: "ABOUT_BOT" }
      ]
    ]
  };
}
