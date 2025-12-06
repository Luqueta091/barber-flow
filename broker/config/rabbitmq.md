# NOTIF-INT-001 – Configuração RabbitMQ (exemplo)

- Exchange: `events.fanout` (fanout ou topic).
- Queue: `notifications.q` bind na exchange.
- DLQ: `notifications.dlq` + policy de reencaminhar para DLQ após N reentregas.
- Conexão: usar credenciais do Secrets Manager (ver INF-001).

Variáveis:
```
RABBITMQ_URL=amqps://user:pass@mq-host:5671
EXCHANGE_NAME=events.fanout
QUEUE_NAME=notifications.q
DLQ_NAME=notifications.dlq
```
