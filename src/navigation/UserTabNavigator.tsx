import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/user/HomeScreen';
import { ServicesScreen } from '../screens/user/ServicesScreen';
import { MyBookingsScreen } from '../screens/user/MyBookingsScreen';
import { ProfileScreen } from '../screens/user/ProfileScreen';
import { Icon } from '../components/common/Icon';
import type { IconName } from '../components/common/Icon';
import { colors, borderRadius } from '../utils/constants';
import type { UserTabParamList } from './types';

const Tab = createBottomTabNavigator<UserTabParamList>();

const tabIcons: Record<keyof UserTabParamList, IconName> = {
  Home: 'home',
  Services: 'grid',
  Bookings: 'calendar',
  Profile: 'user',
};

function TabIcon({ routeName, focused }: { routeName: keyof UserTabParamList; focused: boolean }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Icon
        name={tabIcons[routeName]}
        size={19}
        color={focused ? colors.primary : colors.textTertiary}
        strokeWidth={2}
      />
    </View>
  );
}

export function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <TabIcon routeName={route.name as keyof UserTabParamList} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: 'Services' }} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
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
