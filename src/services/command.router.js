// Command Router
// Maps commands to services (NO business logic here)

import { McqService } from "./mcq.service.js";
import { ReadingService } from "./reading.service.js";
import { TestService } from "./test.service.js";
import { ReportService } from "./report.service.js";
import { UserService } from "./user.service.js";
import { AdminService } from "./admin.service.js";

export class CommandRouter {
  constructor(env) {
    this.env = env;

    this.mcq = new McqService(env);
    this.reading = new ReadingService(env);
    this.test = new TestService(env);
    this.report = new ReportService(env);
    this.user = new UserService(env);
    this.admin = new AdminService(env);
  }

  /**
   * Entry point for all commands
   */
  async route(ctx) {
    const { command, args, from } = ctx;

    // Ensure user exists
    await this.user.ensureUser(from);
    await this.user.touch(from.id);

    switch (command) {
      /* ================= READING ================= */
      case "/read":
        return this.reading.startReading(from.id, { source: "telegram" });

      case "/stop":
        return this.reading.stopReading(from.id);

      /* ================= MCQ ================= */
      case "/amcq":
        return { action: "START_AMCQ_FLOW" };

      /* ================= TEST ================= */
      case "/dt":
        return this.test.createTest({
          userId: from.id,
          type: "daily",
          limit: 20
        });

      case "/wt":
        return this.test.createTest({
          userId: from.id,
          type: "weekly",
          limit: 50
        });

      /* ================= REPORT ================= */
      case "/report":
        return this.report.getDailyReport(
          from.id,
          new Date().toISOString().slice(0, 10)
        );

      case "/mr":
        const now = new Date();
        return this.report.getMonthlyReport(
          from.id,
          now.getFullYear(),
          now.getMonth() + 1
        );

      /* ================= ADMIN ================= */
      case "/broadcast":
        if (!this.admin.isAdmin(from.id)) {
          throw new Error("Admin only command");
        }
        return this.admin.broadcast(args.join(" "));

      case "/dtc":
      case "/wtc":
        if (!this.admin.isAdmin(from.id)) {
          throw new Error("Admin only command");
        }
        return { action: "CANCEL_ACTIVE_TEST" };

      default:
        return { message: "Unknown command" };
    }
  }
          }
