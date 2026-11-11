import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import type { RootStackParamList } from '../../navigation/types';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const highlights = ['Verified pros', 'Fair pricing', 'On-time service'];

export function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.brandMark}>
            <Icon name="sparkles" size={20} color={colors.textWhite} />
          </View>
          <Text style={styles.brandName}>ServiceProvider</Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.illustration}>
            <View style={styles.blobLarge} />
            <View style={styles.blobSmall} />
            <View style={styles.heroCard}>
              <View style={styles.heroIcon}>
                <Icon name="home" size={42} color={colors.primary} />
              </View>
              <Text style={styles.heroCardTitle}>Home services</Text>
              <Text style={styles.heroCardSubtitle}>Verified pros, at your door</Text>
            </View>
            <View style={[styles.floatingBadge, styles.floatingTop]}>
              <Icon name="check" size={14} color={colors.success} strokeWidth={2.4} />
              <Text style={styles.floatingText}>Verified pros</Text>
            </View>
            <View style={[styles.floatingBadge, styles.floatingBottom]}>
              <Icon name="clock" size={14} color={colors.accentDark} strokeWidth={2.2} />
              <Text style={styles.floatingText}>Book in 60s</Text>
            </View>
          </View>

          <Text style={styles.title}>Home services,{'\n'}made simple.</Text>
          <Text style={styles.tagline}>
            Cleaning, repairs, beauty and more — booked in a few taps.
          </Text>

          <View style={styles.featuresRow}>
            {highlights.map((feature) => (
              <View key={feature} style={styles.featurePill}>
                <Text style={styles.featurePillText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Button title="Get Started" onPress={() => navigation.navigate('Login')} />
          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>Already have an account? </Text>
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
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
  heroSection: {
    flex: 1,
    justifyContent: 'center',
  },
  illustration: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  blobLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primaryBg,
  },
  blobSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accentBg,
    right: 10,
    top: 18,
  },
  heroCard: {
    width: 190,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.lg,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  heroCardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  heroCardSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  floatingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  floatingTop: {
    top: 24,
    left: 0,
  },
  floatingBottom: {
    bottom: 28,
    right: 0,
  },
  floatingText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  featurePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featurePillText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  ctaSection: {
    paddingBottom: spacing.xxl,
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
    color: colors.primary,
    fontWeight: '700',
  },
});
