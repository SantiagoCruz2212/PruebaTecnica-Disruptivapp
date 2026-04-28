-- ============================================================
-- Módulo de Soporte Técnico — Schema PostgreSQL
-- ============================================================

-- Extensión para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMs
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'agent', 'requester');

CREATE TYPE ticket_status AS ENUM ('pending', 'in_progress', 'resolved');

CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');

CREATE TYPE automation_status AS ENUM ('pending', 'sent', 'failed');

-- ============================================================
-- TABLA: users
-- ============================================================

CREATE TABLE users (
    id          UUID         NOT NULL DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    role        user_role    NOT NULL DEFAULT 'agent',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- ============================================================
-- TABLA: tickets
-- ============================================================

CREATE TABLE tickets (
    id           UUID              NOT NULL DEFAULT gen_random_uuid(),
    title        VARCHAR(200)      NOT NULL,
    description  TEXT              NOT NULL,
    status       ticket_status     NOT NULL DEFAULT 'pending',
    priority     ticket_priority   NOT NULL DEFAULT 'medium',
    created_by   UUID              NOT NULL,
    assigned_to  UUID,
    created_at   TIMESTAMPTZ       NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ       NOT NULL DEFAULT now(),

    CONSTRAINT pk_tickets        PRIMARY KEY (id),
    CONSTRAINT fk_tickets_creator  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tickets_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tickets_status      ON tickets(status);
CREATE INDEX idx_tickets_priority    ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_by  ON tickets(created_by);

-- ============================================================
-- TABLA: ticket_history
-- (registro inmutable de cambios — nunca se actualiza)
-- ============================================================

CREATE TABLE ticket_history (
    id            UUID           NOT NULL DEFAULT gen_random_uuid(),
    ticket_id     UUID           NOT NULL,
    changed_by    UUID           NOT NULL,
    old_status    ticket_status,
    new_status    ticket_status,
    old_assigned  UUID,
    new_assigned  UUID,
    changed_at    TIMESTAMPTZ    NOT NULL DEFAULT now(),

    CONSTRAINT pk_ticket_history         PRIMARY KEY (id),
    CONSTRAINT fk_history_ticket         FOREIGN KEY (ticket_id)  REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_changed_by     FOREIGN KEY (changed_by) REFERENCES users(id)   ON DELETE RESTRICT
);

CREATE INDEX idx_history_ticket_id ON ticket_history(ticket_id);

-- ============================================================
-- TABLA: automation_logs
-- (registro de automatizaciones disparadas — desacoplado)
-- ============================================================

CREATE TABLE automation_logs (
    id             UUID               NOT NULL DEFAULT gen_random_uuid(),
    ticket_id      UUID               NOT NULL,
    trigger_type   VARCHAR(100)       NOT NULL,
    action_type    VARCHAR(100)       NOT NULL,
    payload        JSONB              NOT NULL DEFAULT '{}',
    status         automation_status  NOT NULL DEFAULT 'pending',
    error_message  TEXT,
    triggered_by   UUID               NOT NULL,
    created_at     TIMESTAMPTZ        NOT NULL DEFAULT now(),
    processed_at   TIMESTAMPTZ,

    CONSTRAINT pk_automation_logs     PRIMARY KEY (id),
    CONSTRAINT fk_automation_ticket   FOREIGN KEY (ticket_id)    REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_automation_trigger  FOREIGN KEY (triggered_by) REFERENCES users(id)   ON DELETE RESTRICT
);

CREATE INDEX idx_automation_ticket ON automation_logs(ticket_id);
-- Índice parcial: el worker solo consulta los pendientes
CREATE INDEX idx_automation_pending ON automation_logs(status) WHERE status = 'pending';

-- ============================================================
-- FUNCIÓN: actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- DATOS SEMILLA (seed)
-- ============================================================

INSERT INTO users (id, name, email, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Admin Sistema',    'admin@empresa.com',   'admin'),
    ('a0000000-0000-0000-0000-000000000002', 'Ana García',       'ana@empresa.com',     'agent'),
    ('a0000000-0000-0000-0000-000000000003', 'Carlos Méndez',    'carlos@empresa.com',  'agent'),
    ('a0000000-0000-0000-0000-000000000004', 'Laura Ruiz',       'laura@empresa.com',   'requester');

INSERT INTO tickets (title, description, status, priority, created_by, assigned_to) VALUES
    (
        'Error al iniciar sesión en el portal',
        'Los usuarios no pueden autenticarse desde las 8am. El sistema devuelve error 401.',
        'in_progress', 'high',
        'a0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000002'
    ),
    (
        'Lentitud en módulo de reportes',
        'La generación de reportes tarda más de 5 minutos cuando antes tardaba segundos.',
        'pending', 'medium',
        'a0000000-0000-0000-0000-000000000004',
        NULL
    ),
    (
        'Actualizar certificado SSL',
        'El certificado vence en 10 días. Requiere renovación antes del vencimiento.',
        'resolved', 'low',
        'a0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000003'
    );
