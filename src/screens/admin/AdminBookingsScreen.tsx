import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useAdminBookings } from '../../hooks/useAdmin';
import { updateBookingStatus } from '../../services/bookingService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import type { Booking } from '../../types';

const statusFilters: Array<{ key: string; label: string }> = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusColors: Record<Booking['status'], string> = {
  pending: colors.warning,
  confirmed: colors.info,
  in_progress: colors.primary,
  completed: colors.success,
  cancelled: colors.textTertiary,
};

const nextTransitions: Partial<Record<Booking['status'], Booking['status']>> = {
  pending: 'confirmed',
  confirmed: 'in_progress',
  in_progress: 'completed',
};

export function AdminBookingsScreen() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');

  const { data, isLoading } = useAdminBookings(status || undefined);
  const updateStatus = useMutation({
    mutationFn: ({ id, next }: { id: string; next: string }) =>
      updateBookingStatus(id, next),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });

  const response = data as unknown as { data?: Booking[] } | undefined;
  const bookings: Booking[] = response?.data ?? [];

  const renderBooking = ({ item }: { item: Booking }) => {
    const next = nextTransitions[item.status];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.serviceSnapshot.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
          </View>
        </View>
        <Text style={styles.meta}>
          {formatDate(item.bookingDate)} · {formatCurrency(item.totalAmount)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.addressSnapshot.line1}, {item.addressSnapshot.city}
        </Text>
        <Text style={styles.meta}>
          Booked {formatDate(item.createdAt)} · #{item.id.slice(-6)}
        </Text>
        {next && (
          <TouchableOpacity
            style={styles.advanceButton}
            onPress={() => updateStatus.mutate({ id: item.id, next })}
          >
            <Text style={styles.advanceButtonText}>
              Advance to {next.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookings</Text>
      </View>

      <View style={styles.filterRow}>
        {statusFilters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, status === f.key && styles.filterChipActive]}
            onPress={() => setStatus(f.key)}
          >
            <Text style={[styles.filterChipText, status === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && bookings.length === 0 ? (
        <Loader fullScreen />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" message="Bookings placed by customers will appear here." />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderBooking}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.textWhite,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  meta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  advanceButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
  },
  advanceButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
});