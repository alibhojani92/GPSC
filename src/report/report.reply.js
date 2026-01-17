/**
 * FILE 25 – report.reply.js
 * Purpose: Convert report data into Telegram-ready messages
 */

import { formatMinutes } from "../reading/daily.target.js";

/* ================= DAILY REPORT MESSAGE ================= */

export function dailyReportMessage(data) {
  const { date, studyMinutes, studyFormatted, sessions, tests } = data;

  return `
🌺 Dr. Arzoo Fatema 🌺

📊 *Daily Progress Report*
🗓 Date: ${date}

📚 Study Time: ${studyFormatted}
📖 Sessions: ${sessions}

📝 Tests Attempted: ${tests.attempted}
✅ Correct: ${tests.correct}
🎯 Accuracy: ${tests.accuracy}%

${subjectBreakdown(tests.bySubject)}

💡 *Advice:*
Revise weak areas tonight and stay consistent 💪🦷
`.trim();
}

/* ================= WEEKLY REPORT MESSAGE ================= */

export function weeklyReportMessage(data) {
  return `
🌺 Dr. Arzoo Fatema 🌺

📅 *Weekly Performance Report*
🗓 ${data.range}

📚 Total Study: ${data.totalFormatted}
📆 Days Studied: ${data.daysStudied}

📝 Tests Attempted: ${data.tests.attempted}
🎯 Accuracy: ${data.tests.accuracy}%

${subjectBreakdown(data.tests.bySubject)}

💡 *Advice:*
Focus on low-accuracy subjects this week 🔁
`.trim();
}

/* ================= MONTHLY REPORT MESSAGE ================= */

export function monthlyReportMessage(data) {
  return `
🌺 Dr. Arzoo Fatema 🌺

📆 *Monthly Study Summary*
🗓 Month: ${data.month}

📚 Total Study: ${data.totalFormatted}
📆 Active Days: ${data.activeDays}

📝 Tests Attempted: ${data.tests.attempted}
🎯 Accuracy: ${data.tests.accuracy}%

${subjectBreakdown(data.tests.bySubject)}

💡 *Advice:*
Consistency + MCQ practice = GPSC success 🏆🦷
`.trim();
}

/* ================= SUBJECT BREAKDOWN ================= */

function subjectBreakdown(subjects = {}) {
  const keys = Object.keys(subjects);
  if (!keys.length) return "";

  let text = `\n📚 *Subject-wise Performance*\n`;

  keys.forEach(s => {
    const d = subjects[s];
    text += `• ${s}: ${d.correct}/${d.total} (${d.accuracy}%)\n`;
  });

  return text.trim();
              }
