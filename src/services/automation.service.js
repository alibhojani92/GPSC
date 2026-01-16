// src/services/automation.service.js

import { UserRepository } from "../repositories/user.repo.js";
import { ReadingRepository } from "../repositories/reading.repo.js";
import { McqRepository } from "../repositories/mcq.repo.js";
import { TestRepository } from "../repositories/test.repo.js";
import { ReportService } from "./report.service.js";
import { IST } from "../config/constants.js";

export class AutomationService {
  constructor(env) {
    this.userRepo = new UserRepository(env);
    this.readingRepo = new ReadingRepository(env);
    this.mcqRepo = new McqRepository(env);
    this.testRepo = new TestRepository(env);
    this.reportService = new ReportService(env);
  }

  /* ==============================
     TIME HELPERS (IST)
  ============================== */

  nowIST() {
    const now = new Date();
    return new Date(now.getTime() + IST.offsetMs);
  }

  getISTHour() {
    return this.nowIST().getHours();
  }

  /* ==============================
     GLOBAL PAUSE CHECK
  ============================== */

  async isUserBusy(userId) {
    const activeTest = await this.testRepo.getActiveTest(userId);
    return !!activeTest;
  }

  /* ==============================
     READING REMINDER
  ============================== */

  async readingReminder(userId) {
    if (await this.isUserBusy(userId)) return null;

    const today = this.nowIST().toISOString().slice(0, 10);
    const reading = await this.readingRepo.getReadingByDate(userId, today);

    if (reading && reading.minutes >= 60) return null;

    return {
      type: "READING_REMINDER",
      userId,
      suggestedMinutes: 30
    };
  }

  /* ==============================
     MCQ AUTO PUSH
  ============================== */

  async autoMcq(userId) {
    if (await this.isUserBusy(userId)) return null;

    const weakSubjects =
      await this.reportService.getWeakSubjects(userId, 65);

    const subject =
      weakSubjects.length > 0
        ? weakSubjects[0].subjectCode
        : null;

    const mcqs = await this.mcqRepo.getRandomMcqs({
      subject,
      limit: 10
    });

    if (!mcqs || mcqs.length === 0) return null;

    return {
      type: "AUTO_MCQ",
      userId,
      subject,
      mcqIds: mcqs.map(m => m.id)
    };
  }

  /* ==============================
     DAILY REPORT TRIGGER
  ============================== */

  async dailyReport(userId) {
    const today = this.nowIST().toISOString().slice(0, 10);

    const report = await this.reportService.getDailyReport(
      userId,
      today
    );

    return {
      type: "DAILY_REPORT",
      userId,
      report
    };
  }

  /* ==============================
     MOTIVATION ENGINE
  ============================== */

  motivationMessage() {
    const messages = [
      "Consistency beats intensity. 30 minutes today matters.",
      "Dental Pulse topper rule: revise before you rest.",
      "Weak subjects are opportunities, not threats.",
      "One MCQ today can change rank tomorrow."
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  async motivation(userId) {
    if (await this.isUserBusy(userId)) return null;

    return {
      type: "MOTIVATION",
      userId,
      text: this.motivationMessage()
    };
  }

  /* ==============================
     MASTER AUTOMATION TICK
  ============================== */

  async tick() {
    const hour = this.getISTHour();
    const users = await this.userRepo.getAllActiveUsers();

    const actions = [];

    for (const user of users) {
      if (hour === 6) {
        const a = await this.readingReminder(user.id);
        if (a) actions.push(a);
      }

      if (hour === 14) {
        const a = await this.autoMcq(user.id);
        if (a) actions.push(a);
      }

      if (hour === 21) {
        const a = await this.motivation(user.id);
        if (a) actions.push(a);
      }

      if (hour === 23) {
        const a = await this.dailyReport(user.id);
        if (a) actions.push(a);
      }
    }

    return actions;
  }
}
