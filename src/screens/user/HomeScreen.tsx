import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { ServiceCard } from '../../components/ServiceCard';
import { useServices } from '../../hooks/useServices';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Service } from '../../types';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const steps = [
  {
    title: 'Select Service',
    description: 'Browse through our wide range of professional home services and choose what you need',
    icon: '📋',
  },
  {
    title: 'Choose Date & Time',
    description: 'Pick a convenient date and time slot that works best for your schedule',
    icon: '📅',
  },
  {
    title: 'Confirm Booking',
    description: 'Review your booking details and confirm with a single tap',
    icon: '✅',
  },
  {
    title: 'Service Completion',
    description: 'Get your service done by verified professionals with quality assurance',
    icon: '🏆',
  },
];

const benefits = [
  {
    title: 'Trusted Professionals',
    description: 'All service providers are verified, background-checked, and trained',
    icon: '🛡️',
    color: colors.primaryBg,
    iconBg: colors.primary,
  },
  {
    title: 'Affordable Pricing',
    description: 'Transparent pricing with no hidden charges. Pay only for what you need',
    icon: '💰',
    color: colors.accentBg,
    iconBg: colors.accentDark,
  },
  {
    title: 'Quality Service',
    description: '100% satisfaction guaranteed. We stand behind every service we provide',
    icon: '⭐',
    color: colors.successBg,
    iconBg: colors.success,
  },
  {
    title: 'Easy Booking',
    description: 'Book any service in just a few taps. Fast, simple, and hassle-free',
    icon: '⚡',
    color: colors.primaryBg,
    iconBg: colors.primaryLight,
  },
];

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { data: servicesData, isLoading } = useServices();
  const response = servicesData as ApiResponse<Service[]> | undefined;
  const services = response?.data ?? [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.brandName}>ServiceProvider</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTag}>Special Offer</Text>
            <Text style={styles.promoTitle}>Get 20% off</Text>
            <Text style={styles.promoSubtitle}>on your first booking</Text>
            <View style={styles.promoCodeRow}>
              <Text style={styles.promoLabel}>Use code: </Text>
              <Text style={styles.promoCode}>FIRST20</Text>
            </View>
          </View>
          <View style={styles.promoGraphic}>
            <Text style={styles.promoEmoji}>🏠</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredRow}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonLine} />
                      <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
                    </View>
                  </View>
                ))}
              </View>
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={(id: string) =>
                    navigation.navigate('ServiceDetail', { serviceId: id })
                  }
                />
              ))
            ) : (
              <View style={styles.emptyServices}>
                <Text style={styles.emptyText}>No services available yet</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How It Works</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Book a service in 4 easy steps
          </Text>
          <View style={styles.stepsGrid}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepIconContainer}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{index + 1}</Text>
                  </View>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
          </View>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={[styles.benefitCard, { backgroundColor: benefit.color }]}>
                <View style={[styles.benefitIconContainer, { backgroundColor: benefit.iconBg }]}>
                  <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Need Help?</Text>
          </View>
          <View style={styles.helpContainer}>
            <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
              <View style={[styles.helpIconContainer, { backgroundColor: colors.primaryBg }]}>
                <Text style={styles.helpIcon}>💬</Text>
              </View>
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Contact Support</Text>
                <Text style={styles.helpDescription}>
                  Get in touch with our support team
                </Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
              <View style={[styles.helpIconContainer, { backgroundColor: colors.accentBg }]}>
                <Text style={styles.helpIcon}>❓</Text>
              </View>
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>FAQ</Text>
                <Text style={styles.helpDescription}>
                  Find answers to common questions
                </Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helpCard} activeOpacity={0.7}>
              <View style={[styles.helpIconContainer, { backgroundColor: colors.successBg }]}>
                <Text style={styles.helpIcon}>📞</Text>
              </View>
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Customer Care</Text>
                <Text style={styles.helpDescription}>
                  +91 1800-123-4567
                </Text>
              </View>
              <Text style={styles.helpArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  brandName: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  promoBanner: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    ...shadows.lg,
  },
  promoContent: {
    flex: 1,
  },
  promoTag: {
    ...typography.overline,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promoTitle: {
    ...typography.h2,
    color: colors.textWhite,
    marginTop: spacing.xxs,
  },
  promoSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xxs,
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  promoLabel: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
  },
  promoCode: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  promoGraphic: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.md,
  },
  promoEmoji: {
    fontSize: 52,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    marginTop: -spacing.xs,
  },
  seeAll: {
    ...typography.body,
    color: colors.textLink,
    fontWeight: '600',
  },
  featuredRow: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xs,
  },
  loadingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skeletonCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  skeletonImage: {
    height: 110,
    backgroundColor: colors.border,
  },
  skeletonContent: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
  },
  skeletonLineShort: {
    width: '60%',
  },
  emptyServices: {
    width: 200,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  stepCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  stepIcon: {
    fontSize: 22,
  },
  stepBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBadgeText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 10,
  },
  stepTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  stepDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  benefitsContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  benefitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 20,
  },
  benefitContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  benefitTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  benefitDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  helpContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  helpIconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
  },
  helpContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  helpTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  helpDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  helpArrow: {
    ...typography.h3,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
