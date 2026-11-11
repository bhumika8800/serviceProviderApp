import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../utils/constants';
import { Icon } from './Icon';
import type { IconName } from './Icon';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: IconName;
}

export function Chip({ label, active = false, onPress, icon }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon ? (
        <Icon
          name={icon}
          size={15}
          color={active ? colors.textWhite : colors.primary}
          strokeWidth={2}
        />
      ) : null}
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  textActive: {
    color: colors.textWhite,
  },
});
