// User Service
// Handles: user initialization, role detection, profile snapshot

import { UserRepository } from "../repositories/user.repo.js";
import { logger } from "./logger.js";

export class UserService {
  constructor(env) {
    this.env = env;
    this.userRepo = new UserRepository(env);
  }

  /**
   * Ensure user exists (idempotent)
   */
  async ensureUser(user) {
    const existing = await this.userRepo.getById(user.id);
    if (existing) return existing;

    const profile = {
      id: user.id,
      username: user.username || null,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      role: this._resolveRole(user.id),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    await this.userRepo.create(profile);
    logger.info("User created", { userId: user.id });

    return profile;
  }

  /**
   * Update last active timestamp
   */
  async touch(userId) {
    await this.userRepo.updateLastActive(userId, new Date().toISOString());
  }

  /**
   * Snapshot helper (used in reports/advice later)
   */
  async getSnapshot(userId) {
    const user = await this.userRepo.getById(userId);
    if (!user) return null;

    return {
      id: user.id,
      role: user.role,
      joined: user.createdAt,
      lastActive: user.lastActiveAt
    };
  }

  /* ================= Helpers ================= */

  _resolveRole(userId) {
    // NOTE: admin IDs injected later via env/config
    if (this.env.ADMIN_IDS && this.env.ADMIN_IDS.includes(String(userId))) {
      return "admin";
    }
    return "student";
  }
      }
