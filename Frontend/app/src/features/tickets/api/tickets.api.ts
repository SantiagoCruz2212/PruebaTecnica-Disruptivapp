import api from '../../../shared/api/axios';
import type {
  AssignTicketDto,
  CreateTicketDto,
  DashboardDto,
  ListTicketsParams,
  PaginatedTicketsDto,
  TicketDto,
  UpdateStatusDto,
} from '../../../shared/dtos/ticket.dto';

export const ticketsApi = {
  list: (params: ListTicketsParams) =>
    api.get<PaginatedTicketsDto>('/tickets', { params }).then((r) => r.data),

  create: (dto: CreateTicketDto) =>
    api.post<TicketDto>('/tickets', dto).then((r) => r.data),

  updateStatus: (id: string, dto: UpdateStatusDto) =>
    api.patch<TicketDto>(`/tickets/${id}/status`, dto).then((r) => r.data),

  assign: (id: string, dto: AssignTicketDto) =>
    api.patch<TicketDto>(`/tickets/${id}/assign`, dto).then((r) => r.data),

  dashboard: () =>
    api.get<DashboardDto>('/tickets/dashboard').then((r) => r.data),
};
