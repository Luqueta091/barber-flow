# RUNBOOK-001 – Incident Response Playbooks

## Deadlock/erro em DB
- Sintoma: latência /bff/book alta, erros 500.
- Ações:
  1. Checar conexões ativas e locks (`pg_locks`).
  2. Reiniciar job ofensivo ou aplicar índice ausente.
  3. Se necessário, cortar tráfego (scale to 0) e aplicar fix/migration.

## Backlog no broker/notifications
- Sintoma: fila `notifications.q` crescendo, DLQ aumentando.
- Ações:
  1. Aumentar consumidores e verificar credenciais do provider.
  2. Checar DLQ e reprocessar após corrigir causa.
  3. Ajustar backoff/retries.

## Conflitos 409 acima do normal
- Sintoma: erro 409 em booking > SLO.
- Ações:
  1. Verificar carga (load tests) e cache hit rate.
  2. Revisar window size/buffer do slot generator.
  3. Expandir capacidade ou escalonar atendimento.

## Worker parado
- Sintoma: jobs não processados, DLQ crescendo.
- Ações:
  1. Verificar liveness do pod/VM.
  2. Recriar/rollout do worker.
  3. Alertar on-call se não normalizar em 5m.
