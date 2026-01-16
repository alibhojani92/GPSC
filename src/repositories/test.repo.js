/**
 * Test Repository
 * Central access layer for test sessions
 */

import { Store } from "../storage/store.js";

const TEST_KEY_PREFIX = "test:";

function keyFor(testId) {
  return `${TEST_KEY_PREFIX}${testId}`;
}

export const TestRepository = {
  async create(testSession) {
    const key = keyFor(testSession.id);
    await Store.set(key, testSession);
    return testSession;
  },

  async getById(testId) {
    return Store.get(keyFor(testId));
  },

  async update(testSession) {
    const key = keyFor(testSession.id);
    await Store.set(key, testSession);
    return testSession;
  },

  async getAll() {
    const keys = await Store.list(TEST_KEY_PREFIX);
    const tests = [];
    for (const k of keys) {
      const t = await Store.get(k);
      if (t) tests.push(t);
    }
    return tests;
  },

  async getByUser(userId) {
    const all = await this.getAll();
    return all.filter((t) => t.userId === userId);
  },
};
