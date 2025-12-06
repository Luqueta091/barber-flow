import { Provider, StubProvider, NotifyJob } from "../../notification/providers/providerStub.js";

type DeliverResult = { ok: true } | { ok: false; error: string };

export async function deliverWithRetry(
  job: NotifyJob,
  provider: Provider = new StubProvider(),
  maxRetries = 3,
  backoffMs = 500,
): Promise<DeliverResult> {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      await provider.send(job);
      return { ok: true };
    } catch (e: unknown) {
      attempt += 1;
      if (attempt > maxRetries) {
        const message = e instanceof Error ? e.message : "send_failed";
        return { ok: false, error: message };
      }
      await new Promise((r) => setTimeout(r, backoffMs * attempt)); // simple backoff
    }
  }
  return { ok: false, error: "unreachable" };
}
