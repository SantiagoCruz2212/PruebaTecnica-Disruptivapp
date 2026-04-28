import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TicketsRepository, PaginatedTickets, DashboardStats } from './tickets.repository';
import { UsersService } from '../users/users.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ListTicketsDto } from './dto/list-tickets.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from '../../shared/enums/ticket-status.enum';
import { TicketAssignedEvent } from '../../shared/events/ticket-assigned.event';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const creator = await this.usersService.findById(dto.createdBy);

    const ticket: Partial<Ticket> = {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      createdBy: creator,
      assignedTo: null,
    };

    if (dto.assignedTo) {
      const assignee = await this.usersService.findById(dto.assignedTo);
      ticket.assignedTo = assignee;
    }

    const saved = await this.ticketsRepository.save(ticket);

    if (saved.assignedTo) {
      this.eventEmitter.emit(
        TicketAssignedEvent.EVENT_NAME,
        new TicketAssignedEvent(
          saved.id,
          saved.title,
          saved.assignedTo.email,
          saved.assignedTo.name,
          creator.id,
        ),
      );
    }

    return saved;
  }

  list(dto: ListTicketsDto): Promise<PaginatedTickets> {
    return this.ticketsRepository.findPaginated({
      status: dto.status,
      priority: dto.priority,
      page: dto.page ?? 1,
      limit: dto.limit ?? 10,
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Ticket> {
    const ticket = await this.findOrFail(id);
    const changer = await this.usersService.findById(dto.changedBy);

    if (ticket.status === TicketStatus.RESOLVED) {
      throw new BadRequestException('No se puede modificar un ticket ya resuelto');
    }

    const oldStatus = ticket.status;
    ticket.status = dto.status;

    const saved = await this.ticketsRepository.save(ticket);

    await this.ticketsRepository.saveHistory({
      ticket: saved,
      changedBy: changer,
      oldStatus,
      newStatus: dto.status,
      oldAssigned: null,
      newAssigned: null,
    });

    return saved;
  }

  async assign(id: string, dto: AssignTicketDto): Promise<Ticket> {
    const ticket = await this.findOrFail(id);
    const changer = await this.usersService.findById(dto.changedBy);
    const assignee = await this.usersService.findById(dto.assignedTo);

    const oldAssigned = ticket.assignedTo?.id ?? null;
    ticket.assignedTo = assignee;

    const saved = await this.ticketsRepository.save(ticket);

    await this.ticketsRepository.saveHistory({
      ticket: saved,
      changedBy: changer,
      oldStatus: null,
      newStatus: null,
      oldAssigned,
      newAssigned: assignee.id,
    });

    this.eventEmitter.emit(
      TicketAssignedEvent.EVENT_NAME,
      new TicketAssignedEvent(
        saved.id,
        saved.title,
        assignee.email,
        assignee.name,
        changer.id,
      ),
    );

    return saved;
  }

  getDashboard(): Promise<DashboardStats> {
    return this.ticketsRepository.getDashboardStats();
  }

  private async findOrFail(id: string): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findById(id);
    if (!ticket) throw new NotFoundException(`Ticket con id ${id} no encontrado`);
    return ticket;
  }
}
