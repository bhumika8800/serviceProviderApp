import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types';

export function useUserRole() {
  const user = useAuthStore((state) => state.user);

  const role: UserRole | null = user?.role ?? null;

  return {
    role,
    isCustomer: role === 'customer',
    isAdmin: role === 'admin',
    isProvider: role === 'provider',
  };
}
