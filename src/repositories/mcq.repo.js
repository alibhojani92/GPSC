/**
 * MCQ Repository
 * Central access layer for MCQs
 */

import { Store } from "../storage/store.js";
import { validateMCQ } from "../validators/mcq.validator.js";

const MCQ_KEY_PREFIX = "mcq:";

export const MCQRepository = {
  async add(mcq) {
    validateMCQ(mcq);
    const key = `${MCQ_KEY_PREFIX}${mcq.id}`;
    await Store.set(key, mcq);
    return mcq;
  },

  async getById(id) {
    return Store.get(`${MCQ_KEY_PREFIX}${id}`);
  },

  async getAll() {
    const keys = await Store.list(MCQ_KEY_PREFIX);
    const items = [];
    for (const k of keys) {
      const item = await Store.get(k);
      if (item) items.push(item);
    }
    return items;
  },

  async getBySubject(subjectCode) {
    const all = await this.getAll();
    return all.filter((q) => q.subjectCode === subjectCode);
  },

  async count() {
    const all = await this.getAll();
    return all.length;
  },

  async getRandom(limit = 20, excludeIds = []) {
    const all = await this.getAll();
    const filtered = all.filter((q) => !excludeIds.includes(q.id));
    return filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  },
};
