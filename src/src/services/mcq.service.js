// MCQ Service
// Handles: add MCQ, bulk add, subject mapping, validation hook
// Storage: KV + D1 via repository layer (NO direct storage here)

import { SUBJECTS_MAP } from "../config/subjects.js";
import { McqRepository } from "../repositories/mcq.repo.js";
import { validateMCQ } from "../validators/mcq.validator.js";
import { logger } from "./logger.js";

export class McqService {
  constructor(env) {
    this.env = env;
    this.repo = new McqRepository(env);
  }

  /**
   * Add single MCQ
   */
  async addMCQ(mcqData, meta = {}) {
    validateMCQ(mcqData);

    const subject = SUBJECTS_MAP[mcqData.subject];
    if (!subject) {
      throw new Error("Invalid subject selected");
    }

    const mcq = {
      id: crypto.randomUUID(),
      subject: mcqData.subject,
      question: mcqData.question.trim(),
      options: mcqData.options,
      answer: mcqData.answer,
      explanation: mcqData.explanation || "",
      difficulty: mcqData.difficulty || "medium",
      source: mcqData.source || "manual",
      createdBy: meta.userId || "system",
      createdAt: new Date().toISOString()
    };

    await this.repo.insert(mcq);
    logger.info("MCQ added", { mcqId: mcq.id });

    return mcq.id;
  }

  /**
   * Bulk MCQ add (used by /amcq flow)
   */
  async bulkAdd(mcqList, meta = {}) {
    if (!Array.isArray(mcqList) || mcqList.length === 0) {
      throw new Error("MCQ list empty");
    }

    const insertedIds = [];

    for (const mcq of mcqList) {
      try {
        const id = await this.addMCQ(mcq, meta);
        insertedIds.push(id);
      } catch (err) {
        logger.error("Bulk MCQ failed", { error: err.message });
      }
    }

    return {
      total: mcqList.length,
      inserted: insertedIds.length,
      ids: insertedIds
    };
  }

  /**
   * Fetch MCQs for test engine
   */
  async getMCQsBySubject(subject, limit = 10) {
    if (!SUBJECTS_MAP[subject]) {
      throw new Error("Invalid subject");
    }

    return this.repo.getRandomBySubject(subject, limit);
  }

  /**
   * Stats helper (used by reports later)
   */
  async countBySubject(subject) {
    return this.repo.countBySubject(subject);
  }
      }
