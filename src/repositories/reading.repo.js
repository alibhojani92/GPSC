const SESSION_KEY = "reading:session";
const TOTAL_KEY = "reading:total";

export async function startSession(env, userId) {
  const key = `${SESSION_KEY}:${userId}`;
  const existing = await env.KV.get(key, "json");

  if (existing) return null;

  const session = {
    start_time: Date.now(),
  };

  await env.KV.put(key, JSON.stringify(session));
  return session;
}

export async function stopSession(env, userId) {
  const key = `${SESSION_KEY}:${userId}`;
  const session = await env.KV.get(key, "json");

  if (!session) return null;

  const end = Date.now();
  const durationMin = Math.floor((end - session.start_time) / 60000);

  const todayKey = `${TOTAL_KEY}:${userId}:${new Date().toISOString().slice(0,10)}`;
  const prev = Number(await env.KV.get(todayKey)) || 0;

  await env.KV.put(todayKey, String(prev + durationMin));
  await env.KV.delete(key);

  return {
    start_time: session.start_time,
    end_time: end,
    duration: durationMin,
  };
}

export async function getTodayTotal(env, userId) {
  const todayKey = `${TOTAL_KEY}:${userId}:${new Date().toISOString().slice(0,10)}`;
  return Number(await env.KV.get(todayKey)) || 0;
}
