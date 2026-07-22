import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import type { RootStackParamList } from '../../navigation/types';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <View style={styles.logoInner} />
            </View>
            <Text style={styles.brandName}>ServiceProvider</Text>
          </View>

          <Text style={styles.tagline}>
            Your trusted home service partner
          </Text>

          <View style={styles.featuresRow}>
            {['Reliable', 'Affordable', 'Trusted'].map((feature) => (
              <View key={feature} style={styles.featurePill}>
                <Text style={styles.featurePillText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Login')}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Already have an account? </Text>
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Log in
            </Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  logoInner: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  brandName: {
    ...typography.h1,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  featurePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accentBg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  featurePillText: {
    ...typography.bodySmall,
    color: colors.accentDark,
    fontWeight: '600',
  },
  ctaSection: {
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginHint: {
    ...typography.body,
    color: colors.textTertiary,
  },
  loginLink: {
    ...typography.body,
    color: colors.textLink,
    fontWeight: '600',
  },
});
