/*****************************************************************
 * Test Repository
 * Handles ONLY test data storage & retrieval
 * No business logic, no Telegram code
 *****************************************************************/

const BaseRepo = require("./base.repo");

class TestRepo extends BaseRepo {
  constructor() {
    super();
  }

  /* ================= CREATE TEST SESSION ================= */
  async createTestSession(userId, sessionId, data) {
    const key = `test:${userId}:${sessionId}`;

    const payload = {
      userId,
      sessionId,
      type: data.type,               // Daily / Weekly
      totalQuestions: data.total,
      subject: data.subject || null, // optional
      questions: data.questions || [],
      answers: {},                   // questionId : userAnswer
      correct: 0,
      wrong: 0,
      status: "RUNNING",
      startedAt: Date.now(),
      completedAt: null,
      result: null
    };

    return this.set(key, payload);
  }

  /* ================= SAVE ANSWER ================= */
  async saveAnswer(userId, sessionId, questionId, answer) {
    const key = `test:${userId}:${sessionId}`;
    const test = await this.get(key);

    if (!test || test.status !== "RUNNING") return null;

    test.answers[questionId] = answer;

    return this.set(key, test);
  }

  /* ================= UPDATE SCORE ================= */
  async updateScore(userId, sessionId, isCorrect) {
    const key = `test:${userId}:${sessionId}`;
    const test = await this.get(key);

    if (!test) return null;

    if (isCorrect) test.correct += 1;
    else test.wrong += 1;

    return this.set(key, test);
  }

  /* ================= FINALIZE TEST ================= */
  async finalizeTest(userId, sessionId, result) {
    const key = `test:${userId}:${sessionId}`;
    const test = await this.get(key);

    if (!test) return null;

    test.status = "COMPLETED";
    test.completedAt = Date.now();
    test.result = result; // { score, accuracy, subjectWise }

    return this.set(key, test);
  }

  /* ================= GET ONE TEST ================= */
  async getTestSession(userId, sessionId) {
    return this.get(`test:${userId}:${sessionId}`);
  }

  /* ================= GET ALL TESTS OF USER ================= */
  async getAllUserTests(userId) {
    return this.getByPrefix(`test:${userId}:`);
  }

  /* ================= SUBJECT-WISE RAW DATA ================= */
  async getSubjectWiseData(userId) {
    return this.getByPrefix(`test:${userId}:`);
  }

  /* ================= CANCEL TEST ================= */
  async cancelTest(userId, sessionId) {
    const key = `test:${userId}:${sessionId}`;
    const test = await this.get(key);

    if (!test) return null;

    test.status = "CANCELLED";
    test.completedAt = Date.now();

    return this.set(key, test);
  }
}

module.exports = new TestRepo();
