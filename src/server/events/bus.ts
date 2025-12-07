type Subscriber = {
  id: string;
  write: (data: string) => void;
};

class SSEBus {
  private subscribers: Subscriber[] = [];

  subscribe(write: (data: string) => void) {
    const id = crypto.randomUUID();
    this.subscribers.push({ id, write });
    return () => {
      this.subscribers = this.subscribers.filter((s) => s.id !== id);
    };
  }

  publish(event: string, payload: unknown) {
    const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const sub of this.subscribers) {
      sub.write(data);
    }
  }
}

export const sseBus = new SSEBus();
