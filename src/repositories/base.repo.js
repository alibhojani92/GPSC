// Base Repository
// Common helpers for all repositories (no domain logic)

export class BaseRepository {
  constructor(env) {
    this.env = env;
  }

  /**
   * Generate stable storage key
   */
  key(...parts) {
    return parts.filter(Boolean).join(":");
  }

  /**
   * Parse JSON safely
   */
  safeParse(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  /**
   * Stringify JSON safely
   */
  safeStringify(value) {
    return JSON.stringify(value);
  }

  /**
   * Current ISO timestamp
   */
  now() {
    return new Date().toISOString();
  }
}
