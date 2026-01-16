// MCQ Repository
// Handles storage & retrieval of MCQs (subject-wise, random fetch)

import { BaseRepository } from "./base.repo.js";

export class McqRepository extends BaseRepository {
  constructor(env) {
    super(env);
    // NOTE: storage backend wired later (KV/D1)
  }

  /**
   * Insert a new MCQ
   */
  async insert(mcq) {
    const key = this.key("mcq", mcq.id);
    await this._put(key, mcq);
    await this._indexBySubject(mcq.subject, mcq.id);
    return mcq.id;
  }

  /**
   * Get MCQ by ID
   */
  async getById(id) {
    const key = this.key("mcq", id);
    return this._get(key);
  }

  /**
   * Get random MCQs (any subject)
   */
  async getRandom(limit = 10) {
    const ids = await this._getAllIds();
    return this._pickRandomByIds(ids, limit);
  }

  /**
   * Get random MCQs by subject
   */
  async getRandomBySubject(subject, limit = 10) {
    const ids = await this._getSubjectIndex(subject);
    return this._pickRandomByIds(ids, limit);
  }

  /**
   * Count MCQs by subject
   */
  async countBySubject(subject) {
    const ids = await this._getSubjectIndex(subject);
    return ids.length;
  }

  /* ================= Internal Helpers ================= */

  async _pickRandomByIds(ids = [], limit) {
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    const results = [];
    for (const id of selected) {
      const mcq = await this.getById(id);
      if (mcq) results.push(mcq);
    }
    return results;
  }

  async _indexBySubject(subject, id) {
    const indexKey = this.key("mcq:subject", subject);
    const existing = (await this._get(indexKey)) || [];
    existing.push(id);
    await this._put(indexKey, existing);
  }

  async _getSubjectIndex(subject) {
    const indexKey = this.key("mcq:subject", subject);
    return (await this._get(indexKey)) || [];
  }

  async _getAllIds() {
    const key = this.key("mcq:all");
    return (await this._get(key)) || [];
  }

  /* ================= Storage Abstraction ================= */

  async _put(key, value) {
    // placeholder — wired to KV/D1 in infra layer
    if (!this.env.__memory) this.env.__memory = {};
    this.env.__memory[key] = this.safeStringify(value);

    // maintain global ID index
    if (key.startsWith("mcq:") && !key.startsWith("mcq:subject")) {
      const allKey = this.key("mcq:all");
      const ids = this.safeParse(this.env.__memory[allKey], []);
      const id = key.split(":")[1];
      if (!ids.includes(id)) {
        ids.push(id);
        this.env.__memory[allKey] = this.safeStringify(ids);
      }
    }
  }

  async _get(key) {
    if (!this.env.__memory) return null;
    return this.safeParse(this.env.__memory[key], null);
  }
                           }
