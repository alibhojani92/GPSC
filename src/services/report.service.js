// Report Service
// Handles: daily, weekly, monthly summaries for reading & tests

import { ReadingRepository } from "../repositories/reading.repo.js";
import { TestRepository } from "../repositories/test.repo.js";
import { logger } from "./logger.js";

export class ReportService {
  constructor(env) {
    this.env = env;
    this.readingRepo = new ReadingRepository(env);
    this.testRepo = new TestRepository(env);
  }

  /**
   * Daily report
   */
  async getDailyReport(userId, date) {
    const readingMinutes = await this.readingRepo.getTotalMinutes(userId, date);
    const tests = await this.testRepo.getTestsByDate(userId, date);

    return {
      date,
      readingMinutes,
      tests,
    };
  }

  /**
   * Weekly report (last 7 days ending today)
   */
  async getWeeklyReport(userId, endDate) {
    const dates = this._lastNDates(endDate, 7);
    const report = [];

    for (const date of dates) {
      const daily = await this.getDailyReport(userId, date);
      report.push(daily);
    }

    return report;
  }

  /**
   * Monthly report (calendar month)
   */
  async getMonthlyReport(userId, year, month) {
    const dates = this._datesOfMonth(year, month);
    let totalReading = 0;
    let testCount = 0;
    let correct = 0;
    let wrong = 0;

    for (const date of dates) {
      const daily = await this.getDailyReport(userId, date);
      totalReading += daily.readingMinutes || 0;

      for (const t of daily.tests || []) {
        testCount++;
        correct += t.correct || 0;
        wrong += t.wrong || 0;
      }
    }

    return {
      year,
      month,
      totalReadingMinutes: totalReading,
      totalTests: testCount,
      correct,
      wrong,
    };
  }

  /* ================= Helpers ================= */

  _lastNDates(endDate, n) {
    const dates = [];
    const base = new Date(endDate);

    for (let i = 0; i < n; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates.reverse();
  }

  _datesOfMonth(year, month) {
    const dates = [];
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().slice(0, 10));
    }
    return dates;
  }
}
