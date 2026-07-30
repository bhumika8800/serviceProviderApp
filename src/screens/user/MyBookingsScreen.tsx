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
import { BookingItem } from '../../components/BookingItem';
import { mockBookings } from '../../data/mockBookings';
import type { UserTabParamList } from '../../navigation/types';
import type { Booking } from '../../types';

type BookingsNavProp = BottomTabNavigationProp<UserTabParamList>;

type TabKey = 'active' | 'history';

const activeStatuses: Booking['status'][] = ['pending', 'confirmed', 'in_progress'];
const historyStatuses: Booking['status'][] = ['completed', 'cancelled'];

export function MyBookingsScreen() {
  const navigation = useNavigation<BookingsNavProp>();
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isLoading] = useState(false);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'active') {
      return bookings.filter((b) => activeStatuses.includes(b.status));
    }
    return bookings.filter((b) => historyStatuses.includes(b.status));
  }, [bookings, activeTab]);

  const handleCancel = useCallback((id: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === id ? { ...b, status: 'cancelled' as const, isActive: false } : b,
              ),
            );
          },
        },
      ],
    );
  }, []);

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Bookings</Text>
          </View>
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <View style={styles.skeletonIcon} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
                  <View style={styles.skeletonLineHalf} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.tabActive,
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredBookings}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                {activeTab === 'active' ? '📅' : '📋'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'active'
                  ? 'No active bookings'
                  : 'No booking history'}
              </Text>
              <Text style={styles.emptyMessage}>
                {activeTab === 'active'
                  ? 'Book a service to get started'
                  : 'Your completed and cancelled bookings will appear here'}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Services')}
        >
          <Text style={styles.fabIcon}>+</Text>
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
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  tabContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.xxs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: borderRadius.md,
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
    padding: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 80,
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
    ...shadows.md,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
    marginRight: spacing.sm,
  },
  skeletonContent: {
    flex: 1,
    gap: spacing.xs,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
  },
  skeletonLineShort: {
    width: '50%',
  },
  skeletonLineHalf: {
    height: 14,
    width: '30%',
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
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
  fabIcon: {
    fontSize: 28,
    color: colors.textWhite,
    lineHeight: 30,
    fontWeight: '300',
  },
});
