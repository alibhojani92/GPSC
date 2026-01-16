/**
 * User Repository
 * Central access layer for users
 */

import { Store } from "../storage/store.js";

const USER_KEY_PREFIX = "user:";

export const UserRepository = {
  async add(user) {
    const key = `${USER_KEY_PREFIX}${user.id}`;
    await Store.set(key, user);
    return user;
  },

  async getById(id) {
    return Store.get(`${USER_KEY_PREFIX}${id}`);
  },

  async exists(id) {
    const user = await this.getById(id);
    return !!user;
  },

  async update(user) {
    const key = `${USER_KEY_PREFIX}${user.id}`;
    await Store.set(key, user);
    return user;
  },

  async getAll() {
    const keys = await Store.list(USER_KEY_PREFIX);
    const users = [];
    for (const k of keys) {
      const u = await Store.get(k);
      if (u) users.push(u);
    }
    return users;
  },
};
