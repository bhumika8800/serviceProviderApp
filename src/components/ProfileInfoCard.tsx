import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { getInitials, capitalize } from '../utils/formatters';
import type { Address, User } from '../types';

interface ProfileInfoCardProps {
  user: User;
  addresses: Address[];
  onEditProfile: () => void;
  onManageAddresses: () => void;
  onAvatarPress: () => void;
}

export function ProfileInfoCard({
  user,
  addresses,
  onEditProfile,
  onManageAddresses,
  onAvatarPress,
}: ProfileInfoCardProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Guest User';
  const initials = getInitials(fullName);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <View style={styles.card}>
      <View style={styles.profileRow}>
        <TouchableOpacity style={styles.avatarContainer} onPress={onAvatarPress} activeOpacity={0.8}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Icon name="camera" size={12} color={colors.textWhite} strokeWidth={2} />
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.phone}>{user.phone}</Text>
          {user.email ? (
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity style={styles.addressRow} onPress={onManageAddresses} activeOpacity={0.7}>
        <View style={styles.addressIcon}>
          <Icon name="pin" size={18} color={colors.primary} />
        </View>
        <View style={styles.addressContent}>
          <Text style={styles.addressLabel}>
            {defaultAddress ? `${capitalize(defaultAddress.label)} address` : 'Service address'}
          </Text>
          <Text style={styles.addressLine} numberOfLines={2}>
            {defaultAddress
              ? `${defaultAddress.line1}${defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pincode}`
              : 'No address saved yet. Tap to add one.'}
          </Text>
        </View>
        <Icon name="chevron-right" size={16} color={colors.textTertiary} strokeWidth={2.2} />
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button title="Edit profile" onPress={onEditProfile} variant="outline" />
        </View>
        <View style={styles.actionButton}>
          <Button title="Addresses" onPress={onManageAddresses} variant="ghost" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarInitials: {
    ...typography.h2,
    color: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  phone: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  email: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressLine: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
