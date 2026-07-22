import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { sendOtp } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { RootStackParamList } from '../../navigation/types';

type LoginNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavProp>();
  const setLoading = useAuthStore((state) => state.setLoading);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const validatePhone = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '');
    return digits;
  };

  const handleSendOtp = async () => {
    setError('');

    const digits = phone.replace(/[^0-9]/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const fullNumber = `+91${digits}`;
    setIsSending(true);
    setLoading(true);

    try {
      await sendOtp(fullNumber);
      navigation.navigate('Otp', { phoneNumber: fullNumber });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
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
                onChangeText={(text) => setPhone(validatePhone(text))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={10}
                error={error}
                autoFocus
              />
            </View>
          </View>

          <Button
            title="Send OTP"
            onPress={handleSendOtp}
            loading={isSending}
            disabled={phone.length < 10}
          />
        </View>

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
