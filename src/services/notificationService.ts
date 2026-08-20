import apiClient from './apiClient';
import type { ApiResponse, Notification } from '../types';

export interface NotificationsPayload {
  notifications: Notification[];
  unreadCount: number;
}

export type NotificationsResponse = ApiResponse<NotificationsPayload> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function listNotifications(page = 1, limit = 20) {
  return apiClient.get<NotificationsResponse>('/notifications', {
    params: { page, limit },
  });
}

export function markRead(id: string) {
  return apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
}

export function markAllRead() {
  return apiClient.patch<ApiResponse<{ updated: boolean }>>('/notifications/read-all');
}