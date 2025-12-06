# Concurrency test (reservations)

Objetivo: garantir 0 double-bookings para a mesma janela.

## Pré-requisitos
- Aplicar migrations `001_init.sql` e `002_reservations.sql`.
- Inserir unit/service/user de teste com os UUIDs usados no script ou adapte-os.

## Teste manual (psql)
1. Abrir duas sessões psql apontando para o mesmo banco.
2. Em cada uma, rode o bloco de `tests/concurrency/reservation_lock.sql`.
3. A primeira sessão deve obter um token; a segunda deve falhar com `slot_conflict` (exclusão única) devido ao advisory lock + checagem de conflito.

## Como funciona
- `lock_reservation_slot` usa `pg_advisory_xact_lock` por (unit, service, start, end) para serializar tentativas.
- Checa sobreposição com reservas ativas (`locked|confirmed` não expiradas) e appointments `scheduled`.
- Se livre, insere com `status=locked` e TTL (`lock_expires_at`).
- `release_reservation_slot` e `confirm_reservation_slot` atualizam o status.

Para testes automatizados, é possível disparar chamadas concorrentes ao DB usando psql ou um runner (ex: `pgbench` custom script) chamando `lock_reservation_slot` com o mesmo intervalo e garantindo que apenas uma operação retorne sucesso.
