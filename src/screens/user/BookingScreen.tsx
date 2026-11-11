import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useService } from '../../hooks/useServices';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useCreateBooking } from '../../hooks/useBookings';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
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

function formatWeekday(date: Date): string {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tmrw';
  }
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short' });
}

export function BookingScreen() {
  const navigation = useNavigation<BookingNavProp>();
  const route = useRoute<BookingRoute>();
  const insets = useSafeAreaInsets();
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
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="sparkles" size={22} color={colors.primary} />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {service.name}
            </Text>
            <View style={styles.summaryMeta}>
              <Icon name="clock" size={12} color={colors.textTertiary} strokeWidth={2} />
              <Text style={styles.summaryMetaText}>{service.durationMins} min</Text>
            </View>
          </View>
          <Text style={styles.summaryPrice}>₹{service.price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesRow}
        >
          {days.map((day) => {
            const active = day.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[styles.dateCard, active && styles.dateCardActive]}
                onPress={() => setSelectedDate(day)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dateWeekday, active && styles.dateWeekdayActive]}>
                  {formatWeekday(day)}
                </Text>
                <Text style={[styles.dateNumber, active && styles.dateNumberActive]}>
                  {day.getDate()}
                </Text>
                <Text style={[styles.dateMonth, active && styles.dateMonthActive]}>
                  {formatMonth(day)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select time</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map((slot) => {
            const active = slot === selectedSlot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slot, active && styles.slotActive]}
                onPress={() => setSelectedSlot(slot)}
                activeOpacity={0.8}
              >
                <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Service address</Text>
        {addresses.length === 0 ? (
          <View style={styles.noAddress}>
            <View style={styles.noAddressIcon}>
              <Icon name="pin" size={20} color={colors.primary} />
            </View>
            <Text style={styles.noAddressText}>
              No saved address. Add one from your profile to continue.
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
                activeOpacity={0.8}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
                <View style={styles.addressContent}>
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
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>₹{service.price}</Text>
        </View>
        <View style={styles.footerButton}>
          <Button
            title="Confirm booking"
            loading={createBooking.isPending}
            disabled={!selectedAddressId}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 130,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  summaryContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  summaryName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  summaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  summaryMetaText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  summaryPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  datesRow: {
    gap: spacing.xs,
    paddingRight: spacing.xl,
  },
  dateCard: {
    width: 62,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dateCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  dateWeekday: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateWeekdayActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  dateNumber: {
    ...typography.h3,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  dateNumberActive: {
    color: colors.textWhite,
  },
  dateMonth: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  dateMonthActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  slot: {
    width: '31.5%',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  slotActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primary,
  },
  slotText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  slotTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  noAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noAddressIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAddressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  addressCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  addressContent: {
    flex: 1,
  },
  addressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
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
    fontWeight: '700',
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerPrice: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  footerButton: {
    width: 190,
  },
});
