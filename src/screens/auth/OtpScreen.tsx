import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { verifyOtp, sendOtp, clearConfirmationResult } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../services/apiClient';
import type { RootStackParamList } from '../../navigation/types';
import type { LoginResponse } from '../../types';

type OtpRouteProp = RouteProp<RootStackParamList, 'Otp'>;

const RESEND_COOLDOWN = 30;

export function OtpScreen() {
  const route = useRoute<OtpRouteProp>();
  const { phoneNumber } = route.params;
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resendCooldown]);

  const handleVerifyOtp = async () => {
    setError('');

    if (otp.length < 6) {
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
      setError(err.message || 'Failed to verify OTP.');
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
      setError(err.message || 'Failed to resend OTP.');
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

  const canResend = resendCooldown === 0 && !isResending;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneText}>{formatPhone(phoneNumber)}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            maxLength={6}
            error={error}
            autoFocus
          />

          <Button
            title="Verify OTP"
            onPress={handleVerifyOtp}
            loading={isVerifying}
            disabled={otp.length < 6}
          />
        </View>

        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <Button
              title="Resend OTP"
              onPress={handleResendOtp}
              variant="ghost"
              loading={isResending}
            />
          ) : (
            <Text style={styles.cooldownText}>
              Resend in {resendCooldown}s
            </Text>
          )}
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
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
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
    gap: spacing.lg,
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    flexWrap: 'wrap',
  },
  resendText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  cooldownText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
