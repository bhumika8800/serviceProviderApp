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
  ServiceDetail: { serviceId: string };
};
