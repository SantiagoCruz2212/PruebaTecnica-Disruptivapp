# Modelo de Base de Datos — Soporte Técnico

## Diagrama Entidad-Relación (texto)

```
┌──────────────────────────────────────┐
│                users                 │
├──────────────────────────────────────┤
│ id           UUID  PK                │
│ name         VARCHAR(100) NOT NULL   │
│ email        VARCHAR(150) NOT NULL   │◄──────────────────────────┐
│ role         user_role (enum)        │                           │
│ created_at   TIMESTAMPTZ             │                           │
│ updated_at   TIMESTAMPTZ             │                           │
└──────────────────────────────────────┘                           │
          │ 1                                                       │
          │                                                         │
          │ N (created_by)     N (assigned_to)                      │
          ▼                                                         │
┌──────────────────────────────────────┐                           │
│               tickets                │                           │
├──────────────────────────────────────┤                           │
│ id           UUID  PK                │                           │
│ title        VARCHAR(200) NOT NULL   │                           │
│ description  TEXT                    │                           │
│ status       ticket_status (enum)    │                           │
│ priority     ticket_priority (enum)  │                           │
│ created_by   UUID  FK → users.id     │                           │
│ assigned_to  UUID  FK → users.id     │ (nullable)                │
│ created_at   TIMESTAMPTZ NOT NULL    │                           │
│ updated_at   TIMESTAMPTZ NOT NULL    │                           │
└──────────────────────────────────────┘                           │
          │ 1                     │ 1                              │
          │                       │                                │
          │ N                     │ N                              │
          ▼                       ▼                                │
┌────────────────────┐  ┌──────────────────────────────────────┐  │
│  ticket_history    │  │         automation_logs               │  │
├────────────────────┤  ├──────────────────────────────────────┤  │
│ id        UUID PK  │  │ id            UUID  PK                │  │
│ ticket_id UUID FK  │  │ ticket_id     UUID  FK → tickets.id   │  │
│ changed_by UUID FK │──┘│ trigger_type  VARCHAR(100)           │  │
│ old_status enum    │   │ action_type   VARCHAR(100)           │  │
│ new_status enum    │   │ payload       JSONB                  │  │
│ old_assigned UUID  │   │ status        automation_status(enum)│  │
│ new_assigned UUID  │   │ error_message TEXT                   │  │
│ changed_at TSTZ    │   │ created_at    TIMESTAMPTZ            │  │
└────────────────────┘   │ processed_at  TIMESTAMPTZ            │  │
                         │ triggered_by  UUID  FK → users.id    │──┘
                         └──────────────────────────────────────┘
```

---

## Entidades

### `users`

Representa a cualquier usuario del sistema, ya sea quien crea solicitudes o quien las atiende.

| Columna      | Tipo              | Restricciones                  | Descripción                        |
|--------------|-------------------|--------------------------------|------------------------------------|
| `id`         | UUID              | PK, DEFAULT gen_random_uuid()  | Identificador único                |
| `name`       | VARCHAR(100)      | NOT NULL                       | Nombre completo                    |
| `email`      | VARCHAR(150)      | NOT NULL, UNIQUE               | Correo electrónico (destino de notificaciones) |
| `role`       | `user_role` enum  | NOT NULL, DEFAULT 'agent'      | Rol dentro del sistema             |
| `created_at` | TIMESTAMPTZ       | NOT NULL, DEFAULT now()        | Fecha de registro                  |
| `updated_at` | TIMESTAMPTZ       | NOT NULL, DEFAULT now()        | Última actualización               |

**Enum `user_role`:** `admin`, `agent`, `requester`

---

### `tickets`

Entidad central. Representa una solicitud de soporte técnico.

| Columna        | Tipo                   | Restricciones                 | Descripción                              |
|----------------|------------------------|-------------------------------|------------------------------------------|
| `id`           | UUID                   | PK, DEFAULT gen_random_uuid() | Identificador único                      |
| `title`        | VARCHAR(200)           | NOT NULL                      | Título corto de la solicitud             |
| `description`  | TEXT                   | NOT NULL                      | Descripción detallada del problema       |
| `status`       | `ticket_status` enum   | NOT NULL, DEFAULT 'pending'   | Estado actual del ticket                 |
| `priority`     | `ticket_priority` enum | NOT NULL, DEFAULT 'medium'    | Prioridad de atención                    |
| `created_by`   | UUID                   | FK → users.id, NOT NULL       | Usuario que creó la solicitud            |
| `assigned_to`  | UUID                   | FK → users.id, NULLABLE       | Responsable asignado (puede estar vacío) |
| `created_at`   | TIMESTAMPTZ            | NOT NULL, DEFAULT now()       | Fecha de creación                        |
| `updated_at`   | TIMESTAMPTZ            | NOT NULL, DEFAULT now()       | Última modificación                      |

**Enum `ticket_status`:** `pending`, `in_progress`, `resolved`

**Enum `ticket_priority`:** `low`, `medium`, `high`

> **Decisión de diseño:** `assigned_to` es nullable intencionalmente. Un ticket recién creado puede no tener responsable hasta que se asigne posteriormente.

---

### `ticket_history`

