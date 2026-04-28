import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/tickets.api';
import type { ListTicketsParams, PaginatedTicketsDto, TicketStatus, TicketPriority } from '../../../shared/dtos/ticket.dto';

const DEFAULT_LIMIT = 10;

export function useTickets() {
  const [data, setData] = useState<PaginatedTicketsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ListTicketsParams>({ page: 1, limit: DEFAULT_LIMIT });

  const fetch = useCallback(async (params: ListTicketsParams) => {
    setLoading(true);
    try {
      const result = await ticketsApi.list(params);
      setData(result);
    } catch {
      toast.error('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(filters); }, [filters, fetch]);

  const setStatus = (status: TicketStatus | undefined) =>
    setFilters((f) => ({ ...f, status, page: 1 }));

  const setPriority = (priority: TicketPriority | undefined) =>
    setFilters((f) => ({ ...f, priority, page: 1 }));

  const setPage = (page: number) => setFilters((f) => ({ ...f, page }));

  const refresh = () => fetch(filters);

  return { data, loading, filters, setStatus, setPriority, setPage, refresh };
}
