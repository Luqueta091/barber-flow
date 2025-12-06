# Idempotência e concorrência (SCHED-004)

- Use `idempotencyKey` no payload de `POST /appointments`. Requisições repetidas retornam o mesmo `id/status`.
- `reservationToken` não pode ser reutilizado (confirmação única).
- Constraints recomendadas no DB em `db_constraints/idempotency.md`.

## Testes
- Integrados em `integration_tests/appointments.api.test.ts` (reuso de token falha).
- Futuro: adicionar teste de idempotencyKey persistente após implementação de storage real.
