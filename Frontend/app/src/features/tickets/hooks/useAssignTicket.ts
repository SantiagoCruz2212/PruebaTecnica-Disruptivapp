import { useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/tickets.api';
import type { AssignTicketDto } from '../../../shared/dtos/ticket.dto';

export function useAssignTicket(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const assign = async (id: string, dto: AssignTicketDto) => {
    setLoading(true);
    try {
      await ticketsApi.assign(id, dto);
      toast.success('Responsable asignado. Se enviará notificación por email.');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(msg ?? 'Error al asignar el responsable');
    } finally {
      setLoading(false);
    }
  };

  return { assign, loading };
}
