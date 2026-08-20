import apiClient from './apiClient';
import type { ApiResponse, User } from '../types';

type UserResponse = ApiResponse<{ user: User }>;

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  label?: 'home' | 'work' | 'other';
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export function getMe() {
  return apiClient.get<UserResponse>('/users/me');
}

export function updateProfile(data: UpdateProfileInput) {
  return apiClient.patch<UserResponse>('/users/me', data);
}

export function addAddress(data: AddressInput) {
  return apiClient.post<UserResponse>('/users/me/addresses', data);
}

export function updateAddress(addressId: string, data: Partial<AddressInput>) {
  return apiClient.patch<UserResponse>(`/users/me/addresses/${addressId}`, data);
}

export function deleteAddress(addressId: string) {
  return apiClient.delete<UserResponse>(`/users/me/addresses/${addressId}`);
}

export function uploadImage(uri: string) {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: 'profile.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  return apiClient.post<UserResponse>('/users/me/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export interface CompleteProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  address?: Omit<AddressInput, 'isDefault' | 'label'> & { label?: AddressInput['label'] };
}

export function completeProfile(data: CompleteProfileInput) {
  return apiClient.post<UserResponse>('/auth/complete-profile', data);
}