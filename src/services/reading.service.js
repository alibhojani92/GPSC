// Reading Service
// Handles: start/stop reading, time calculation, daily aggregation
// Scope: business logic only (no Telegram code)

import { ReadingRepository } from "../repositories/reading.repo.js";
import { UserRepository } from "../repositories/user.repo.js";
import { logger } from "./logger.js";

export class ReadingService {
  constructor(env) {
    this.env = env;
    this.readingRepo = new ReadingRepository(env);
    this.userRepo = new UserRepository(env);
  }

  /**
   * Start reading session
   * Prevents duplicate active session per user per day
   */
  async startReading(userId, meta = {}) {
    const today = this._today();

    const active = await this.readingRepo.getActiveSession(userId, today);
    if (active) {
      return {
        started: false,
        message: "Reading already active"
      };
    }

    await this.readingRepo.startSession({
      userId,
      date: today,
      startedAt: Date.now(),
      source: meta.source || "unknown"
    });

    logger.info("Reading started", { userId, date: today });

    return {
      started: true,
      date: today
    };
  }

  /**
   * Stop reading session
   * Calculates minutes and stores daily total
   */
  async stopReading(userId) {
    const today = this._today();

    const session = await this.readingRepo.getActiveSession(userId, today);
    if (!session) {
      return {
        stopped: false,
        message: "No active reading session"
      };
    }

    const now = Date.now();
    const minutes = Math.max(
      1,
      Math.floor((now - session.startedAt) / 60000)
    );

    await this.readingRepo.closeSession(userId, today, minutes);

    logger.info("Reading stopped", {
      userId,
      date: today,
      minutes
    });

    return {
      stopped: true,
      minutes,
      date: today
    };
  }

  /**
   * Get reading summary for a date
   */
  async getDailySummary(userId, date) {
    const minutes = await this.readingRepo.getTotalMinutes(userId, date);
    return {
      date,
      minutes
    };
  }

  /**
   * Helper: IST date (YYYY-MM-DD)
   * NOTE: timezone handled later at scheduler level
   */
  _today() {
    return new Date().toISOString().slice(0, 10);
  }
  }
