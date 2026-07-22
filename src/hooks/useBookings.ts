import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Booking, ApiResponse, PaginatedResponse } from '../types';

export function useBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', status],
    queryFn: () =>
      apiClient.get<
        ApiResponse<Booking[]> | PaginatedResponse<Booking>
      >('/bookings', {
        params: status ? { status } : undefined,
      }),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () =>
      apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`),
    enabled: !!id,
  });
}

interface CreateBookingInput {
  serviceId: string;
  addressId: string;
  bookingDate: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) =>
      apiClient.post<ApiResponse<Booking>>('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
