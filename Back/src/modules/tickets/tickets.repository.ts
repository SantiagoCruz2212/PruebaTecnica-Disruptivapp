import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketHistory } from './entities/ticket-history.entity';
import { TicketStatus } from '../../shared/enums/ticket-status.enum';
import { TicketPriority } from '../../shared/enums/ticket-priority.enum';

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  page: number;
  limit: number;
}

export interface PaginatedTickets {
  data: Ticket[];
  total: number;
  page: number;
  lastPage: number;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

@Injectable()
export class TicketsRepository {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    @InjectRepository(TicketHistory)
    private readonly historyRepo: Repository<TicketHistory>,
  ) {}

  async findPaginated(filters: TicketFilters): Promise<PaginatedTickets> {
    const { status, priority, page, limit } = filters;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.createdBy', 'creator')
      .leftJoinAndSelect('ticket.assignedTo', 'assignee')
      .orderBy('ticket.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) qb.andWhere('ticket.status = :status', { status });
    if (priority) qb.andWhere('ticket.priority = :priority', { priority });

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findById(id: string): Promise<Ticket | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  save(ticket: Partial<Ticket>): Promise<Ticket> {
    return this.repo.save(ticket);
  }

  saveHistory(history: Partial<TicketHistory>): Promise<TicketHistory> {
    return this.historyRepo.save(history);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const total = await this.repo.count();

    const statusRows = await this.repo
      .createQueryBuilder('t')
      .select('t.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.status')
      .getRawMany<{ status: string; count: string }>();

    const priorityRows = await this.repo
      .createQueryBuilder('t')
      .select('t.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.priority')
      .getRawMany<{ priority: string; count: string }>();

    const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.count)]));
    const byPriority = Object.fromEntries(priorityRows.map((r) => [r.priority, Number(r.count)]));

    return { total, byStatus, byPriority };
  }
}
