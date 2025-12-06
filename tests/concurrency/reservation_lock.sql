-- Teste simples de lock de reserva concorrente
-- Execute em duas sessões psql para o mesmo slot e verifique que apenas uma insere.

BEGIN;
SELECT lock_reservation_slot(
  '00000000-0000-0000-0000-000000000001', -- unit_id
  '00000000-0000-0000-0000-000000000002', -- service_id
  '00000000-0000-0000-0000-000000000003', -- user_id
  NOW() + INTERVAL '1 hour',
  NOW() + INTERVAL '1 hour 30 minutes',
  300
) AS token;
COMMIT;

-- Em outra sessão, rodar o mesmo bloco; deve falhar com 'slot_conflict'.
