import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useAdminUsers, useToggleUserActive } from '../../hooks/useAdmin';
import { getInitials } from '../../utils/formatters';
import type { RootStackParamList } from '../../navigation/types';
import type { User } from '../../types';

type AdminNavProp = NativeStackNavigationProp<RootStackParamList>;

type AdminUserListResponse = {
  success: boolean;
  data?: User[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export function AdminClientsScreen() {
  const navigation = useNavigation<AdminNavProp>();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'customer' | 'provider' | 'admin'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    q: search || undefined,
    role: role === 'all' ? undefined : role,
    page,
    limit: 20,
  });
  const toggleActive = useToggleUserActive();

  const response = data as AdminUserListResponse | undefined;
  const users: User[] = response?.data ?? [];
  const totalPages = response?.pagination?.totalPages ?? 1;

  const roleFilters: Array<'all' | 'customer' | 'provider' | 'admin'> = ['all', 'customer', 'provider', 'admin'];
  const roleLabels: Record<string, string> = {
    all: 'All',
    customer: 'Customers',
    provider: 'Providers',
    admin: 'Admins',
  };

  const handleToggle = (user: User) => {
    const action = user.isActive ? 'block' : 'unblock';
    Alert.alert(
      `${action === 'block' ? 'Block' : 'Unblock'} ${[user.firstName, user.lastName].filter(Boolean).join(' ') || 'user'}?`,
      action === 'block'
        ? 'Blocked users cannot sign in to the app.'
        : 'The user will be able to sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'block' ? 'Block' : 'Unblock',
          style: action === 'block' ? 'destructive' : 'default',
          onPress: () => toggleActive.mutate({ id: user.id, isActive: !user.isActive }),
        },
      ],
    );
  };

  const renderUser = ({ item }: { item: User }) => {
    const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ') || 'Unnamed user';
    return (
      <TouchableOpacity
        style={styles.userCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('AdminClientDetail', { user: item })}
      >
        <View style={[styles.avatar, !item.isActive && styles.avatarBlocked]}>
          <Text style={styles.avatarInitials}>{getInitials(fullName)}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {fullName}
            </Text>
            {!item.isActive && <View style={styles.blockedBadge}><Text style={styles.blockedBadgeText}>Blocked</Text></View>}
          </View>
          <Text style={styles.userMeta}>{item.phone || 'No phone'}</Text>
          <Text style={styles.userMeta} numberOfLines={1}>
            {item.email || 'No email'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, !item.isActive && styles.toggleButtonActive]}
          onPress={() => handleToggle(item)}
        >
          <Text style={[styles.toggleButtonText, !item.isActive && styles.toggleButtonTextActive]}>
            {item.isActive ? 'Block' : 'Unblock'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone or email"
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
          autoCapitalize="none"
        />
        <View style={styles.roleRow}>
          {roleFilters.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleChip, role === r && styles.roleChipActive]}
              onPress={() => {
                setRole(r);
                setPage(1);
              }}
            >
              <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                {roleLabels[r]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && users.length === 0 ? (
        <Loader fullScreen />
      ) : users.length === 0 ? (
        <EmptyState title="No clients found" message="Try adjusting your search or filters." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderUser}
          onEndReached={() => {
            if (page < totalPages) setPage((p) => p + 1);
          }}
          onEndReachedThreshold={0.3}
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
  filters: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  roleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: colors.textWhite,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarBlocked: {
    backgroundColor: colors.borderLight,
  },
  avatarInitials: {
    ...typography.h3,
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userName: {
    ...typography.h4,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  blockedBadge: {
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  blockedBadgeText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
    fontSize: 10,
  },
  userMeta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 1,
  },
  toggleButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorBg,
  },
  toggleButtonActive: {
    backgroundColor: colors.successBg,
  },
  toggleButtonText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '700',
  },
  toggleButtonTextActive: {
    color: colors.success,
  },
});