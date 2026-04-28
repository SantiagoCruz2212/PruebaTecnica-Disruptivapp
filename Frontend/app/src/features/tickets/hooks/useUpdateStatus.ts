import { useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/tickets.api';
import type { UpdateStatusDto } from '../../../shared/dtos/ticket.dto';

export function useUpdateStatus(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (id: string, dto: UpdateStatusDto) => {
    setLoading(true);
    try {
      await ticketsApi.updateStatus(id, dto);
      toast.success('Estado actualizado correctamente');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(msg ?? 'Error al cambiar el estado');
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
}
