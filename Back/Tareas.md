Tareas principales:
- Levanta un backend en node nestjs utilizando una arquitectura en capas (N-tier), separando las cpaas de controladores, servicios y la de acceso de datos.
- vamos a utilizar princiupalmente 2 patrones de diseño (DTO) y (Observador)
- implementaremos el patron observador principalmente en el modulo desacoplado donde se utilizaran/lanzaran las automatizacion
- implementaremos el patron DTO, en el resto del proyecto para la validacion y transferencia de los datos.


Lista de endpoints:
- Creacion de Solicitudes
- Listar Solicitudes (Implementando paginacion).
- Cambio de estado de un Solicitudes (Con validacion de que este no este cerrado).
- Cambio/Actualizacion de asignacion de la Solicitud (Tiene que validar que el usuario a asignarse exista)
- Un endpoint donde nos de informacion sobre (Total de solicitudes, Cantidad por estado, Cantidad por prioridad)


## Nueva Tarea
Implementa la funcionalidad de Automatización de envío de correo cuando un ticket es asignado a un responsable.

REQUISITO CRÍTICO: La automatización debe estar totalmente desacoplada del flujo principal siguiendo un patrón Event-Driven.
Instala y configura @nestjs/event-emitter

Crea un AssignTicketDto que valide el ticketId y el userId del responsable.

En el método de asignación, tras actualizar con éxito en PostgreSQL vía TypeORM , emite un evento interno llamado ticket.assigned que contenga la información necesaria.

Crea un nuevo módulo Notifications con un Listener que use el decorador @OnEvent('ticket.assigned').

El listener no debe usar un provider real. Debe realizar un Log Estructurado (usando un Logger de NestJS) que simule el envío con el formato: [EmailService] Sending email to {email} regarding ticket {title}...