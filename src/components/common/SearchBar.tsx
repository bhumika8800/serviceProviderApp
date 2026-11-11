import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Icon } from './Icon';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onPress?: () => void;
  editable?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search for services',
  onPress,
  editable = true,
}: SearchBarProps) {
  const content = (
    <View style={[styles.container, !editable && styles.containerTappable]}>
      <Icon name="search" size={20} color={colors.textTertiary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value && value.length > 0 ? (
        <TouchableOpacity onPress={() => onChangeText?.('')} activeOpacity={0.7}>
          <Icon name="close" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.filterButton}>
          <Icon name="settings" size={16} color={colors.primary} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  containerTappable: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderLight,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
