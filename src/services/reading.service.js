// src/services/reading.service.js

export async function startReading(userId, env) {
  const now = new Date().toISOString();

  // Save temporary state in KV
  await env.KV.put(
    `reading:${userId}`,
    JSON.stringify({ start_time: now })
  );

  return {
    text: "📖 Reading STARTED ✅\n⏱️ Time tracking ON",
  };
}

export async function stopReading(userId, env) {
  const key = `reading:${userId}`;
  const state = await env.KV.get(key, { type: "json" });

  if (!state || !state.start_time) {
    return {
      text: "⚠️ Reading not active.\nStart reading first 📖",
    };
  }

  const startTime = new Date(state.start_time);
  const endTime = new Date();
  const durationSeconds = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000
  );

  // Save permanent record in D1
  await env.DB.prepare(
    `
    INSERT INTO reading_sessions (user_id, start_time, end_time, duration)
    VALUES (?, ?, ?, ?)
    `
  )
    .bind(
      userId,
      startTime.toISOString(),
      endTime.toISOString(),
      durationSeconds
    )
    .run();

  // Clear KV state
  await env.KV.delete(key);

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  return {
    text:
      "⏸️ Reading STOPPED ✅\n" +
      `🕒 Duration: ${minutes}m ${seconds}s\n` +
      "💾 Progress saved",
  };
    }
