// Test Service
// Handles: test creation, MCQ selection, answer evaluation (no Telegram logic)

import { McqRepository } from "../repositories/mcq.repo.js";
import { TestRepository } from "../repositories/test.repo.js";
import { logger } from "./logger.js";

export class TestService {
  constructor(env) {
    this.env = env;
    this.mcqRepo = new McqRepository(env);
    this.testRepo = new TestRepository(env);
  }

  /**
   * Create a new test (daily / weekly / subject-wise)
   */
  async createTest({ userId, type, subject = null, limit }) {
    const mcqs = subject
      ? await this.mcqRepo.getRandomBySubject(subject, limit)
      : await this.mcqRepo.getRandom(limit);

    if (!mcqs || mcqs.length === 0) {
      throw new Error("No MCQs available for test");
    }

    const test = {
      id: crypto.randomUUID(),
      userId,
      type,
      subject,
      total: mcqs.length,
      correct: 0,
      wrong: 0,
      startedAt: Date.now(),
      completedAt: null
    };

    await this.testRepo.create(test);
    logger.info("Test created", { testId: test.id, type, subject });

    return {
      testId: test.id,
      mcqs
    };
  }

  /**
   * Submit answer for a question
   */
  async submitAnswer(testId, questionId, answer) {
    const test = await this.testRepo.getById(testId);
    if (!test) throw new Error("Test not found");

    const mcq = await this.mcqRepo.getById(questionId);
    if (!mcq) throw new Error("MCQ not found");

    const isCorrect = mcq.answer === answer;

    await this.testRepo.recordAnswer({
      testId,
      questionId,
      answer,
      correct: isCorrect
    });

    await this.testRepo.updateScore(testId, isCorrect);

    return {
      correct: isCorrect,
      explanation: mcq.explanation || "",
      subject: mcq.subject
    };
  }

  /**
   * Finish test
   */
  async finishTest(testId) {
    const test = await this.testRepo.getById(testId);
    if (!test) throw new Error("Test not found");

    await this.testRepo.complete(testId, Date.now());

    logger.info("Test finished", { testId });

    return await this.testRepo.getSummary(testId);
  }
                               }
