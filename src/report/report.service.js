/**
 * FILE 24 – report.service.js
 * Purpose: Generate daily / weekly / monthly report data
 */

import { getTodayDate, getWeekRange, getMonthKey } from "../utils/date.js";
import { formatMinutes } from "../reading/daily.target.js";

/* ================= DAILY REPORT ================= */

export function buildDailyReport(userData) {
  const today = getTodayDate();
  const history = userData.readingHistory || {};
  const tests = userData.testHistory || [];

  const reading = history[today] || { minutes: 0, sessions: 0 };

  const todayTests = tests.filter(t => t.date === today);

  return {
    date: today,
    studyMinutes: reading.minutes,
    studyFormatted: formatMinutes(reading.minutes),
    sessions: reading.sessions,
    tests: summarizeTests(todayTests),
  };
}

/* ================= WEEKLY REPORT ================= */

export function buildWeeklyReport(userData) {
  const { start, end } = getWeekRange();
  const history = userData.readingHistory || {};
  const tests = userData.testHistory || [];

  let totalMinutes = 0;
  let daysStudied = 0;

  Object.keys(history).forEach(date => {
    if (date >= start && date <= end) {
      totalMinutes += history[date].minutes;
      if (history[date].minutes > 0) daysStudied++;
    }
  });

  const weeklyTests = tests.filter(
    t => t.date >= start && t.date <= end
  );

  return {
    range: `${start} → ${end}`,
    totalMinutes,
    totalFormatted: formatMinutes(totalMinutes),
    daysStudied,
    tests: summarizeTests(weeklyTests),
  };
}

/* ================= MONTHLY REPORT ================= */

export function buildMonthlyReport(userData) {
  const monthKey = getMonthKey(); // YYYY-MM
  const history = userData.readingHistory || {};
  const tests = userData.testHistory || [];

  let totalMinutes = 0;
  let activeDays = 0;

  Object.keys(history).forEach(date => {
    if (date.startsWith(monthKey)) {
      totalMinutes += history[date].minutes;
      if (history[date].minutes > 0) activeDays++;
    }
  });

  const monthlyTests = tests.filter(t =>
    t.date.startsWith(monthKey)
  );

  return {
    month: monthKey,
    totalMinutes,
    totalFormatted: formatMinutes(totalMinutes),
    activeDays,
    tests: summarizeTests(monthlyTests),
  };
}

/* ================= TEST SUMMARY ================= */

function summarizeTests(tests = []) {
  if (!tests.length) {
    return {
      attempted: 0,
      correct: 0,
      accuracy: 0,
      bySubject: {},
    };
  }

  let correct = 0;
  let total = 0;
  const bySubject = {};

  tests.forEach(t => {
    correct += t.correct || 0;
    total += t.total || 0;

    const subject = t.subject || "General";
    if (!bySubject[subject]) {
      bySubject[subject] = { correct: 0, total: 0 };
    }
    bySubject[subject].correct += t.correct || 0;
    bySubject[subject].total += t.total || 0;
  });

  Object.keys(bySubject).forEach(s => {
    const d = bySubject[s];
    d.accuracy = d.total
      ? Math.round((d.correct / d.total) * 100)
      : 0;
  });

  return {
    attempted: tests.length,
    correct,
    accuracy: total ? Math.round((correct / total) * 100) : 0,
    bySubject,
  };
}
