import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';
import { useUserProfile, useUpdateProfile, useAddAddress, useUpdateAddress, useDeleteAddress } from '../../hooks/useUserProfile';
import { useBookings } from '../../hooks/useBookings';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { MenuItem } from '../../components/common/MenuItem';
import { Button } from '../../components/common/Button';
import { ProfileInfoCard } from '../../components/ProfileInfoCard';
import { EditProfileModal } from '../../components/EditProfileModal';
import { AvatarPickerModal } from '../../components/AvatarPickerModal';
import { AddressManagerModal } from '../../components/AddressManagerModal';
import { PastServiceCard } from '../../components/PastServiceCard';
import type { UserTabParamList, RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Address, Booking, PaginatedResponse, User } from '../../types';

type ProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const supportOptions = [
  { icon: '🛟', label: 'Help Centre', description: 'Guides and troubleshooting' },
  { icon: '⚠️', label: 'Raise Complaint', description: 'Report an issue with a booking' },
  { icon: '💬', label: 'Contact Support', description: 'Chat with our support team' },
  { icon: '❓', label: 'FAQs', description: 'Frequently asked questions' },
];

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNavProp>();
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useUserProfile();
  const { data: bookingsData } = useBookings();
  const updateProfile = useUpdateProfile();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const apiUser = (data as ApiResponse<{ user: User }> | undefined)?.data?.user;
  const user: User | null = apiUser ?? storeUser;
  const addresses: Address[] = user?.addresses ?? [];

  useEffect(() => {
    if (apiUser && apiUser.id !== storeUser?.id) {
      setUser(apiUser);
    }
  }, [apiUser, storeUser?.id, setUser]);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);

  const bookings = (bookingsData as PaginatedResponse<Booking> | undefined)?.data ?? [];
  const pastServices = bookings.filter((b) => b.status === 'completed');

  const comingSoon = useCallback((feature: string) => {
    Alert.alert(feature, 'This feature will be available soon.');
  }, []);

  const handleSaveProfile = useCallback(
    (profile: { firstName: string; lastName: string; email?: string }) => {
      updateProfile.mutate(profile, {
        onSuccess: (res) => {
          const updated = (res as unknown as ApiResponse<{ user: User }>).data?.user;
          if (updated) setUser(updated);
          setShowEditProfile(false);
        },
        onError: (error: { message?: string }) => {
          Alert.alert('Update Failed', error?.message || 'Something went wrong.');
        },
      });
    },
    [updateProfile, setUser],
  );

  const handleSelectAvatar = useCallback(
    (uri: string) => {
      updateProfile.mutate(
        { avatar: uri || undefined },
        {
          onSuccess: (res) => {
            const updated = (res as unknown as ApiResponse<{ user: User }>).data?.user;
            if (updated) setUser(updated);
            setShowAvatarPicker(false);
          },
          onError: (error: { message?: string }) => {
            Alert.alert('Update Failed', error?.message || 'Something went wrong.');
          },
        },
      );
    },
    [updateProfile, setUser],
  );

  const handleAddAddress = useCallback(
    (address: Omit<Address, 'id'>) => {
      addAddress.mutate(address);
    },
    [addAddress],
  );

  const handleUpdateAddress = useCallback(
    (updated: Address) => {
      const { id, ...rest } = updated;
      updateAddress.mutate({ addressId: id, data: rest });
    },
    [updateAddress],
  );

  const handleDeleteAddress = useCallback(
    (id: string) => {
      deleteAddress.mutate(id);
    },
    [deleteAddress],
  );

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
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !user) {
    return <Loader fullScreen message="Loading profile…" />;
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
          user={user!}
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
              onPress={() => navigation.navigate('Notifications')}
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
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          email: user?.email ?? '',
        }}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
      />

      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatar={user?.avatar}
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