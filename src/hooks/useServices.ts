import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Service, Category, ApiResponse } from '../types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<ApiResponse<Category[]>>('/categories'),
    staleTime: 10 * 60 * 1000,
  });
}

export function useServices(categoryId?: string) {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: () =>
      apiClient.get<ApiResponse<Service[]>>('/services', {
        params: categoryId ? { category_id: categoryId } : undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () =>
      apiClient.get<ApiResponse<Service>>(`/services/${id}`),
    enabled: !!id,
  });
}
