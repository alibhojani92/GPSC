// Admin Service
// Handles: admin-only operations like broadcast, system notices

import { UserRepository } from "../repositories/user.repo.js";
import { TestRepository } from "../repositories/test.repo.js";
import { logger } from "./logger.js";

export class AdminService {
  constructor(env) {
    this.env = env;
    this.userRepo = new UserRepository(env);
    this.testRepo = new TestRepository(env);
  }

  /**
   * Verify admin permission
   */
  isAdmin(userId) {
    return (
      this.env.ADMIN_IDS &&
      this.env.ADMIN_IDS.includes(String(userId))
    );
  }

  /**
   * Broadcast message to all users
   */
  async broadcast(message) {
    const users = await this.userRepo.getAll();
    logger.info("Broadcast initiated", { count: users.length });

    return users.map(u => ({
      userId: u.id,
      message
    }));
  }

  /**
   * Cancel active test (admin only)
   */
  async cancelActiveTest(testId) {
    const test = await this.testRepo.getById(testId);
    if (!test) {
      throw new Error("Test not found");
    }

    await this.testRepo.cancel(testId);

    logger.info("Test cancelled", { testId });

    return {
      testId,
      status: "cancelled"
    };
  }

  /**
   * Admin stats helper
   */
  async systemStats() {
    const totalUsers = await this.userRepo.count();
    const totalTests = await this.testRepo.countAll();

    return {
      totalUsers,
      totalTests,
      uptime: process.uptime()
    };
  }
  }
