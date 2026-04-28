import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ListTicketsDto } from './dto/list-tickets.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { TicketStatus } from '../../shared/enums/ticket-status.enum';
import { TicketPriority } from '../../shared/enums/ticket-priority.enum';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de soporte' })
  @ApiCreatedResponse({ description: 'Ticket creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o usuario no encontrado' })
  @ApiBody({ type: CreateTicketDto })
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes con paginación y filtros opcionales' })
  @ApiOkResponse({
    description: 'Lista paginada de tickets',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            title: 'Error al iniciar sesión',
            description: 'Los usuarios no pueden autenticarse.',
            status: TicketStatus.IN_PROGRESS,
            priority: TicketPriority.HIGH,
            createdAt: '2026-04-28T10:00:00Z',
            updatedAt: '2026-04-28T11:00:00Z',
            createdBy: { id: 'uuid', name: 'Laura Ruiz', email: 'laura@empresa.com' },
            assignedTo: { id: 'uuid', name: 'Ana García', email: 'ana@empresa.com' },
          },
        ],
        total: 1,
        page: 1,
        lastPage: 1,
      },
    },
  })
  @ApiQuery({ name: 'status', enum: TicketStatus, required: false })
  @ApiQuery({ name: 'priority', enum: TicketPriority, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  list(@Query() dto: ListTicketsDto) {
    return this.ticketsService.list(dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Métricas del sistema: total, cantidad por estado y por prioridad' })
  @ApiOkResponse({
    description: 'Resumen estadístico de tickets',
    schema: {
      example: {
        total: 10,
        byStatus: { pending: 4, in_progress: 4, resolved: 2 },
        byPriority: { low: 2, medium: 5, high: 3 },
      },
    },
  })
  dashboard() {
    return this.ticketsService.getDashboard();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar el estado de una solicitud' })
  @ApiParam({ name: 'id', description: 'UUID del ticket', example: 'a1b2c3d4-...' })
  @ApiBody({ type: UpdateStatusDto })
  @ApiOkResponse({ description: 'Estado actualizado exitosamente' })
  @ApiBadRequestResponse({ description: 'El ticket ya está resuelto y no puede modificarse' })
  @ApiNotFoundResponse({ description: 'Ticket o usuario no encontrado' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.ticketsService.updateStatus(id, dto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Asignar un responsable a una solicitud (dispara notificación por email)' })
  @ApiParam({ name: 'id', description: 'UUID del ticket', example: 'a1b2c3d4-...' })
  @ApiBody({ type: AssignTicketDto })
  @ApiOkResponse({ description: 'Responsable asignado exitosamente. Se envía email de notificación de forma asíncrona.' })
  @ApiNotFoundResponse({ description: 'Ticket o usuario no encontrado' })
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTicketDto,
  ) {
    return this.ticketsService.assign(id, dto);
  }
}
