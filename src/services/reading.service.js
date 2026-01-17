export class ReadingService {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
    this.kv = env.STATE_KV;
  }

  // =========================
  // START READING
  // =========================
  async startReading(userId) {
    const kvKey = `reading:${userId}`;

    // Prevent double start
    const existing = await this.kv.get(kvKey, "json");
    if (existing?.active) {
      return {
        text: "📚 Reading already STARTED ✅",
      };
    }

    const startTime = Date.now();

    // Save to KV (live state)
    await this.kv.put(
      kvKey,
      JSON.stringify({
        active: true,
        startTime,
      })
    );

    // Save to D1 (permanent)
    await this.db
      .prepare(
        `INSERT INTO reading_sessions (user_id, start_time)
         VALUES (?, datetime('now'))`
      )
      .bind(userId)
      .run();

    return {
      text: "📖 Reading STARTED ✅\n⏱️ Time tracking ON",
    };
  }

  // =========================
  // STOP READING
  // =========================
  async stopReading(userId) {
    const kvKey = `reading:${userId}`;

    const state = await this.kv.get(kvKey, "json");
    if (!state?.active) {
      return {
        text: "⏸️ Reading is not active",
      };
    }

    const endTime = Date.now();
    const durationSeconds = Math.floor(
      (endTime - state.startTime) / 1000
    );

    // Update last open session
    await this.db
      .prepare(
        `UPDATE reading_sessions
         SET end_time = datetime('now'),
             duration = ?
         WHERE user_id = ?
         AND end_time IS NULL`
      )
      .bind(durationSeconds, userId)
      .run();

    // Clear KV
    await this.kv.delete(kvKey);

    return {
      text:
        "⏹️ Reading STOPPED ✅\n" +
        `🕒 Duration: ${Math.floor(durationSeconds / 60)} min`,
    };
  }

  // =========================
  // CHECK STATUS
  // =========================
  async getStatus(userId) {
    const kvKey = `reading:${userId}`;
    const state = await this.kv.get(kvKey, "json");

    if (!state?.active) {
      return {
        active: false,
      };
    }

    const elapsed = Math.floor(
      (Date.now() - state.startTime) / 1000
    );

    return {
      active: true,
      elapsed,
    };
  }
}
