import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { StatusBadge } from './common/StatusBadge';
import type { Booking } from '../types';

interface BookingItemProps {
  booking: Booking;
  showCancel?: boolean;
  onCancel?: (id: string) => void;
  onPress?: (id: string) => void;
}

export const serviceIconMap: Record<string, string> = {
  'Basic Home Cleaning': '🧹',
  'Deep Cleaning': '🧹',
  'Kitchen Deep Cleaning': '🧹',
  'Tap & Mixer Repair': '🔧',
  'Drain Cleaning': '🔧',
  'Water Heater Installation': '🔧',
  'Switch & Socket Repair': '⚡',
  'Fan Installation & Repair': '⚡',
  'Wiring & Circuit Work': '⚡',
  'Facial & Cleanup': '💅',
  'Haircut & Styling': '💅',
  'Manicure & Pedicure': '💅',
  'AC Service & Repair': '🔨',
  'Washing Machine Repair': '🔨',
  'Refrigerator Service': '🔨',
  'Interior Wall Painting': '🎨',
  'Exterior Painting': '🎨',
  'Texture & Wallpaper': '🎨',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${day}/${month}/${year} ${h}:${minutes} ${ampm}`;
}

export function BookingItem({ booking, showCancel, onCancel, onPress }: BookingItemProps) {
  const icon = serviceIconMap[booking.serviceSnapshot.name] || '📋';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress?.(booking.id)}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {booking.serviceSnapshot.name}
          </Text>
          <StatusBadge status={booking.status} />
        </View>
        <Text style={styles.bookingId}>ID: {booking.id}</Text>
        <Text style={styles.date}>{formatDate(booking.bookingDate)}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.amount}>₹{booking.totalAmount}</Text>
          {showCancel && onCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onCancel(booking.id)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    ...shadows.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xxs,
  },
  serviceName: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.xs,
  },
  bookingId: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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
  cancelButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  cancelText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
});
