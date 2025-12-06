# NOTIF-001 – Notifications worker skeleton

- Worker: `workers/notifications/worker.ts` com processador de eventos `AppointmentCreated` -> enfileira job `Reminder`.
- Queue: in-memory demo. Em produção, trocar por broker (RabbitMQ/Kafka/SQS) e mover `enqueueNotification` para consumir mensagens do bus.
- Execução: script é stub; configure consumidor real com reconexão/backoff. Agendamento/cron se necessário para disparar reminders.
