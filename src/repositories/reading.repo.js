/**
 * Reading Repository
 * Handles reading session storage & aggregation
 */

import { Store } from "../storage/store.js";

const READING_KEY_PREFIX = "reading:";

function keyFor(userId, date) {
  return `${READING_KEY_PREFIX}${userId}:${date}`;
}

export const ReadingRepository = {
  async startSession(session) {
    const key = keyFor(session.userId, session.date);
    await Store.set(key, session);
    return session;
  },

  async getSession(userId, date) {
    return Store.get(keyFor(userId, date));
  },

  async stopSession(userId, date, endTime, durationMinutes) {
    const key = keyFor(userId, date);
    const session = await Store.get(key);
    if (!session) return null;

    session.endTime = endTime;
    session.durationMinutes = durationMinutes;

    await Store.set(key, session);
    return session;
  },

  async getDailyMinutes(userId, date) {
    const session = await this.getSession(userId, date);
    return session ? session.durationMinutes : 0;
  },

  async getAllSessionsForUser(userId) {
    const keys = await Store.list(`${READING_KEY_PREFIX}${userId}:`);
    const sessions = [];
    for (const k of keys) {
      const s = await Store.get(k);
      if (s) sessions.push(s);
    }
    return sessions;
  },
};
