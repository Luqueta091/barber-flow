-- Reservation locking helpers
-- Usa advisory lock por (unit_id, service_id, start_at, end_at) para evitar double booking

CREATE OR REPLACE FUNCTION lock_reservation_slot(
    p_unit_id UUID,
    p_service_id UUID,
    p_user_id UUID,
    p_start_at TIMESTAMPTZ,
    p_end_at TIMESTAMPTZ,
    p_ttl_seconds INTEGER DEFAULT 300
) RETURNS UUID AS $$
DECLARE
    v_token UUID := gen_random_uuid();
    v_expires TIMESTAMPTZ := NOW() + make_interval(secs => p_ttl_seconds);
    v_lock_key BIGINT;
BEGIN
    IF p_start_at >= p_end_at THEN
        RAISE EXCEPTION 'start_at must be before end_at';
    END IF;

    -- advisory lock por slot; serializa tentativas concorrentes do mesmo slot
    v_lock_key := hashtextextended(p_unit_id::text || p_service_id::text || p_start_at::text || p_end_at::text, 0);
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- verifica conflito com reservas ativas (locked/confirmed) não expiradas
    IF EXISTS (
        SELECT 1
        FROM reservations r
        WHERE r.unit_id = p_unit_id
          AND r.service_id = p_service_id
          AND r.status IN ('locked', 'confirmed')
          AND r.lock_expires_at > NOW()
          AND tstzrange(r.start_at, r.end_at, '[)') && tstzrange(p_start_at, p_end_at, '[)')
    ) THEN
        RAISE EXCEPTION 'slot_conflict' USING ERRCODE = 'unique_violation';
    END IF;

    -- verifica conflito com appointments confirmados
    IF EXISTS (
        SELECT 1
        FROM appointments a
        WHERE a.unit_id = p_unit_id
          AND a.service_id = p_service_id
          AND a.status = 'scheduled'
          AND tstzrange(a.start_at, a.end_at, '[)') && tstzrange(p_start_at, p_end_at, '[)')
    ) THEN
        RAISE EXCEPTION 'slot_conflict' USING ERRCODE = 'unique_violation';
    END IF;

    INSERT INTO reservations (unit_id, service_id, user_id, status, lock_expires_at, reservation_token, start_at, end_at)
    VALUES (p_unit_id, p_service_id, p_user_id, 'locked', v_expires, v_token, p_start_at, p_end_at);

    RETURN v_token;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION release_reservation_slot(p_token UUID) RETURNS VOID AS $$
BEGIN
    UPDATE reservations
    SET status = 'released',
        updated_at = NOW()
    WHERE reservation_token = p_token;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION confirm_reservation_slot(p_token UUID) RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    UPDATE reservations
    SET status = 'confirmed',
        updated_at = NOW()
    WHERE reservation_token = p_token
      AND lock_expires_at > NOW()
    RETURNING id INTO v_id;

    IF v_id IS NULL THEN
        RAISE EXCEPTION 'invalid_or_expired_token' USING ERRCODE = 'invalid_parameter_value';
    END IF;

    RETURN v_id;
END;
$$ LANGUAGE plpgsql;
