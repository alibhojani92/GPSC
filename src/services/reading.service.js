// services/reading.service.js

const readingSessions = new Map(); // in-memory (userId -> session)

export function startReading(user) {
  const userId = user.id;

  // 🔒 Already reading
  if (readingSessions.has(userId)) {
    return {
      text: "⚠️ You already started reading 📖\n\n🛑 Use *STOP READING* to finish.",
      parse_mode: "Markdown",
    };
  }

  const startTime = new Date();

  readingSessions.set(userId, {
    startTime,
  });

  return {
    text:
      "📖 *Reading Started Successfully!* ✅\n\n" +
      `⏱ Start Time: *${startTime.toLocaleTimeString()}*\n\n` +
      "🧠 Stay focused!\n🛑 Press *STOP READING* when you finish.",
    parse_mode: "Markdown",
  };
}

export function stopReading(user) {
  const userId = user.id;

  if (!readingSessions.has(userId)) {
    return {
      text: "⚠️ No active reading session found.\n\n📖 Press *START READING* first.",
      parse_mode: "Markdown",
    };
  }

  const session = readingSessions.get(userId);
  const endTime = new Date();
  const durationMs = endTime - session.startTime;
  const minutes = Math.floor(durationMs / 60000);

  readingSessions.delete(userId);

  return {
    text:
      "✅ *Reading Stopped!* 📕\n\n" +
      `⏱ Total Time: *${minutes} minutes*\n\n` +
      "👏 Great job! Consistency is key 💪",
    parse_mode: "Markdown",
  };
}
