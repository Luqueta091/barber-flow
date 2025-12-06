-- Counter implementation for capacity (DB-backed)
-- Tabela para controlar consumo de capacidade por janela (unit, service, window_start, window_end)

CREATE TABLE IF NOT EXISTS slot_counters (
    unit_id       UUID NOT NULL,
    service_id    UUID NOT NULL,
    window_start  TIMESTAMPTZ NOT NULL,
    window_end    TIMESTAMPTZ NOT NULL,
    capacity      INTEGER NOT NULL CHECK (capacity > 0),
    used          INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (unit_id, service_id, window_start, window_end)
);

-- Garante que não se ultrapasse a capacidade; retorna TRUE se incrementou, FALSE se bloquear.
CREATE OR REPLACE FUNCTION increment_slot_counter(
    p_unit_id UUID,
    p_service_id UUID,
    p_window_start TIMESTAMPTZ,
    p_window_end TIMESTAMPTZ,
    p_capacity INTEGER,
    p_delta INTEGER DEFAULT 1
) RETURNS BOOLEAN AS $$
DECLARE
    v_ok BOOLEAN;
BEGIN
    IF p_delta <= 0 THEN
        RAISE EXCEPTION 'delta must be positive';
    END IF;

    INSERT INTO slot_counters (unit_id, service_id, window_start, window_end, capacity, used)
    VALUES (p_unit_id, p_service_id, p_window_start, p_window_end, p_capacity, p_delta)
    ON CONFLICT (unit_id, service_id, window_start, window_end)
    DO UPDATE
      SET used = slot_counters.used + p_delta,
          capacity = GREATEST(slot_counters.capacity, EXCLUDED.capacity),
          updated_at = NOW()
      WHERE slot_counters.used + p_delta <= GREATEST(slot_counters.capacity, EXCLUDED.capacity)
    RETURNING TRUE INTO v_ok;

    RETURN COALESCE(v_ok, FALSE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_slot_counter(
    p_unit_id UUID,
    p_service_id UUID,
    p_window_start TIMESTAMPTZ,
    p_window_end TIMESTAMPTZ,
    p_delta INTEGER DEFAULT 1
) RETURNS VOID AS $$
BEGIN
    UPDATE slot_counters
    SET used = GREATEST(0, used - p_delta),
        updated_at = NOW()
    WHERE unit_id = p_unit_id
      AND service_id = p_service_id
      AND window_start = p_window_start
      AND window_end = p_window_end;
END;
$$ LANGUAGE plpgsql;
