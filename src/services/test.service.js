/*****************************************************************
 * Test Service – FINAL STABLE
 * Handles Daily / Weekly / Subject tests
 * NO Telegram code here
 *****************************************************************/

const mcqRepo = require("../repositories/mcq.repo");
const testRepo = require("../repositories/test.repo");
const userRepo = require("../repositories/user.repo");

class TestService {
  /* ================= START TEST ================= */
  async startTest(userId, type = "DAILY", subject = null, total = 20) {
    const sessionId = `${type}_${Date.now()}`;

    const mcqs = subject
      ? await mcqRepo.getBySubject(subject)
      : await mcqRepo.getAll();

    if (!mcqs || mcqs.length < total) {
      return {
        ok: false,
        code: "INSUFFICIENT_MCQ",
        message:
          "❌ Not enough MCQs available for this test."
      };
    }

    const selected = this.shuffle(mcqs).slice(0, total);

    await testRepo.createTestSession(userId, sessionId, {
      type,
      total,
      subject,
      questions: selected.map(q => q.id)
    });

    return {
      ok: true,
      code: "TEST_STARTED",
      sessionId,
      questions: selected
    };
  }

  /* ================= SUBMIT ANSWER ================= */
  async submitAnswer(userId, sessionId, question, userAnswer) {
    const isCorrect = userAnswer === question.answer;

    await testRepo.saveAnswer(userId, sessionId, question.id, userAnswer);
    await testRepo.updateScore(userId, sessionId, isCorrect);

    return {
      correct: isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation,
      subject: question.subject
    };
