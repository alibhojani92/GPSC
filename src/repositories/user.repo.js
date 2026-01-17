export async function saveUserIfNotExists(env, user) {
  const db = env.DB;

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ).run();

  await db.prepare(
    `INSERT OR IGNORE INTO users (user_id, name)
     VALUES (?, ?)`
  )
    .bind(user.id.toString(), user.name)
    .run();
}
