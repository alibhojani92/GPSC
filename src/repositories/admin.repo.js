/*****************************************************************
 * Admin Repository
 * Handles ONLY admin & system-level persistence
 *****************************************************************/

const BaseRepo = require("./base.repo");

class AdminRepo extends BaseRepo {
  constructor() {
    super();
  }

  /* ================= CREATE ADMIN ================= */
  async createAdmin(adminId, data = {}) {
    const key = `admin:${adminId}`;

    const payload = {
      adminId,
      role: "ADMIN",
      permissions: data.permissions || ["ALL"],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return this.set(key, payload);
  }

  /* ================= GET ADMIN ================= */
  async getAdmin(adminId) {
    return this.get(`admin:${adminId}`);
  }

  /* ================= UPDATE ADMIN ================= */
  async updateAdmin(adminId, data) {
    const key = `admin:${adminId}`;
    const admin = await this.get(key);

    if (!admin) return null;

    const updated = {
      ...admin,
      ...data,
      updatedAt: Date.now()
    };

    return this.set(key, updated);
  }

  /* ================= SYSTEM FLAGS ================= */
  async setSystemFlag(flag, value) {
    const meta = (await this.get("system:meta")) || {};
    meta[flag] = value;
    return this.set("system:meta", meta);
  }

  async getSystemFlag(flag) {
    const meta = await this.get("system:meta");
    return meta ? meta[flag] : null;
  }

  /* ================= SYSTEM LOGS ================= */
  async logAction(action) {
    const logs = (await this.get("system:logs")) || [];
    logs.push({
      action,
      time: Date.now()
    });

    // keep last 500 logs only
    if (logs.length > 500) logs.shift();

    return this.set("system:logs", logs);
  }

  async getSystemLogs(limit = 50) {
    const logs = (await this.get("system:logs")) || [];
    return logs.slice(-limit);
  }
}

module.exports = new AdminRepo();
