export type EventEnvelope<T = unknown> = {
  type: string;
  version: "v1";
  id: string;
  occurredAt: string;
  payload: T;
};

export type EventPublisher = {
  publish: (event: EventEnvelope) => Promise<void>;
  subscribe: (handler: (event: EventEnvelope) => Promise<void> | void) => void;
};

// Simple in-memory collector for testing; replace with broker publisher in production.
export class InMemoryEventPublisher implements EventPublisher {
  public events: EventEnvelope[] = [];
  private subscribers: Array<(event: EventEnvelope) => Promise<void> | void> = [];

  subscribe(handler: (event: EventEnvelope) => Promise<void> | void) {
    this.subscribers.push(handler);
  }

  async publish(event: EventEnvelope): Promise<void> {
    this.events.push(event);
    for (const sub of this.subscribers) {
      await sub(event);
    }
  }
}
