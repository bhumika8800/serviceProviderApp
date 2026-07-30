import { create } from 'zustand';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: User, token: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isGuest: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  login: (user, token) => set({ user, token, isAuthenticated: true, isGuest: false, isLoading: false }),
  loginAsGuest: () => set({ user: null, token: null, isAuthenticated: false, isGuest: true, isLoading: false }),
  logout: () => set({ user: null, token: null, isAuthenticated: false, isGuest: false, isLoading: false }),
}));
