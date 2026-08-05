import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';
import { mockUser, mockAddresses } from '../../data/mockUser';
import { mockBookings } from '../../data/mockBookings';
import { EmptyState } from '../../components/common/EmptyState';
import { MenuItem } from '../../components/common/MenuItem';
import { Button } from '../../components/common/Button';
import { ProfileInfoCard } from '../../components/ProfileInfoCard';
import { EditProfileModal } from '../../components/EditProfileModal';
import { AvatarPickerModal } from '../../components/AvatarPickerModal';
import { AddressManagerModal } from '../../components/AddressManagerModal';
import { PastServiceCard } from '../../components/PastServiceCard';
import type { UserTabParamList } from '../../navigation/types';
import type { Address } from '../../types';

type ProfileNavProp = BottomTabNavigationProp<UserTabParamList>;

const supportOptions = [
  { icon: '🛟', label: 'Help Centre', description: 'Guides and troubleshooting' },
  { icon: '⚠️', label: 'Raise Complaint', description: 'Report an issue with a booking' },
  { icon: '💬', label: 'Contact Support', description: 'Chat with our support team' },
  { icon: '❓', label: 'FAQs', description: 'Frequently asked questions' },
];

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavProp>();
  const user = useAuthStore((s) => s.user) ?? mockUser;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);

  const pastServices = useMemo(
    () => mockBookings.filter((b) => b.status === 'completed'),
    [],
  );

  const comingSoon = useCallback((feature: string) => {
    Alert.alert(feature, 'This feature will be available soon.');
  }, []);

  const handleSaveProfile = useCallback(
    (data: { firstName: string; lastName: string; email?: string }) => {
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      setShowEditProfile(false);
    },
    [user, setUser],
  );

  const handleSelectAvatar = useCallback(
    (uri: string) => {
      setUser({ ...user, avatar: uri || undefined });
      setShowAvatarPicker(false);
    },
    [user, setUser],
  );

  const handleAddAddress = useCallback((address: Omit<Address, 'id'>) => {
    setAddresses((prev) => {
      const list = address.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [...list, { ...address, id: `addr-${Date.now()}` }];
    });
  }, []);

  const handleUpdateAddress = useCallback((updated: Address) => {
    setAddresses((prev) => {
      const list = prev.map((a) => (a.id === updated.id ? updated : a));
      return updated.isDefault
        ? list.map((a) => (a.id === updated.id ? a : { ...a, isDefault: false }))
        : list;
    });
  }, []);

  const handleDeleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>
          <EmptyState
            title="Sign in to view your profile"
            message="Log in to manage your personal information, saved addresses, and past services."
            actionLabel="Sign In"
            onAction={logout}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ProfileInfoCard
          user={user}
          addresses={addresses}
          onEditProfile={() => setShowEditProfile(true)}
          onManageAddresses={() => setShowAddressManager(true)}
          onAvatarPress={() => setShowAvatarPicker(true)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionCard}>
            {supportOptions.map((option, index) => (
              <MenuItem
                key={option.label}
                icon={option.icon}
                label={option.label}
                description={option.description}
                onPress={() => comingSoon(option.label)}
                last={index === supportOptions.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Past Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {pastServices.length > 0 ? (
            <View style={styles.pastServices}>
              {pastServices.map((booking) => (
                <PastServiceCard
                  key={booking.id}
                  serviceName={booking.serviceSnapshot.name}
                  date={booking.bookingDate}
                  amount={booking.totalAmount}
                  onRate={() => comingSoon('Rate & Review')}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No past services yet</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="👤"
              label="Personal Information"
              description="Update your name and email"
              onPress={() => setShowEditProfile(true)}
            />
            <MenuItem
              icon="🔔"
              label="Notification Inbox"
              description="Manage your alerts"
              onPress={() => comingSoon('Notification Inbox')}
            />
            <MenuItem
              icon="📍"
              label="Saved Addresses"
              description={`${addresses.length} address${addresses.length === 1 ? '' : 'es'} saved`}
              onPress={() => setShowAddressManager(true)}
            />
            <MenuItem
              icon="🔒"
              label="Privacy & Security"
              description="Account and data safety"
              onPress={() => comingSoon('Privacy & Security')}
            />
            <MenuItem
              icon="📄"
              label="Terms & Conditions"
              description="Read our terms and policies"
              onPress={() => comingSoon('Terms & Conditions')}
              last
            />
          </View>
          <Button title="Logout" variant="danger" onPress={handleLogout} />
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <EditProfileModal
        visible={showEditProfile}
        initial={{
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
        }}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
      />

      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatar={user.avatar}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={handleSelectAvatar}
      />

      <AddressManagerModal
        visible={showAddressManager}
        addresses={addresses}
        onClose={() => setShowAddressManager(false)}
        onAdd={handleAddAddress}
        onUpdate={handleUpdateAddress}
        onDelete={handleDeleteAddress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  seeAll: {
    ...typography.body,
    color: colors.textLink,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginHorizontal: spacing.xl,
    ...shadows.sm,
  },
  pastServices: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    paddingHorizontal: spacing.xl,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
