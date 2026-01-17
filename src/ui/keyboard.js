export function mainKeyboard() {
  return {
    inline_keyboard: [

      // 📚 Reading controls
      [
        { text: "📚 Start Reading", callback_data: "START_READING" },
        { text: "⏸ Stop Reading", callback_data: "STOP_READING" }
      ],

      // 📝 Practice & tests
      [
        { text: "📝 Daily Test", callback_data: "DAILY_TEST" },
        { text: "✏️ MCQ Practice", callback_data: "MCQ_PRACTICE" }
      ],

      // 📊 Progress & subjects
      [
        { text: "📊 My Progress", callback_data: "MY_PROGRESS" },
        { text: "📚 Subject List", callback_data: "SUBJECT_LIST" }
      ],

      // 🎯 Targets & stats (A.E.5+)
      [
        { text: "🎯 Daily Target", callback_data: "DAILY_TARGET" },
        { text: "⏱ Reading Stats", callback_data: "READING_STATS" }
      ],

      // 🔔 Reminders & motivation
      [
        { text: "🔔 Reading Reminder", callback_data: "READING_REMINDER" },
        { text: "🔥 Motivation", callback_data: "MOTIVATION" }
      ],

      // ⚙️ Settings & help
      [
        { text: "⚙️ Settings", callback_data: "SETTINGS" },
        { text: "❓ Help", callback_data: "HELP" }
      ]
    ]
  };
        }
