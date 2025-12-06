export type OtpEntry = {
  code: string;
  attempts: number;
  expiresAt: number;
};

export interface OtpStore {
  set(phone: string, code: string, ttlSeconds: number): Promise<void>;
  get(phone: string): Promise<OtpEntry | null>;
  incrementAttempts(phone: string): Promise<OtpEntry | null>;
  delete(phone: string): Promise<void>;
}
