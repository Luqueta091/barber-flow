import { OtpEntry, OtpStore } from "./store.js";

type MemoryVal = OtpEntry;

export class InMemoryOtpStore implements OtpStore {
  private store = new Map<string, MemoryVal>();

  async set(phone: string, code: string, ttlSeconds: number): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(phone, { code, attempts: 0, expiresAt });
  }

  async get(phone: string): Promise<OtpEntry | null> {
    const val = this.store.get(phone);
    if (!val) return null;
    if (val.expiresAt <= Date.now()) {
      this.store.delete(phone);
      return null;
    }
    return val;
  }

  async incrementAttempts(phone: string): Promise<OtpEntry | null> {
    const val = await this.get(phone);
    if (!val) return null;
    val.attempts += 1;
    this.store.set(phone, val);
    return val;
  }

  async delete(phone: string): Promise<void> {
    this.store.delete(phone);
  }
}
