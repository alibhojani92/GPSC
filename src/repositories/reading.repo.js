function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function startSession(env, userId) {
  const db = env.DB;
  const today = todayDate();

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS reading_sessions (
      user_id TEXT,
      date TEXT,
      start_time INTEGER,
      end_time INTEGER,
      duration INTEGER
    )`
  ).run();

  const active = await db.prepare(
    `SELECT * FROM reading_sessions
     WHERE user_id=? AND date=? AND end_time IS NULL`
  ).bind(userId.toString(), today).first();

  if (active) return false;

  await db.prepare(
    `INSERT INTO reading_sessions (user_id, date, start_time)
     VALUES (?, ?, ?)`
  )
    .bind(userId.toString(), today, Date.now())
    .run();

  return true;
}

export async function stopSession(env, userId) {
  const db = env.DB;
  const today = todayDate();

  const session = await db.prepare(
    `SELECT rowid, start_time FROM reading_sessions
     WHERE user_id=? AND date=? AND end_time IS NULL`
  ).bind(userId.toString(), today).first();

  if (!session) return null;

  const end = Date.now();
  const duration = Math.floor((end - session.start_time) / 60000);

  await db.prepare(
    `UPDATE reading_sessions
     SET end_time=?, duration=?
     WHERE rowid=?`
  )
    .bind(end, duration, session.rowid)
    .run();

  return {
    start_time: session.start_time,
    end_time: end,
    duration,
  };
}

export async function getTodayTotal(env, userId) {
  const db = env.DB;
  const today = todayDate();

  const res = await db.prepare(
    `SELECT SUM(duration) as total
     FROM reading_sessions
     WHERE user_id=? AND date=?`
  ).bind(userId.toString(), today).first();

  return res?.total || 0;
    }
