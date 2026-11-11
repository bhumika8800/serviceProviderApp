import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { StatusBadge } from './common/StatusBadge';
import { Icon } from './common/Icon';
import type { IconName } from './common/Icon';
import type { Booking } from '../types';

interface BookingItemProps {
  booking: Booking;
  showCancel?: boolean;
  onCancel?: (id: string) => void;
  onPress?: (id: string) => void;
}

export function getServiceIcon(name: string): IconName {
  const value = name.toLowerCase();
  if (value.includes('clean')) {
    return 'sparkles';
  }
  if (
    value.includes('beaut') ||
    value.includes('facial') ||
    value.includes('hair') ||
    value.includes('manicure')
  ) {
    return 'star';
  }
  if (value.includes('paint') || value.includes('ac ') || value.includes('washing')) {
    return 'grid';
  }
  if (
    value.includes('electric') ||
    value.includes('switch') ||
    value.includes('fan') ||
    value.includes('wiring') ||
    value.includes('plumb') ||
    value.includes('tap') ||
    value.includes('drain') ||
    value.includes('heater') ||
    value.includes('repair')
  ) {
    return 'settings';
  }
  return 'sparkles';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${day}/${month}/${year} · ${h}:${minutes} ${ampm}`;
}

export function BookingItem({ booking, showCancel, onCancel, onPress }: BookingItemProps) {
  const icon = getServiceIcon(booking.serviceSnapshot.name);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(booking.id)}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {booking.serviceSnapshot.name}
          </Text>
          <StatusBadge status={booking.status} />
        </View>

        <View style={styles.metaRow}>
          <Icon name="calendar" size={13} color={colors.textTertiary} strokeWidth={2} />
          <Text style={styles.date}>{formatDate(booking.bookingDate)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.amount}>₹{booking.totalAmount}</Text>
          {showCancel && onCancel ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onCancel(booking.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.bookingId}>#{booking.id.slice(-6).toUpperCase()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.xxs,
  },
  serviceName: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  bookingId: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.error,
  },
  cancelText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
  },
});
