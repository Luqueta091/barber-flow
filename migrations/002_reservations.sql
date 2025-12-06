-- Migration: 002_reservations
-- Descrição: adiciona colunas de janela de reserva e índices para checagem de conflito

ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS end_at   TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
    ADD CONSTRAINT chk_reservation_time CHECK (start_at < end_at);

-- Índice para buscas de conflito/ocupação em janelas
CREATE INDEX IF NOT EXISTS idx_reservations_unit_service_time
    ON reservations (unit_id, service_id, start_at, end_at)
    WHERE status IN ('locked', 'confirmed');
