# Prueba Técnica Full Stack — Disruptivapp

Módulo de gestión de solicitudes de soporte técnico con backend REST en NestJS, frontend en React y base de datos PostgreSQL.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend | NestJS + TypeORM + TypeScript |
| Base de datos | PostgreSQL 16 (Docker) |
| ORM | TypeORM |
| Validación | class-validator + class-transformer |
| Documentación API | Swagger (@nestjs/swagger) |
| Automatizaciones | @nestjs/event-emitter (patrón Observer) |

---

## Estructura del proyecto

```
.
├── Back/                   # API REST — NestJS
├── DB/                     # Schema SQL + Docker Compose
├── Frontend/
│   ├── app/                # Aplicación React
│   └── Design/             # Mockups HTML de referencia
└── Pruebas/                # Colección Postman
```

---

## Requisitos previos

- Node.js >= 18
- Docker Desktop
- npm >= 9

---

## Levantar el proyecto

### 1. Base de datos

```bash
cd DB
docker compose up -d
```

Crea el contenedor PostgreSQL, ejecuta el schema y carga los datos seed automáticamente.

| Parámetro | Valor |
|---|---|
| Host | `localhost` |
| Puerto | `5432` |
| Base de datos | `soporte_tecnico` |
| Usuario | `soporte_user` |
| Contraseña | `soporte_pass` |

### 2. Backend

```bash
cd Back
npm install
npm run start:dev
```

Disponible en `http://localhost:3000`

### 3. Frontend

```bash
cd Frontend/app
npm install
npm run dev
```

Disponible en `http://localhost:5173`

---

## Usuarios seed

| Nombre | Email | Rol | UUID |
|---|---|---|---|
| Admin Sistema | admin@empresa.com | admin | `a308c293-aff5-4d17-8fd4-66a303e7c026` |
| Ana García | ana@empresa.com | agent | `fab94932-9522-4317-8747-7ee26734d0bf` |
| Carlos Méndez | carlos@empresa.com | agent | `e364233d-d3a7-4fbf-92c3-f7e1c3c89df7` |
| Laura Ruiz | laura@empresa.com | requester | `618e8400-d2d3-428d-9c52-ee45c12ea93d` |

> La sesión activa está hardcodeada como **Admin Sistema** en `Frontend/app/src/shared/context/SessionContext.tsx`.

---

## API — Endpoints

**Base URL:** `http://localhost:3000`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/users` | Listar usuarios |
| `POST` | `/tickets` | Crear solicitud |
| `GET` | `/tickets` | Listar con paginación y filtros |
| `GET` | `/tickets/dashboard` | Métricas: total, por estado, por prioridad |
| `PATCH` | `/tickets/:id/status` | Cambiar estado (valida que no esté resuelto) |
| `PATCH` | `/tickets/:id/assign` | Asignar responsable (dispara email automático) |

**Documentación interactiva (Swagger):** `http://localhost:3000/api/docs`

---

## Arquitectura

### Backend — N-Tier + patrones

```
HTTP Request
    │
    ▼
Controller          ← recibe y valida DTOs
    │
    ▼
Service             ← lógica de negocio
    │
    ▼
Repository          ← acceso a datos (TypeORM)
    │
    ▼
PostgreSQL
```

**Patrones aplicados:**

- **DTO** — validación y transferencia de datos en todos los endpoints
- **Observer** — automatizaciones desacopladas mediante eventos

### Automatización de email (Observer)

Cuando se asigna un responsable a un ticket, el servicio **no llama directamente** al email. En su lugar emite un evento:

```
TicketsService.assign()
    │
    └── eventEmitter.emit('ticket.assigned', event)   ← responde HTTP aquí
                                                         sin esperar al listener
         [asíncrono]
         │
         ▼
    SendEmailListener                 ← @OnEvent({ async: true })
         │
         ▼
    EmailService.execute()            ← mock / reemplazable por SES, SendGrid
         │
         ▼
    automation_logs (DB)              ← registra resultado (sent / failed)
```

Para agregar nuevas automatizaciones (Slack, SMS, webhook) basta con crear un nuevo listener. No se modifica ningún código existente.

### Frontend — Feature-Based + Container/Presenter

```
src/
├── shared/
│   ├── api/          ← instancia Axios base
│   ├── dtos/         ← tipos TypeScript de todos los recursos
│   ├── context/      ← SessionContext (sesión global)
│   └── components/   ← Layout, Modal (reutilizables)
└── features/
    ├── tickets/
    │   ├── api/          ← llamadas HTTP tipadas
    │   ├── hooks/        ← useTickets, useCreateTicket, useUpdateStatus,
    │   │                    useAssignTicket, useUsers
    │   ├── components/   ← Presenter: TicketsTable, TicketRow, badges, modales
    │   ├── containers/   ← Container: lógica + estado, sin JSX de UI
    │   └── pages/
    └── dashboard/
        ├── hooks/        ← useDashboard
        ├── components/   ← MetricCard, StatusChart, PriorityChart
        ├── containers/
        └── pages/
```

**Separación Container/Presenter:**
- Los **containers** consumen hooks, gestionan estado y pasan props
- Los **presenters** solo renderizan — no hacen fetch ni tienen efectos de API

---

## Modelo de base de datos

```
users ──────────────────────────────────┐
  │ (created_by)                        │
  │ N                                   │
  ▼                                     │
tickets ──── ticket_history             │
  │                                     │
  └──── automation_logs ────────────────┘
                          (triggered_by)
```

| Tabla | Rol |
|---|---|
| `users` | Creadores y responsables |
| `tickets` | Solicitudes de soporte |
| `ticket_history` | Auditoría inmutable de cambios |
| `automation_logs` | Registro de automatizaciones ejecutadas |

Ver documentación completa en [`DB/modelo.md`](DB/modelo.md).

---

## Colección Postman

Importar `Pruebas/soporte-tecnico.postman_collection.json` en Postman.

Incluye 15 requests con tests automatizados para todos los endpoints, incluyendo casos de error (400, 404). El `ticketId` se guarda automáticamente como variable de colección al crear el primer ticket.

---

## Vistas del frontend

| Ruta | Vista |
|---|---|
| `/` | Dashboard — métricas, barras de estado, donut de prioridad |
| `/tickets` | Request List — tabla paginada, filtros, modales de acción |

El botón **Create New** del sidebar abre el popup de creación con dropdown de usuarios cargado desde la API.
