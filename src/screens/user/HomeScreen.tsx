import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { ServiceCard } from '../../components/ServiceCard';
import { Avatar } from '../../components/common/Avatar';
import { Icon } from '../../components/common/Icon';
import type { IconName } from '../../components/common/Icon';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useCategories, useServices } from '../../hooks/useServices';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserTabParamList, RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Category, Service } from '../../types';

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<UserTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const fallbackCategories = ['Cleaning', 'Repairs', 'Beauty', 'Appliances', 'Painting', 'More'];

const trustStats = [
  { value: '4.8', label: 'Avg rating' },
  { value: '10k+', label: 'Bookings' },
  { value: '100%', label: 'Verified' },
];

function categoryIcon(name: string): IconName {
  const value = name.toLowerCase();
  if (value.includes('clean')) {
    return 'sparkles';
  }
  if (value.includes('beaut') || value.includes('salon') || value.includes('spa')) {
    return 'star';
  }
  if (value.includes('paint')) {
    return 'grid';
  }
  if (value.includes('appliance') || value.includes('repair') || value.includes('electric')) {
    return 'settings';
  }
  return 'home';
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const user = useAuthStore((state) => state.user);

  const { data: categoriesData } = useCategories();
  const { data: servicesData, isLoading } = useServices();

  const categories: Category[] =
    (categoriesData as ApiResponse<Category[]> | undefined)?.data ?? [];
  const services: Service[] =
    (servicesData as ApiResponse<Service[]> | undefined)?.data ?? [];

  const topCategories = categories.filter((category) => !category.parentId).slice(0, 6);
  const displayCategories =
    topCategories.length > 0
      ? topCategories.map((category) => ({ id: category.id, name: category.name }))
      : fallbackCategories.map((name) => ({ id: name, name }));

  const firstName = user?.firstName?.trim();
  const defaultAddress = user?.addresses?.find((address) => address.isDefault) ?? user?.addresses?.[0];
  const locationLabel = defaultAddress
    ? `${defaultAddress.label} · ${defaultAddress.city}`
    : 'Set your location';

  const handleSupport = () => {
    Alert.alert('Support', 'Our team is available at +91 1800-123-4567.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {getGreeting()}
              {firstName ? `, ${firstName}` : ''}
            </Text>
            <Text style={styles.headerTitle}>What do you need today?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Icon name="bell" size={20} color={colors.textPrimary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <Avatar
              uri={user?.avatar}
              name={firstName ? `${firstName} ${user?.lastName ?? ''}` : 'Guest User'}
              size={44}
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Icon name="pin" size={15} color={colors.primary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationLabel}
          </Text>
          <Icon name="chevron-down" size={13} color={colors.textTertiary} strokeWidth={2.2} />
        </TouchableOpacity>

        <SearchBar
          placeholder="Search for cleaning, repairs, beauty…"
          editable={false}
          onPress={() => navigation.navigate('Services')}
        />

        <View style={styles.promo}>
          <View style={styles.promoBlobOne} />
          <View style={styles.promoBlobTwo} />
          <View style={styles.promoContent}>
            <View style={styles.promoTag}>
              <Icon name="sparkles" size={12} color={colors.accent} />
              <Text style={styles.promoTagText}>Special offer</Text>
            </View>
            <Text style={styles.promoTitle}>Get 20% off your{'\n'}first booking</Text>
            <View style={styles.promoCodeRow}>
              <Text style={styles.promoCodeLabel}>Use code</Text>
              <View style={styles.promoCodeBadge}>
                <Text style={styles.promoCode}>FIRST20</Text>
              </View>
            </View>
          </View>
          <View style={styles.promoIconWrap}>
            <Icon name="sparkles" size={54} color="rgba(255,255,255,0.9)" strokeWidth={1.4} />
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Categories"
            actionLabel="See all"
            onAction={() => navigation.navigate('Services')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {displayCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Services')}
                activeOpacity={0.75}
              >
                <View style={styles.categoryIcon}>
                  <Icon
                    name={categoryIcon(category.name)}
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Popular services"
            subtitle="Handpicked for your home"
            actionLabel="See all"
            onAction={() => navigation.navigate('Services')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesRow}
          >
            {isLoading ? (
              [1, 2, 3].map((item) => (
                <View key={item} style={styles.skeletonCard}>
                  <View style={styles.skeletonImage} />
                  <View style={styles.skeletonBody}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
                    <View style={styles.skeletonLinePrice} />
                  </View>
                </View>
              ))
            ) : services.length > 0 ? (
              services.slice(0, 6).map((service) => (
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
          <View style={styles.statsCard}>
            {trustStats.map((stat, index) => (
              <View
                key={stat.label}
                style={[styles.statItem, index < trustStats.length - 1 && styles.statDivider]}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.helpCard} onPress={handleSupport} activeOpacity={0.8}>
            <View style={styles.helpIcon}>
              <Icon name="message" size={22} color={colors.primary} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need a hand?</Text>
              <Text style={styles.helpSubtitle}>Chat with our support team, 7am–10pm</Text>
            </View>
            <View style={styles.helpArrow}>
              <Icon name="arrow-right" size={16} color={colors.primary} strokeWidth={2.2} />
            </View>
          </TouchableOpacity>
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
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
  },
  locationText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    maxWidth: 220,
    textTransform: 'capitalize',
  },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    ...shadows.md,
  },
  promoBlobOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
    right: -40,
    top: -60,
  },
  promoBlobTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    left: -30,
    bottom: -50,
  },
  promoContent: {
    flex: 1,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: spacing.xs,
  },
  promoTagText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
  },
  promoTitle: {
    ...typography.h3,
    color: colors.textWhite,
    lineHeight: 24,
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  promoCodeLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
  promoCodeBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  promoCode: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoIconWrap: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  categoryRow: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  categoryCard: {
    width: 82,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  servicesRow: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  skeletonCard: {
    width: 180,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.sm,
    ...shadows.sm,
  },
  skeletonImage: {
    height: 118,
    backgroundColor: colors.surfaceAlt,
  },
  skeletonBody: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  skeletonLine: {
    height: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  skeletonLineShort: {
    width: '70%',
  },
  skeletonLinePrice: {
    height: 14,
    width: '40%',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing.xs,
  },
  emptyServices: {
    width: 220,
    height: 120,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryBg,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  helpSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  helpArrow: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
