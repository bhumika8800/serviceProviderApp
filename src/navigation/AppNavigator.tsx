import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserTabNavigator } from './UserTabNavigator';
import { ServiceDetailScreen } from '../screens/user/ServiceDetailScreen';
import { colors } from '../utils/constants';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
