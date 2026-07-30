import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserTabNavigator } from './UserTabNavigator';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { ServiceDetailScreen } from '../screens/user/ServiceDetailScreen';
import { colors } from '../utils/constants';
import { useAuthStore } from '../store/useAuthStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);
  const hasAccess = isAuthenticated || isGuest;

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
          </Stack.Group>
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
