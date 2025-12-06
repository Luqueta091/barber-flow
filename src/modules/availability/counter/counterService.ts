export type CounterWindow = {
  unitId: string;
  serviceId: string;
  windowStart: Date;
  windowEnd: Date;
  capacity: number;
};

export interface CounterService {
  increment(window: CounterWindow, delta?: number): Promise<boolean>;
  decrement(window: CounterWindow, delta?: number): Promise<void>;
  getUsage(window: CounterWindow): Promise<{ used: number; capacity: number }>;
}

type CounterKey = string;

function buildKey(window: CounterWindow): CounterKey {
  return `${window.unitId}:${window.serviceId}:${window.windowStart.toISOString()}:${window.windowEnd.toISOString()}`;
}

// In-memory implementation for tests/dev. Real impl deve usar DB (sql/counters.sql).
export class InMemoryCounterService implements CounterService {
  private store = new Map<CounterKey, { used: number; capacity: number }>();

  async increment(window: CounterWindow, delta = 1): Promise<boolean> {
    if (delta <= 0) throw new Error("delta must be positive");
    const key = buildKey(window);
    const current = this.store.get(key) ?? { used: 0, capacity: window.capacity };
    const capacity = Math.max(current.capacity, window.capacity);

    if (current.used + delta > capacity) {
      return false;
    }

    this.store.set(key, { used: current.used + delta, capacity });
    return true;
  }

  async decrement(window: CounterWindow, delta = 1): Promise<void> {
    const key = buildKey(window);
    const current = this.store.get(key) ?? { used: 0, capacity: window.capacity };
    this.store.set(key, { used: Math.max(0, current.used - delta), capacity: current.capacity });
  }

  async getUsage(window: CounterWindow): Promise<{ used: number; capacity: number }> {
    const key = buildKey(window);
    return this.store.get(key) ?? { used: 0, capacity: window.capacity };
  }
}
