import { createContext, useContext } from 'react';
import type { UserDto } from '../dtos/ticket.dto';

// Datos de sesión hardcodeados — reemplazar por auth real cuando esté disponible
export const SESSION_USER: UserDto = {
  id: 'a308c293-aff5-4d17-8fd4-66a303e7c026',
  name: 'Admin Sistema',
  email: 'admin@empresa.com',
  role: 'admin',
};

const SessionContext = createContext<UserDto>(SESSION_USER);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={SESSION_USER}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): UserDto {
  return useContext(SessionContext);
}
