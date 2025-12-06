import { v4 as uuid } from "uuid";

export type UserProfile = {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
};

const users = new Map<string, UserProfile>();

export const userStore = {
  create(input: { fullName: string; phone?: string; email?: string }): UserProfile {
    const now = new Date();
    const user: UserProfile = {
      id: uuid(),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    };
    users.set(user.id, user);
    return user;
  },
  update(id: string, input: { fullName?: string; phone?: string; email?: string }): UserProfile | null {
    const existing = users.get(id);
    if (!existing) return null;
    const updated: UserProfile = {
      ...existing,
      fullName: input.fullName ?? existing.fullName,
      phone: input.phone ?? existing.phone,
      email: input.email ?? existing.email,
      updatedAt: new Date(),
    };
    users.set(id, updated);
    return updated;
  },
  delete(id: string) {
    return users.delete(id);
  },
  get(id: string): UserProfile | null {
    return users.get(id) ?? null;
  },
  search(query: { phone?: string; email?: string }): UserProfile[] {
    const res: UserProfile[] = [];
    for (const user of users.values()) {
      if (query.phone && user.phone === query.phone) res.push(user);
      else if (query.email && user.email === query.email) res.push(user);
    }
    return res;
  },
  all(): UserProfile[] {
    return Array.from(users.values());
  },
  clear() {
    users.clear();
  },
};
