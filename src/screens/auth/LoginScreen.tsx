import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>ServiceProvider</Text>
          <Text style={styles.subtitle}>
            Log in with your phone number to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.phoneInput}>
              <Input
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Enter phone number"
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

        <Button
          title="Sign in as Guest"
          onPress={handleGuestSignIn}
          variant="ghost"
          disabled={isBusy}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
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
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  appName: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.lg,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  countryCode: {
    height: 48,
    width: 64,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
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
  footer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: colors.textLink,
    textDecorationLine: 'underline',
  },
});
