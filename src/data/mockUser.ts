import type { Address, User } from '../types';

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'home',
    line1: '42, MG Road',
    line2: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'work',
    line1: '7th Floor, Prestige Towers',
    line2: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    country: 'India',
    isDefault: false,
  },
];

export const mockUser: User = {
  id: 'user-1',
  firebaseUid: 'firebase-uid-1',
  phone: '+91 98765 43210',
  role: 'customer',
  firstName: 'Aarav',
  lastName: 'Sharma',
  email: 'aarav.sharma@example.com',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  isActive: true,
  profileComplete: true,
  createdAt: '2026-06-01T10:00:00.000Z',
  updatedAt: '2026-07-30T12:00:00.000Z',
};

export const avatarOptions: string[] = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
];
