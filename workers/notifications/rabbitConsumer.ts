import amqplib from "amqplib";
import { processEvent } from "./worker.js";

export async function startRabbitConsumer(opts: {
  url: string;
  exchange: string;
  queue: string;
  dlq: string;
  prefetch?: number;
}) {
  const conn = await amqplib.connect(opts.url);
  const ch = await conn.createChannel();
  await ch.assertExchange(opts.exchange, "fanout", { durable: true });
  await ch.assertQueue(opts.dlq, { durable: true });
  await ch.assertQueue(opts.queue, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: opts.dlq,
  });
  await ch.bindQueue(opts.queue, opts.exchange, "");
  if (opts.prefetch) ch.prefetch(opts.prefetch);

  ch.consume(opts.queue, async (msg) => {
    if (!msg) return;
    try {
      const evt = JSON.parse(msg.content.toString());
      await processEvent(evt);
      ch.ack(msg);
    } catch (e) {
      ch.nack(msg, false, false); // dead-letter
    }
  });

  return { conn, ch };
}
