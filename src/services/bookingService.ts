import apiClient from './apiClient';
import type { ApiResponse, PaginatedResponse, Booking } from '../types';

export interface CreateBookingInput {
  serviceId: string;
  addressId: string;
  bookingDate: string;
  quantity?: number;
}

export function createBooking(data: CreateBookingInput) {
  return apiClient.post<ApiResponse<Booking>>('/bookings', data);
}

export function listBookings(status?: string, page = 1, limit = 20) {
  return apiClient.get<ApiResponse<Booking[]> | PaginatedResponse<Booking>>('/bookings', {
    params: { status, page, limit },
  });
}

export function getBooking(id: string) {
  return apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
}

export function cancelBooking(id: string) {
  return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
}

export function updateBookingStatus(id: string, status: string) {
  return apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
}