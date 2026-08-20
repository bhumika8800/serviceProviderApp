import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminStats,
  listUsers,
  toggleUserActive,
  listAdminBookings,
  type AdminUsersParams,
} from '../services/adminService';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminUsers(params: AdminUsersParams = {}) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => listUsers(params),
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleUserActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useAdminBookings(status?: string) {
  return useQuery({
    queryKey: ['admin', 'bookings', status],
    queryFn: () => listAdminBookings(status),
  });
}