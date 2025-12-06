export type NotifyJob = {
  type: "push" | "email" | "sms";
  target: string;
  payload: Record<string, unknown>;
};

export interface Provider {
  send(job: NotifyJob): Promise<void>;
}

export class StubProvider implements Provider {
  async send(job: NotifyJob) {
    // eslint-disable-next-line no-console
    console.log("[stub-provider] sending", job.type, "to", job.target);
  }
}
