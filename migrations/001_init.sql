-- Migration: 001_init
-- Descrição: Cria esquema inicial para agendamentos (users, units, services, appointments, reservations)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(120) NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    email           VARCHAR(160) UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL,
    timezone        VARCHAR(60) NOT NULL DEFAULT 'UTC',
    address_line    VARCHAR(200),
    city            VARCHAR(80),
    state           VARCHAR(80),
    country         VARCHAR(80),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Serviços oferecidos em uma unidade com duração e buffer padrão
CREATE TABLE IF NOT EXISTS services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name            VARCHAR(120) NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    buffer_after_minutes INTEGER NOT NULL DEFAULT 0 CHECK (buffer_after_minutes >= 0),
    capacity        INTEGER NOT NULL DEFAULT 1 CHECK (capacity > 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agenda base da unidade por dia da semana (pode ser extendida depois)
CREATE TABLE IF NOT EXISTS unit_schedules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    weekday         SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = Sunday
    opens_at        TIME NOT NULL,
    closes_at       TIME NOT NULL,
    UNIQUE (unit_id, weekday)
);

CREATE TYPE appointment_status AS ENUM ('scheduled', 'cancelled', 'completed', 'no_show');

CREATE TABLE IF NOT EXISTS appointments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    start_at        TIMESTAMPTZ NOT NULL,
    end_at          TIMESTAMPTZ NOT NULL,
    status          appointment_status NOT NULL DEFAULT 'scheduled',
    reservation_id  UUID, -- vínculo com reserva (quando houver)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (unit_id, service_id, start_at, end_at)
);

CREATE TYPE reservation_status AS ENUM ('locked', 'confirmed', 'expired', 'released');

CREATE TABLE IF NOT EXISTS reservations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id         UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    service_id      UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    status          reservation_status NOT NULL DEFAULT 'locked',
    lock_expires_at TIMESTAMPTZ NOT NULL,
    reservation_token UUID NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (unit_id, service_id, lock_expires_at, reservation_token)
);

-- Índices auxiliares para consultas de disponibilidade
CREATE INDEX IF NOT EXISTS idx_appointments_unit_time ON appointments (unit_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_reservations_unit_expires ON reservations (unit_id, lock_expires_at);

