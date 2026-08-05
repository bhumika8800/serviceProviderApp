import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { formatDate, formatCurrency } from '../utils/formatters';
import { serviceIconMap } from './BookingItem';

interface PastServiceCardProps {
  serviceName: string;
  date: string;
  amount: number;
  onRate: () => void;
}

export function PastServiceCard({ serviceName, date, amount, onRate }: PastServiceCardProps) {
  const icon = serviceIconMap[serviceName] || '🛠️';

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {serviceName}
        </Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.amount}>{formatCurrency(amount)}</Text>
          <TouchableOpacity style={styles.rateButton} onPress={onRate} activeOpacity={0.8}>
            <Text style={styles.rateText}>★ Rate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    backgroundColor: colors.accentBg,
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
  name: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  date: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  amount: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  rateButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
  },
  rateText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});
