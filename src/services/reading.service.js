/*****************************************************************
 * Reading Service – FINAL STABLE
 * Handles reading start/stop, targets, time calculation
 * NO Telegram code here
 *****************************************************************/

const userRepo = require("../repositories/user.repo");

class ReadingService {
  /* ================= START READING ================= */
  async startReading(userId) {
    let user = await userRepo.getUser(userId);

    if (!user) {
      user = await userRepo.createUser(userId, { role: "STUDENT" });
    }

    if (user.activeSession) {
      return {
        ok: false,
        code: "ALREADY_READING",
        message:
          "📖 Reading already started.\n\n🎯 Daily Target: 08:00\nUse /stop to end."
      };
    }

    await userRepo.startReadingSession(userId);

    return {
      ok: true,
      code: "READ_STARTED",
      message:
        "📚 Reading started successfully!\n\n🎯 Daily Target: 08:00\nStay focused 💪"
    };
  }

  /* ================= STOP READING ================= */
  async stopReading(userId, todayDate) {
    const user = await userRepo.getUser(userId);

    if (!user || !user.activeSession) {
      return {
        ok: false,
        code: "NOT_READING",
        message:
          "⚠️ No active reading session found.\nUse /read to start reading."
      };
    }

    const startTime = user.activeSession.startedAt;
    const minutes = Math.max(
      1,
      Math.floor((Date.now() - startTime) / 60000)
    );

    await userRepo.stopReadingSession(userId, todayDate, minutes);

    const updatedUser = await userRepo.getUser(userId);
    const studied = updatedUser.readingLog[todayDate] || 0;
    const remaining = Math.max(480 - studied, 0);

    return {
      ok: true,
      code: "READ_STOPPED",
      minutes,
      studied,
      remaining,
      message:
        "⏱️ Reading stopped successfully\n\n" +
        `📘 Studied Today: ${this.formatMinutes(studied)}\n` +
        "🎯 Daily Target: 08:00\n" +
        `⏳ Remaining: ${this.formatMinutes(remaining)}`
    };
  }

  /* ================= FORMAT TIME ================= */
  formatMinutes(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
}

module.exports = new ReadingService();
