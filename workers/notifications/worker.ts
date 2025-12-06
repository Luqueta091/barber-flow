import { EventEnvelope } from "../../events/publisher.js";

export type NotificationJob = {
  type: "Reminder";
  appointmentId: string;
  userId: string;
  startAt: string;
};

// Simple in-memory queue for demo
const queue: NotificationJob[] = [];

export function enqueueNotification(job: NotificationJob) {
  queue.push(job);
}

export function processEvent(event: EventEnvelope) {
  if (event.type === "AppointmentCreated") {
    const payload: any = event.payload;
    enqueueNotification({
      type: "Reminder",
      appointmentId: payload.appointmentId,
      userId: payload.userId,
      startAt: payload.startAt,
    });
  }
}

export function drainQueue(handler: (job: NotificationJob) => Promise<void> | void) {
  while (queue.length) {
    const job = queue.shift();
    if (job) handler(job);
  }
}

export function queueLength() {
  return queue.length;
}

// Example usage in a real worker process
if (import.meta.url === `file://${process.argv[1]}`) {
  // eslint-disable-next-line no-console
  console.log("Notification worker stub started. Connect to broker/queue here.");
}
