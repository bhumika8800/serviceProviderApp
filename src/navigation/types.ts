import type { User } from '../types';

export type UserTabParamList = {
  Home: undefined;
  Services: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Otp: { phoneNumber: string };
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Otp: { phoneNumber: string };
  UserTabs: undefined;
  AdminTabs: undefined;
  CompleteProfile: undefined;
  ServiceDetail: { serviceId: string };
  Booking: { serviceId: string };
  Notifications: undefined;
  AdminClientDetail: { user: User };
};
