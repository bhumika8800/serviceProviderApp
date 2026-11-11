import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import {
  createBooking,
  listBookings,
  getBooking,
  cancelBooking,
  type CreateBookingInput,
} from '../services/bookingService';

export function useBookings(status?: string) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['bookings', status],
    queryFn: () => listBookings(status),
    enabled: !!token,
  });
}

export function useBooking(id: string) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(id),
    enabled: !!token && !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}