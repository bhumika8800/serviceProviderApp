import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import {
  GOOGLE_SIGN_IN_CANCELLED,
  sendOtp,
  signInWithGoogle,
} from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';
import { validatePhone } from '../../utils/validators';
import type { RootStackParamList } from '../../navigation/types';
import type { LoginResponse } from '../../types';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const login = useAuthStore((state) => state.login);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const setLoading = useAuthStore((state) => state.setLoading);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isBusy = isSending || isGoogleLoading;

  const handlePhoneChange = (text: string) => {
    setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
    if (error) {
      setError('');
    }
  };

  const handleSendOtp = async () => {
    if (isBusy) {
      return;
    }
    setError('');

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const fullNumber = `+91${phone}`;
    setIsSending(true);
    setLoading(true);

    try {
      await sendOtp(fullNumber);
      navigation.navigate('Otp', { phoneNumber: fullNumber });
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    if (isBusy) {
      return;
    }
    loginAsGuest();
  };

  const handleGoogleSignIn = async () => {
    if (isBusy) {
      return;
    }
    setIsGoogleLoading(true);
    setLoading(true);

    try {
      const firebaseIdToken = await signInWithGoogle();
      const { data } = await apiClient.post<LoginResponse>('/auth/verify', {
        idToken: firebaseIdToken,
      });
      login(data.user, data.token);
    } catch (err: any) {
      if (err?.message !== GOOGLE_SIGN_IN_CANCELLED) {
        Alert.alert(
          'Google Sign-In Failed',
          err?.message || 'An error occurred during Google sign-in.'
        );
      }
    } finally {
      setIsGoogleLoading(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Icon name="sparkles" size={20} color={colors.textWhite} />
            </View>
            <Text style={styles.brandName}>ServiceProvider</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to book trusted home services in minutes.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Continue with mobile</Text>
            <Text style={styles.cardSubtitle}>
              We'll text you a 6-digit verification code.
            </Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <View style={styles.phoneInput}>
                <Input
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={error}
                  autoFocus
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  returnKeyType="done"
                  onSubmitEditing={handleSendOtp}
                  editable={!isBusy}
                />
              </View>
            </View>

            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              loading={isSending}
              disabled={phone.length < 10 || isGoogleLoading}
            />

            <View style={styles.secureRow}>
              <Icon name="check" size={13} color={colors.success} strokeWidth={2.4} />
              <Text style={styles.secureText}>Your number stays private and secure</Text>
            </View>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Sign in with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            loading={isGoogleLoading}
            disabled={isSending}
          />

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestSignIn}
            disabled={isBusy}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as guest</Text>
            <Icon name="chevron-right" size={14} color={colors.primary} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
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
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xxl,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  countryCode: {
    height: 52,
    width: 64,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  phoneInput: {
    flex: 1,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  secureText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  guestText: {
    ...typography.button,
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
});
