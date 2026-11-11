import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';
import { BookingItem } from '../../components/BookingItem';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Icon } from '../../components/common/Icon';
import { useBookings, useCancelBooking } from '../../hooks/useBookings';
import type { UserTabParamList } from '../../navigation/types';
import type { Booking, PaginatedResponse } from '../../types';

type BookingsNavProp = BottomTabNavigationProp<UserTabParamList>;

type TabKey = 'active' | 'history';

const activeStatuses: Booking['status'][] = ['pending', 'confirmed', 'in_progress'];
const historyStatuses: Booking['status'][] = ['completed', 'cancelled'];

export function MyBookingsScreen() {
  const navigation = useNavigation<BookingsNavProp>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const { data, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();

  const filteredBookings = useMemo(() => {
    const bookings = (data as PaginatedResponse<Booking> | undefined)?.data ?? [];
    if (activeTab === 'active') {
      return bookings.filter((b) => activeStatuses.includes(b.status));
    }
    return bookings.filter((b) => historyStatuses.includes(b.status));
  }, [data, activeTab]);

  const handleCancel = useCallback(
    (id: string) => {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              cancelBooking.mutate(id, {
                onError: (error: { message?: string }) => {
                  Alert.alert('Cancel Failed', error?.message || 'Something went wrong.');
                },
              });
            },
          },
        ],
      );
    },
    [cancelBooking],
  );

  const renderItem = useCallback(
    ({ item }: { item: Booking }) => (
      <BookingItem
        booking={item}
        showCancel={item.status === 'pending' || item.status === 'confirmed'}
        onCancel={handleCancel}
        onPress={(id) => Alert.alert('Booking Details', `View details for ${id}`)}
      />
    ),
    [handleCancel],
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'history', label: 'History' },
  ];

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <ScreenHeader title="My bookings" subtitle="Track your active and past services" />
          <EmptyState
            icon="calendar"
            title="Sign in to see your bookings"
            message="You're browsing as a guest. Log in to view and manage your bookings."
            actionLabel="Sign In"
            onAction={logout}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScreenHeader title="My bookings" subtitle="Track your active and past services" />

        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.skeletonCard}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
                  <View style={styles.skeletonLineHalf} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon={activeTab === 'active' ? 'calendar' : 'clock'}
                title={activeTab === 'active' ? 'No active bookings' : 'No booking history'}
                message={
                  activeTab === 'active'
                    ? 'Book a service and it will show up here.'
                    : 'Your completed and cancelled bookings will appear here.'
                }
                actionLabel={activeTab === 'active' ? 'Browse services' : undefined}
                onAction={
                  activeTab === 'active' ? () => navigation.navigate('Services') : undefined
                }
              />
            }
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Services')}
        >
          <Icon name="plus" size={24} color={colors.textWhite} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.full,
    padding: spacing.xxs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 90,
    gap: spacing.md,
  },
  loadingContainer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    marginRight: spacing.sm,
  },
  skeletonContent: {
    flex: 1,
    gap: spacing.xs,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
  },
  skeletonLineShort: {
    width: '50%',
  },
  skeletonLineHalf: {
    height: 12,
    width: '30%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});
