import { describe, expect, it, vi } from "vitest";
import { deliverWithRetry } from "./deliver";
import { NotifyJob, Provider } from "../../notification/providers/providerStub";

const okJob: NotifyJob = { type: "push", target: "endpoint", payload: {} };

class FailingProvider implements Provider {
  private failCount = 0;
  constructor(private readonly failUntil: number) {}
  async send() {
    this.failCount += 1;
    if (this.failCount <= this.failUntil) throw new Error("boom");
  }
}

describe("deliverWithRetry", () => {
  it("faz backoff e envia quando provider recupera", async () => {
    vi.useFakeTimers();
    const provider = new FailingProvider(2); // falha 2x, sucesso na 3a
    const promise = deliverWithRetry(okJob, provider, 3, 10);
    vi.runAllTimers();
    const res = await promise;
    expect(res.ok).toBe(true);
    vi.useRealTimers();
  });

  it("retorna erro após maxRetries", async () => {
    vi.useFakeTimers();
    const provider = new FailingProvider(5); // sempre falha
    const promise = deliverWithRetry(okJob, provider, 2, 10);
    vi.runAllTimers();
    const res = await promise;
    expect(res.ok).toBe(false);
    vi.useRealTimers();
  });
});
