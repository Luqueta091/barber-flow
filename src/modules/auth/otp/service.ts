import { OtpStore } from "./store.js";

export type RequestOtpResult =
  | { ok: true; expiresAt: number }
  | { ok: false; error: "rate_limited" };

export type VerifyOtpResult =
  | { ok: true; token: string }
  | { ok: false; error: "invalid_code" | "expired" | "too_many_attempts" };

export class OtpService {
  constructor(
    private readonly store: OtpStore,
    private readonly options: { ttlSeconds?: number; maxAttempts?: number; rateLimitMs?: number; tokenFactory?: () => string } = {},
  ) {}

  private ttlSeconds() {
    return this.options.ttlSeconds ?? 300;
  }

  private maxAttempts() {
    return this.options.maxAttempts ?? 5;
  }

  async requestOtp(phone: string): Promise<RequestOtpResult> {
    const existing = await this.store.get(phone);
    if (existing && existing.expiresAt - Date.now() > (this.options.rateLimitMs ?? 30_000)) {
      return { ok: false, error: "rate_limited" };
    }
    const code = this.generateCode();
    await this.store.set(phone, code, this.ttlSeconds());
    return { ok: true, expiresAt: Date.now() + this.ttlSeconds() * 1000 };
  }

  async verifyOtp(phone: string, code: string): Promise<VerifyOtpResult> {
    const entry = await this.store.get(phone);
    if (!entry) return { ok: false, error: "expired" };

    if (entry.attempts >= this.maxAttempts()) {
      await this.store.delete(phone);
      return { ok: false, error: "too_many_attempts" };
    }

    if (entry.code !== code) {
      await this.store.incrementAttempts(phone);
      return { ok: false, error: "invalid_code" };
    }

    await this.store.delete(phone);
    return { ok: true, token: (this.options.tokenFactory ?? this.generateToken)() };
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateToken(): string {
    return crypto.randomUUID();
  }
}
