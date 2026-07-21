export type UserTabParamList = {
  Home: undefined;
  Services: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Otp: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  UserTabs: undefined;
  AdminTabs: undefined;
  ServiceDetail: { serviceId: string };
};
