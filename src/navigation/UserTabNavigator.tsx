import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/user/HomeScreen';
import { ServicesScreen } from '../screens/user/ServicesScreen';
import { MyBookingsScreen } from '../screens/user/MyBookingsScreen';
import { ProfileScreen } from '../screens/user/ProfileScreen';
import { colors } from '../utils/constants';
import type { UserTabParamList } from './types';

const Tab = createBottomTabNavigator<UserTabParamList>();

const tabIcons: Record<keyof UserTabParamList, string> = {
  Home: '🏠',
  Services: '⚙️',
  Bookings: '📋',
  Profile: '👤',
};

function TabIcon({ routeName, focused }: { routeName: keyof UserTabParamList; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {tabIcons[routeName]}
      </Text>
    </View>
  );
}

export function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '600', fontSize: 18 },
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
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.5 },
  iconFocused: { opacity: 1 },
});
