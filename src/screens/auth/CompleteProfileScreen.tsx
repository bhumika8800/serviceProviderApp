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
import { colors, spacing, typography } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={styles.subtitle}>
              Add a few details so we can personalise your experience{'\n'}
              <Text style={styles.phoneText}>{user?.phone}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Aarav"
              autoCapitalize="words"
            />
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="e.g. Sharma"
              autoCapitalize="words"
            />
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.sectionLabel}>Home Address (optional)</Text>
            <Input
              label="Address Line 1"
              value={line1}
              onChangeText={setLine1}
              placeholder="House no, street"
              autoCapitalize="words"
            />
            <Input
              label="Address Line 2 (optional)"
              value={line2}
              onChangeText={setLine2}
              placeholder="Area, landmark"
              autoCapitalize="words"
            />
            <Input
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Bangalore"
              autoCapitalize="words"
            />
            <Input
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="e.g. Karnataka"
              autoCapitalize="words"
            />
            <Input
              label="Pincode"
              value={pincode}
              onChangeText={(text) => setPincode(text.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="6-digit pincode"
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button title="Save & Continue" onPress={handleSubmit} loading={isSubmitting} />
          </View>
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
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  phoneText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  form: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
  },
});