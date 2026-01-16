/*****************************************************************
 * User Repository
 * Handles ONLY user data persistence
 * Reading, targets, weak subjects, saved MCQs
 *****************************************************************/

const BaseRepo = require("./base.repo");

class UserRepo extends BaseRepo {
  constructor() {
    super();
  }

  /* ================= CREATE USER ================= */
  async createUser(userId, data = {}) {
    const key = `user:${userId}`;

    const payload = {
      userId,
      role: data.role || "STUDENT",
      targetMinutes: data.targetMinutes || 480, // 8 hours
      readingLog: {},            // date : minutes
      activeSession: null,       // { startedAt }
      weakSubjects: [],          // ["Oral Pathology"]
      savedMCQs: [],             // ["mcq_1", "mcq_99"]
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return this.set(key, payload);
  }

  /* ================= GET USER ================= */
  async getUser(userId) {
    return this.get(`user:${userId}`);
  }

  /* ================= UPDATE USER ================= */
  async updateUser(userId, data) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    const updated = {
      ...user,
      ...data,
      updatedAt: Date.now()
    };

    return this.set(key, updated);
  }

  /* ================= START READING ================= */
  async startReadingSession(userId) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    user.activeSession = {
      startedAt: Date.now()
    };

    return this.set(key, user);
  }

  /* ================= STOP READING ================= */
  async stopReadingSession(userId, date, minutes) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    user.readingLog[date] = (user.readingLog[date] || 0) + minutes;
    user.activeSession = null;

    return this.set(key, user);
  }

  /* ================= ADD READING TIME ================= */
  async addReadingTime(userId, date, minutes) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    user.readingLog[date] = (user.readingLog[date] || 0) + minutes;
    user.updatedAt = Date.now();

    return this.set(key, user);
  }

  /* ================= SAVE MCQ ================= */
  async saveMCQ(userId, mcqId) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    if (!user.savedMCQs.includes(mcqId)) {
      user.savedMCQs.push(mcqId);
    }

    return this.set(key, user);
  }

  /* ================= GET SAVED MCQS ================= */
  async getSavedMCQs(userId) {
    const user = await this.get(`user:${userId}`);
    return user ? user.savedMCQs : [];
  }

  /* ================= SET WEAK SUBJECTS ================= */
  async setWeakSubjects(userId, subjects = []) {
    const key = `user:${userId}`;
    const user = await this.get(key);

    if (!user) return null;

    user.weakSubjects = subjects;
    return this.set(key, user);
  }

  /* ================= GET WEAK SUBJECTS ================= */
  async getWeakSubjects(userId) {
    const user = await this.get(`user:${userId}`);
    return user ? user.weakSubjects : [];
  }
}

module.exports = new UserRepo();
