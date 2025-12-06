export type PushSubscription = {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  createdAt: Date;
};

const subs = new Map<string, PushSubscription>();

export const pushStore = {
  save(sub: Omit<PushSubscription, "createdAt">) {
    const stored: PushSubscription = { ...sub, createdAt: new Date() };
    subs.set(sub.endpoint, stored);
    return stored;
  },
  listForUser(userId?: string) {
    return Array.from(subs.values()).filter((s) => (userId ? s.userId === userId : true));
  },
  clear() {
    subs.clear();
  },
};
