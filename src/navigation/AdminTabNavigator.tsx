import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { AdminServicesScreen } from '../screens/admin/AdminServicesScreen';
import { AdminClientsScreen } from '../screens/admin/AdminClientsScreen';
import { Icon } from '../components/common/Icon';
import type { IconName } from '../components/common/Icon';
import { colors, borderRadius, fonts } from '../utils/constants';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, IconName> = {
  Dashboard: 'grid',
  Bookings: 'calendar',
  Services: 'sparkles',
  Clients: 'user',
};

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Icon
        name={tabIcons[routeName] ?? 'grid'}
        size={19}
        color={focused ? colors.primary : colors.textTertiary}
        strokeWidth={2}
      />
    </View>
  );
}

export function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: {
          color: colors.textPrimary,
          fontFamily: fonts.displaySemiBold,
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Bookings" component={AdminBookingsScreen} />
      <Tab.Screen name="Services" component={AdminServicesScreen} />
      <Tab.Screen name="Clients" component={AdminClientsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    width: 42,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primaryBg,
  },
});
