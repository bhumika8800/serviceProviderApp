import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { completeProfile } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';
import { validateEmail, validatePincode } from '../../utils/validators';
import type { User } from '../../types';

export function CompleteProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in your name and email.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const hasAddress = line1.trim() || city.trim() || state.trim() || pincode.trim();
    if (hasAddress) {
      if (!line1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
        setError('Please complete all address fields or leave the address section empty.');
        return;
      }
      if (!validatePincode(pincode.trim())) {
        setError('Please enter a valid 6-digit pincode.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await completeProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        address: hasAddress
          ? {
              label: 'home',
              line1: line1.trim(),
              line2: line2.trim() || undefined,
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
              country: 'India',
            }
          : undefined,
      });
      const updated = (res as unknown as { data?: { user?: User } }).data?.user;
      if (updated) {
        setUser(updated);
        Alert.alert('Welcome!', 'Your profile is complete. You can now book services.', [
          { text: 'Continue' },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconBadge}>
              <Icon name="user" size={26} color={colors.primary} />
            </View>
            <Text style={styles.overline}>Almost there</Text>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Add a few details so we can personalise your experience{'\n'}
              <Text style={styles.phoneText}>{user?.phone}</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal details</Text>
              <Text style={styles.cardHint}>Required</Text>
            </View>
            <View style={styles.field}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="e.g. Aarav"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.field}>
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="e.g. Sharma"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.field}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Home address</Text>
              <Text style={styles.cardHint}>Optional</Text>
            </View>
            <View style={styles.field}>
              <Input
                label="Address Line 1"
                value={line1}
                onChangeText={setLine1}
                placeholder="House no, street"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.field}>
              <Input
                label="Address Line 2"
                value={line2}
                onChangeText={setLine2}
                placeholder="Area, landmark"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Input
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Bangalore"
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.halfField}>
                <Input
                  label="State"
                  value={state}
                  onChangeText={setState}
                  placeholder="e.g. Karnataka"
                  autoCapitalize="words"
                />
              </View>
            </View>
            <View style={styles.field}>
              <Input
                label="Pincode"
                value={pincode}
                onChangeText={(text) => setPincode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="6-digit pincode"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button title="Save & Continue" onPress={handleSubmit} loading={isSubmitting} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  overline: {
    ...typography.overline,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: spacing.xxs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  phoneText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  cardHint: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  field: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
