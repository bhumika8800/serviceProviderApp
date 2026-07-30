import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../utils/constants';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ message, fullScreen = false }: LoaderProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});