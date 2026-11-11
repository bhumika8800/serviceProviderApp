import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius, typography } from '../../utils/constants';
import { getInitials } from '../../utils/formatters';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
}

export function Avatar({ uri, name, size = 44, onPress }: AvatarProps) {
  const initials = getInitials(name ?? '');

  const content = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
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
  placeholder: {
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  initials: {
    ...typography.h3,
    color: colors.primary,
  },
});
