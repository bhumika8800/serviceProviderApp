import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/constants';

const statusConfig: Record<string, { bg: string; text: string }> = {
  pending: { bg: colors.warningBg, text: colors.warning },
  confirmed: { bg: colors.primaryBg, text: colors.primary },
  in_progress: { bg: colors.warningBg, text: colors.warning },
  completed: { bg: colors.successBg, text: colors.success },
  cancelled: { bg: colors.errorBg, text: colors.error },
  open: { bg: colors.warningBg, text: colors.warning },
  resolved: { bg: colors.successBg, text: colors.success },
  closed: { bg: colors.borderLight, text: colors.textTertiary },
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: colors.borderLight, text: colors.textTertiary };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>
        {status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});