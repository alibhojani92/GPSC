// src/services/test.service.js

export class TestService {
  constructor({ testRepo, mcqRepo, userRepo }) {
    this.testRepo = testRepo;
    this.mcqRepo = mcqRepo;
    this.userRepo = userRepo;
  }

  async startTest(userId, subject, limit = 10) {
    const questions = await this.mcqRepo.getRandomBySubject(subject, limit);

    if (!questions || questions.length === 0) {
      return {
        ok: false,
        message: "No MCQs available for this subject"
      };
    }

    const session = {
      userId,
      subject,
      total: questions.length,
      correct: 0,
      wrong: 0,
      startedAt: Date.now(),
      completed: false
    };

    await this.testRepo.createSession(userId, session);

    return {
      ok: true,
      questions
    };
  }

  async submitAnswer(userId, isCorrect) {
    const session = await this.testRepo.getActiveSession(userId);
    if (!session) return null;

    if (isCorrect) session.correct++;
    else session.wrong++;

    await this.testRepo.updateSession(userId, session);
    return session;
  }

  async endTest(userId) {
    const session = await this.testRepo.getActiveSession(userId);
    if (!session) return null;

    session.completed = true;
    session.endedAt = Date.now();

    await this.testRepo.finishSession(userId, session);
    return session;
  }
  }
