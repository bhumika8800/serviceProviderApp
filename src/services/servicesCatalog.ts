import apiClient from './apiClient';
import type { ApiResponse, PaginatedResponse, Category, Service } from '../types';

export function listCategories(parentId?: string | null) {
  return apiClient.get<ApiResponse<Category[]>>('/categories', {
    params: parentId ? { parentId: parentId === 'null' ? 'null' : parentId } : undefined,
  });
}

export interface ListServicesParams {
  q?: string;
  categoryId?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export function listServices(params: ListServicesParams = {}) {
  return apiClient.get<ApiResponse<Service[]> | PaginatedResponse<Service>>('/services', {
    params,
  });
}

export function getService(id: string) {
  return apiClient.get<ApiResponse<Service>>(`/services/${id}`);
}

export function updateService(id: string, data: { isActive?: boolean }) {
  return apiClient.patch<ApiResponse<Service>>(`/services/${id}`, data);
}