import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { verifyOtp, sendOtp, clearConfirmationResult } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';
import type { RootStackParamList } from '../../navigation/types';
import type { LoginResponse } from '../../types';

type OtpRouteProp = RouteProp<RootStackParamList, 'Otp'>;
type OtpNavProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;

const RESEND_COOLDOWN = 30;
const OTP_LENGTH = 6;

export function OtpScreen() {
  const route = useRoute<OtpRouteProp>();
  const navigation = useNavigation<OtpNavProp>();
  const { phoneNumber } = route.params;
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }
    const timeout = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [resendCooldown]);

  const handleOtpChange = (text: string) => {
    setOtp(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH));
    if (error) {
      setError('');
    }
  };

  const handleVerifyOtp = async () => {
    if (isVerifying) {
      return;
    }
    setError('');

    if (otp.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setLoading(true);

    try {
      const idToken = await verifyOtp(otp);
      const { data } = await apiClient.post<LoginResponse>('/auth/verify', {
        idToken,
      });
      login(data.user, data.token);
    } catch (err: any) {
      setError(err?.message || 'Failed to verify OTP.');
    } finally {
      setIsVerifying(false);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsResending(true);

    try {
      clearConfirmationResult();
      await sendOtp(phoneNumber);
      setResendCooldown(RESEND_COOLDOWN);
      setOtp('');
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith('+91') && phone.length === 13) {
      return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
    }
    return phone;
  };

  const canResend = resendCooldown === 0 && !isResending && !isVerifying;
  const activeIndex = Math.min(otp.length, OTP_LENGTH - 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Icon name="message" size={26} color={colors.primary} />
          </View>
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneText}>{formatPhone(phoneNumber)}</Text>
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.otpWrapper}>
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const filled = index < otp.length;
                const isActive = index === activeIndex && !error;
                return (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      filled && styles.otpBoxFilled,
                      isActive && styles.otpBoxActive,
                      error ? styles.otpBoxError : null,
                    ]}
                  >
                    <Text style={styles.otpDigit}>{otp[index] ?? ''}</Text>
                  </View>
                );
              })}
            </View>
            <TextInput
              style={styles.hiddenInput}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              autoFocus
              autoComplete="sms-otp"
              textContentType="oneTimeCode"
              returnKeyType="done"
              onSubmitEditing={handleVerifyOtp}
              editable={!isVerifying}
              caretHidden
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Verify & Continue"
            onPress={handleVerifyOtp}
            loading={isVerifying}
            disabled={otp.length < OTP_LENGTH}
          />
        </View>

        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
              <Text style={styles.resendLink}>
                {isResending ? 'Sending…' : 'Resend code'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.cooldownText}>Resend in {resendCooldown}s</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.changeNumber}
          onPress={() => navigation.goBack()}
          disabled={isVerifying}
          activeOpacity={0.7}
        >
          <Icon name="chevron-left" size={15} color={colors.textSecondary} strokeWidth={2.2} />
          <Text style={styles.changeNumberText}>Change phone number</Text>
        </TouchableOpacity>
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
    marginBottom: spacing.xl,
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
    gap: spacing.lg,
    ...shadows.md,
  },
  otpWrapper: {
    position: 'relative',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primaryBg,
  },
  otpBoxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  otpBoxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  otpDigit: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
    marginTop: -spacing.xs,
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xl,
  },
  resendText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  resendLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  cooldownText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  changeNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: spacing.lg,
  },
  changeNumberText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
