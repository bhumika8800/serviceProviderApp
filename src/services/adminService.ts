import apiClient from './apiClient';
import type { ApiResponse, AdminStats, User } from '../types';

export interface AdminUsersParams {
  role?: 'customer' | 'provider' | 'admin';
  q?: string;
  page?: number;
  limit?: number;
}

export type AdminUserListResponse = ApiResponse<User[]> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function getAdminStats() {
  return apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
}

export function listUsers(params: AdminUsersParams) {
  return apiClient.get<AdminUserListResponse>('/admin/users', { params });
}

export function toggleUserActive(id: string, isActive: boolean) {
  return apiClient.patch<ApiResponse<{ user: User }>>(`/admin/users/${id}/active`, { isActive });
}

export function listAdminBookings(status?: string) {
  return apiClient.get<AdminUserListResponse>('/admin/bookings', {
    params: status ? { status } : undefined,
  });
}