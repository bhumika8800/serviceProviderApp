import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { Button } from './common/Button';
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
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addressRow} onPress={onManageAddresses} activeOpacity={0.7}>
        <Text style={styles.addressIcon}>📍</Text>
        <View style={styles.addressContent}>
          <Text style={styles.addressLabel}>
            {defaultAddress ? `${capitalize(defaultAddress.label)} Address` : 'Address'}
          </Text>
          <Text style={styles.addressLine} numberOfLines={2}>
            {defaultAddress
              ? `${defaultAddress.line1}${defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.pincode}`
              : 'No address saved yet. Tap to add one.'}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button title="Edit Profile" onPress={onEditProfile} variant="outline" />
        </View>
        <View style={styles.actionButton}>
          <Button title="Manage Addresses" onPress={onManageAddresses} variant="ghost" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
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
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
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
  cameraIcon: {
    fontSize: 11,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  phone: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressLine: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginTop: 2,
  },
  chevron: {
    ...typography.h3,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
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
