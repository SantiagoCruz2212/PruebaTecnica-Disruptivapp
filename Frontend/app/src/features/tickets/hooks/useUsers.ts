import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../shared/api/axios';
import type { UserDto } from '../../../shared/dtos/ticket.dto';

export function useUsers() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<UserDto[]>('/users')
      .then((r) => setUsers(r.data))
      .catch(() => toast.error('Error al cargar los usuarios'))
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}
