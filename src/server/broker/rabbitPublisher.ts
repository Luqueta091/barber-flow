import amqplib from "amqplib";
import { EventEnvelope, EventPublisher } from "../../../events/publisher.js";

export class RabbitPublisher implements EventPublisher {
  private conn?: amqplib.Connection;
  private channel?: amqplib.Channel;
  private subscribers: Array<(event: EventEnvelope) => Promise<void> | void> = [];

  constructor(
    private readonly url: string,
    private readonly exchange: string,
  ) {}

  async init() {
    this.conn = await amqplib.connect(this.url);
    this.channel = await this.conn.createChannel();
    await this.channel.assertExchange(this.exchange, "fanout", { durable: true });
  }

  subscribe(handler: (event: EventEnvelope) => Promise<void> | void) {
    this.subscribers.push(handler);
  }

  async publish(event: EventEnvelope) {
    if (!this.channel) throw new Error("RabbitPublisher not initialized");
    const payload = Buffer.from(JSON.stringify(event));
    this.channel.publish(this.exchange, "", payload, { persistent: true });
    for (const sub of this.subscribers) {
      await sub(event);
    }
  }
}
