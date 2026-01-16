// src/services/report.service.js

import { McqRepository } from "../repositories/mcq.repo.js";
import { TestRepository } from "../repositories/test.repo.js";
import { ReadingRepository } from "../repositories/reading.repo.js";
import { UserRepository } from "../repositories/user.repo.js";
import { SUBJECTS } from "../config/subjects.js";

export class ReportService {
  constructor(env) {
    this.mcqRepo = new McqRepository(env);
    this.testRepo = new TestRepository(env);
    this.readingRepo = new ReadingRepository(env);
    this.userRepo = new UserRepository(env);
  }

  /* ==============================
     BASIC HELPERS
  ============================== */

  getSubjectMap() {
    const map = {};
    SUBJECTS.forEach(s => (map[s.code] = s.name));
    return map;
  }

  percent(part, total) {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  }

  /* ==============================
     DAILY REPORT
  ============================== */

  async getDailyReport(userId, dateISO) {
    const tests = await this.testRepo.getTestsByDate(userId, dateISO);
    const reading = await this.readingRepo.getReadingByDate(userId, dateISO);

    let totalQ = 0;
    let correct = 0;

    tests.forEach(t => {
      totalQ += t.totalQuestions || 0;
      correct += t.correct || 0;
    });

    return {
      date: dateISO,
      testsAttempted: tests.length,
      totalQuestions: totalQ,
      correctAnswers: correct,
      accuracy: this.percent(correct, totalQ),
      readingMinutes: reading?.minutes || 0
    };
  }

  /* ==============================
     WEEKLY / MONTHLY REPORT
  ============================== */

  async getRangeReport(userId, startISO, endISO) {
    const tests = await this.testRepo.getTestsInRange(userId, startISO, endISO);
    const readings = await this.readingRepo.getReadingInRange(
      userId,
      startISO,
      endISO
    );

    let totalQ = 0;
    let correct = 0;
    let readingMinutes = 0;

    tests.forEach(t => {
      totalQ += t.totalQuestions || 0;
      correct += t.correct || 0;
    });

    readings.forEach(r => {
      readingMinutes += r.minutes || 0;
    });

    return {
      from: startISO,
      to: endISO,
      testsAttempted: tests.length,
      totalQuestions: totalQ,
      correctAnswers: correct,
      accuracy: this.percent(correct, totalQ),
      readingMinutes
    };
  }

  /* ==============================
     SUBJECT WISE PERFORMANCE
  ============================== */

  async getSubjectReport(userId) {
    const tests = await this.testRepo.getAllTests(userId);
    const subjectMap = this.getSubjectMap();

    const stats = {};

    tests.forEach(test => {
      test.breakup?.forEach(b => {
        if (!stats[b.subject]) {
          stats[b.subject] = { total: 0, correct: 0 };
        }
        stats[b.subject].total += b.total || 0;
        stats[b.subject].correct += b.correct || 0;
      });
    });

    return Object.keys(stats).map(code => ({
      subjectCode: code,
      subjectName: subjectMap[code] || code,
      totalQuestions: stats[code].total,
      correctAnswers: stats[code].correct,
      accuracy: this.percent(stats[code].correct, stats[code].total)
    }));
  }

  /* ==============================
     WEAK SUBJECT ANALYSIS
  ============================== */

  async getWeakSubjects(userId, threshold = 60) {
    const subjectReport = await this.getSubjectReport(userId);

    return subjectReport.filter(
      s => s.totalQuestions >= 20 && s.accuracy < threshold
    );
  }

  /* ==============================
     USER PROGRESS SUMMARY
  ============================== */

  async getUserSummary(userId) {
    const user = await this.userRepo.getUser(userId);
    const tests = await this.testRepo.getAllTests(userId);
    const reading = await this.readingRepo.getAllReading(userId);

    let totalQ = 0;
    let correct = 0;
    let readingMinutes = 0;

    tests.forEach(t => {
      totalQ += t.totalQuestions || 0;
      correct += t.correct || 0;
    });

    reading.forEach(r => {
      readingMinutes += r.minutes || 0;
    });

    return {
      userId,
      name: user?.name || null,
      joinedAt: user?.createdAt || null,
      totalTests: tests.length,
      totalQuestions: totalQ,
      overallAccuracy: this.percent(correct, totalQ),
      totalReadingMinutes: readingMinutes
    };
  }
      }
