import { useState } from 'react';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/tickets.api';
import type { CreateTicketDto } from '../../../shared/dtos/ticket.dto';

export function useCreateTicket(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const create = async (dto: CreateTicketDto) => {
    setLoading(true);
    try {
      await ticketsApi.create(dto);
      toast.success('Solicitud creada exitosamente');
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
