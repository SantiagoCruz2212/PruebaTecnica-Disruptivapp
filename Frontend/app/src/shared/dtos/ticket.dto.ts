export type TicketStatus = 'pending' | 'in_progress' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TicketDto {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: UserDto;
  assignedTo: UserDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTicketsDto {
  data: TicketDto[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  createdBy: string;
  assignedTo?: string;
}

export interface UpdateStatusDto {
  status: TicketStatus;
  changedBy: string;
}

export interface AssignTicketDto {
  assignedTo: string;
  changedBy: string;
}

export interface DashboardDto {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
}

export interface ListTicketsParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  page?: number;
  limit?: number;
}
