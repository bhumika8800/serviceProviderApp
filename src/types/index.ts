export type UserRole = 'customer' | 'admin' | 'service_provider';

export interface User {
  id: string;
  firebaseUid: string;
  phone: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  addresses?: Address[];
  isActive: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  serviceSnapshot: {
    serviceId: string;
    name: string;
    price: number;
  };
  addressSnapshot: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  bookingDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  durationMins: number;
  images: string[];
  tags: string[];
  avgRating: number;
  reviewCount: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  isActive: boolean;
}
