import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsApi } from '../../tickets/api/tickets.api';
import type { DashboardDto } from '../../../shared/dtos/ticket.dto';

export function useDashboard() {
  const [data, setData] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await ticketsApi.dashboard();
      setData(result);
    } catch {
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refresh: fetch };
}
