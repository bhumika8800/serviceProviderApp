import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { useToggleUserActive } from '../../hooks/useAdmin';
import { getInitials } from '../../utils/formatters';
import type { RootStackParamList } from '../../navigation/types';
import type { User } from '../../types';

type ClientDetailRoute = RouteProp<RootStackParamList, 'AdminClientDetail'>;

export function ClientDetailScreen() {
  const route = useRoute<ClientDetailRoute>();
  const toggleActive = useToggleUserActive();
  const [user, setUser] = useState<User>(route.params.user);

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unnamed user';

  const handleToggle = () => {
    const action = user.isActive ? 'block' : 'unblock';
    Alert.alert(
      `${action === 'block' ? 'Block' : 'Unblock'} ${fullName}?`,
      action === 'block' ? 'Blocked users cannot sign in to the app.' : 'The user will be able to sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'block' ? 'Block' : 'Unblock',
          style: action === 'block' ? 'destructive' : 'default',
          onPress: () =>
            toggleActive.mutate(
              { id: user.id, isActive: !user.isActive },
              {
                onSuccess: (res) => {
                  const updated = (res as unknown as { data?: { user?: User } }).data?.user;
                  if (updated) setUser(updated);
                },
              },
            ),
        },
      ],
    );
  };

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Name', value: fullName },
    { label: 'Phone', value: user.phone || '—' },
    { label: 'Email', value: user.email || '—' },
    { label: 'Role', value: user.role },
    { label: 'Profile', value: user.profileComplete ? 'Completed' : 'Incomplete' },
    { label: 'Status', value: user.isActive ? 'Active' : 'Blocked' },
    { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString() },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.avatar, !user.isActive && styles.avatarBlocked]}>
            <Text style={styles.avatarInitials}>{getInitials(fullName)}</Text>
          </View>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index === rows.length - 1 && styles.rowLast]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.action}>
          <Button
            title={user.isActive ? 'Block User' : 'Unblock User'}
            variant={user.isActive ? 'danger' : 'outline'}
            onPress={handleToggle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarBlocked: {
    backgroundColor: colors.borderLight,
  },
  avatarInitials: {
    ...typography.h1,
    color: colors.primary,
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  phone: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textTertiary,
  },
  rowValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  action: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
});