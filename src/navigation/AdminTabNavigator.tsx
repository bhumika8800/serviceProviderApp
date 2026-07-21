import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { AdminServicesScreen } from '../screens/admin/AdminServicesScreen';
import { AdminClientsScreen } from '../screens/admin/AdminClientsScreen';
import { colors } from '../utils/constants';

const Tab = createBottomTabNavigator();

export function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Bookings" component={AdminBookingsScreen} />
      <Tab.Screen name="Services" component={AdminServicesScreen} />
      <Tab.Screen name="Clients" component={AdminClientsScreen} />
    </Tab.Navigator>
  );
}