Registro de auditoría inmutable de cada cambio de estado o reasignación. Permite trazabilidad completa sin modificar el ticket.

| Columna        | Tipo                   | Restricciones                 | Descripción                              |
|----------------|------------------------|-------------------------------|------------------------------------------|
| `id`           | UUID                   | PK, DEFAULT gen_random_uuid() | Identificador único del registro         |
| `ticket_id`    | UUID                   | FK → tickets.id, NOT NULL     | Ticket al que pertenece el cambio        |
| `changed_by`   | UUID                   | FK → users.id, NOT NULL       | Usuario que realizó el cambio            |
| `old_status`   | `ticket_status` enum   | NULLABLE                      | Estado anterior (null si es creación)    |
| `new_status`   | `ticket_status` enum   | NULLABLE                      | Nuevo estado                             |
| `old_assigned` | UUID                   | NULLABLE                      | Responsable anterior                     |
| `new_assigned` | UUID                   | NULLABLE                      | Nuevo responsable asignado               |
| `changed_at`   | TIMESTAMPTZ            | NOT NULL, DEFAULT now()       | Momento exacto del cambio                |

---

### `automation_logs`

Almacena cada ejecución de automatización (envío de correo u otras acciones futuras). Está desacoplada del flujo principal del ticket.

| Columna         | Tipo                      | Restricciones                 | Descripción                                       |
|-----------------|---------------------------|-------------------------------|---------------------------------------------------|
| `id`            | UUID                      | PK, DEFAULT gen_random_uuid() | Identificador único                               |
| `ticket_id`     | UUID                      | FK → tickets.id, NOT NULL     | Ticket que disparó la automatización              |
| `trigger_type`  | VARCHAR(100)              | NOT NULL                      | Evento disparador (`ticket_assigned`, `status_changed`, etc.) |
| `action_type`   | VARCHAR(100)              | NOT NULL                      | Acción ejecutada (`send_email`, `send_slack`, etc.) |
| `payload`       | JSONB                     | NOT NULL                      | Datos enviados a la acción (destinatario, asunto, cuerpo) |
| `status`        | `automation_status` enum  | NOT NULL, DEFAULT 'pending'   | Estado de la ejecución                            |
| `error_message` | TEXT                      | NULLABLE                      | Detalle del error si `status = 'failed'`          |
| `triggered_by`  | UUID                      | FK → users.id, NOT NULL       | Usuario cuya acción disparó la automatización     |
| `created_at`    | TIMESTAMPTZ               | NOT NULL, DEFAULT now()       | Cuándo se encoló la automatización                |
| `processed_at`  | TIMESTAMPTZ               | NULLABLE                      | Cuándo se procesó                                 |

**Enum `automation_status`:** `pending`, `sent`, `failed`

> **Decisión de diseño:** `trigger_type` y `action_type` son `VARCHAR` en lugar de enums para facilitar agregar nuevas automatizaciones sin migraciones de schema. El `payload` en JSONB permite que cada acción tenga su propia estructura de datos.

---

## Índices

```sql
-- Consultas frecuentes: filtrar tickets por estado y prioridad
CREATE INDEX idx_tickets_status     ON tickets(status);
CREATE INDEX idx_tickets_priority   ON tickets(priority);
CREATE INDEX idx_tickets_assigned   ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);

-- Historial por ticket
CREATE INDEX idx_history_ticket_id  ON ticket_history(ticket_id);

-- Automatizaciones pendientes (para un worker que las procese)
CREATE INDEX idx_automation_status  ON automation_logs(status) WHERE status = 'pending';
CREATE INDEX idx_automation_ticket  ON automation_logs(ticket_id);
```

---

## Relaciones

| Desde          | Campo          | Hacia     | Tipo         | Cardinalidad |
|----------------|----------------|-----------|--------------|--------------|
| `tickets`      | `created_by`   | `users`   | FK           | N:1          |
| `tickets`      | `assigned_to`  | `users`   | FK (nullable)| N:0..1       |
| `ticket_history` | `ticket_id`  | `tickets` | FK           | N:1          |
| `ticket_history` | `changed_by` | `users`   | FK           | N:1          |
| `automation_logs` | `ticket_id` | `tickets` | FK          | N:1          |
| `automation_logs` | `triggered_by` | `users` | FK         | N:1          |

---

## Consideraciones de escalabilidad

- **UUIDs como PK** en lugar de seriales enteros: evita colisiones en arquitecturas distribuidas o multi-tenant.
- **`ticket_history` inmutable**: nunca se actualiza, solo se inserta. Permite auditoría completa y reconstruir el estado en cualquier punto del tiempo.
- **`automation_logs` desacoplada**: el servicio de automatización consume esta tabla de forma asíncrona. Si se quiere mayor throughput, puede reemplazarse por una cola (SQS, RabbitMQ) sin cambiar el modelo de tickets.
- **JSONB en `payload`**: permite que futuras automatizaciones (Slack, SMS, webhooks) tengan su propio schema de datos sin alterar la tabla.
- **Índice parcial en `automation_logs(status = 'pending')`**: mantiene eficiente la consulta del worker que procesa automatizaciones pendientes, sin que crezca con los registros históricos.
