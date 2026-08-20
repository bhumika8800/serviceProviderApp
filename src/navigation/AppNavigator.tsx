import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserTabNavigator } from './UserTabNavigator';
import { AdminTabNavigator } from './AdminTabNavigator';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { ServiceDetailScreen } from '../screens/user/ServiceDetailScreen';
import { BookingScreen } from '../screens/user/BookingScreen';
import { NotificationsScreen } from '../screens/user/NotificationsScreen';
import { ClientDetailScreen } from '../screens/admin/ClientDetailScreen';
import { CompleteProfileScreen } from '../screens/auth/CompleteProfileScreen';
import { colors } from '../utils/constants';
import { useAuthStore } from '../store/useAuthStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const hasAccess = isAuthenticated || isGuest;
  const isAdmin = user?.role === 'admin';
  const needsProfileCompletion =
    !isAdmin && hasAccess && user !== null && user.profileComplete === false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTitleStyle: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
          headerTintColor: colors.primary,
          headerShadowVisible: false,
        }}
      >
        {hasAccess ? (
          needsProfileCompletion ? (
            <Stack.Group>
              <Stack.Screen
                name="CompleteProfile"
                component={CompleteProfileScreen}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          ) : isAdmin ? (
            <Stack.Group>
              <Stack.Screen
                name="AdminTabs"
                component={AdminTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AdminClientDetail"
                component={ClientDetailScreen}
                options={{ title: 'Client Detail' }}
              />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen
                name="UserTabs"
                component={UserTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServiceDetail"
                component={ServiceDetailScreen}
                options={{ title: 'Service Detail' }}
              />
              <Stack.Screen
                name="Booking"
                component={BookingScreen}
                options={{ title: 'New Booking' }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'Notifications' }}
              />
            </Stack.Group>
          )
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Otp"
              component={OtpScreen}
              options={{ title: 'OTP Verification' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
