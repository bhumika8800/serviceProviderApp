import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useService } from '../../hooks/useServices';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useCreateBooking } from '../../hooks/useBookings';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Address, Service } from '../../types';

type BookingRoute = RouteProp<RootStackParamList, 'Booking'>;
type BookingNavProp = NativeStackNavigationProp<RootStackParamList>;

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function dateOptions(count = 7): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDay(date: Date): string {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function BookingScreen() {
  const navigation = useNavigation<BookingNavProp>();
  const route = useRoute<BookingRoute>();
  const { serviceId } = route.params;

  const { data: serviceData, isLoading: serviceLoading } = useService(serviceId);
  const { data: profileData, isLoading: profileLoading } = useUserProfile();

  const service = (serviceData as ApiResponse<Service> | undefined)?.data;
  const addresses: Address[] =
    ((profileData as ApiResponse<{ user: { addresses?: Address[] } }> | undefined)?.data?.user
      ?.addresses as Address[] | undefined) ?? [];

  const days = useMemo(() => dateOptions(), []);
  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[0]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null,
  );

  const createBooking = useCreateBooking();

  const bookingDate = useMemo(() => {
    const [h, m] = selectedSlot.split(':').map(Number);
    const d = new Date(selectedDate);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  }, [selectedDate, selectedSlot]);

  const handleConfirm = useCallback(() => {
    if (!selectedAddressId) {
      Alert.alert('Select Address', 'Please choose a delivery address to continue.');
      return;
    }
    createBooking.mutate(
      { serviceId, addressId: selectedAddressId, bookingDate },
      {
        onSuccess: () => {
          Alert.alert('Booking Confirmed', 'Your booking request has been placed.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error: { message?: string }) => {
          Alert.alert('Booking Failed', error?.message || 'Something went wrong. Please try again.');
        },
      },
    );
  }, [selectedAddressId, createBooking, serviceId, bookingDate, navigation]);

  if (serviceLoading || profileLoading) {
    return <Loader fullScreen message="Loading…" />;
  }

  if (!service) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryName}>{service.name}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{service.durationMins} min</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Price</Text>
          <Text style={styles.summaryPrice}>₹{service.price}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {days.map((day) => {
          const active = day.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedDate(day)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {formatDay(day)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.slotsGrid}>
        {TIME_SLOTS.map((slot) => {
          const active = slot === selectedSlot;
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slot, active && styles.slotActive]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Delivery Address</Text>
      {addresses.length === 0 ? (
        <View style={styles.noAddress}>
          <Text style={styles.noAddressText}>
            No saved address. Please add one from your profile first.
          </Text>
        </View>
      ) : (
        addresses.map((address) => {
          const active = address.id === selectedAddressId;
          return (
            <TouchableOpacity
              key={address.id}
              style={[styles.addressCard, active && styles.addressCardActive]}
              onPress={() => setSelectedAddressId(address.id)}
            >
              <View style={styles.addressTop}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                {address.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
              </View>
              <Text style={styles.addressText}>
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ''}
              </Text>
              <Text style={styles.addressText}>
                {address.city}, {address.state} {address.pincode}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      <View style={styles.actions}>
        <Button
          title="Confirm Booking"
          loading={createBooking.isPending}
          disabled={!selectedAddressId}
          onPress={handleConfirm}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  summaryName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  summaryPrice: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.textWhite,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  slot: {
    width: '30%',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  slotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  slotTextActive: {
    color: colors.textWhite,
  },
  noAddress: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  noAddressText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  addressCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  addressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  addressLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  defaultBadge: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.xl,
  },
});