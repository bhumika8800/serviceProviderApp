import { useQuery } from '@tanstack/react-query';
import { listCategories, listServices, getService } from '../services/servicesCatalog';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => listCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useServices(categoryId?: string) {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: () => listServices(categoryId ? { categoryId } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => getService(id),
    enabled: !!id,
  });
}