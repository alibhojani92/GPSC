/**
 * FILE 26 – report.controller.js
 * Purpose: Handle report commands and send formatted replies
 */

import {
  dailyReportMessage,
  weeklyReportMessage,
  monthlyReportMessage
} from "./report.reply.js";

import { sendMessage } from "../utils/telegram.js";

/* ================= DAILY REPORT ================= */

export async function handleDailyReport(ctx, reportData) {
  const text = dailyReportMessage(reportData);
  await sendMessage(ctx.chat.id, text, { parse_mode: "Markdown" });
}

/* ================= WEEKLY REPORT ================= */

export async function handleWeeklyReport(ctx, reportData) {
  const text = weeklyReportMessage(reportData);
  await sendMessage(ctx.chat.id, text, { parse_mode: "Markdown" });
}

/* ================= MONTHLY REPORT ================= */

export async function handleMonthlyReport(ctx, reportData) {
  const text = monthlyReportMessage(reportData);
  await sendMessage(ctx.chat.id, text, { parse_mode: "Markdown" });
}
