import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { ServiceCard } from '../../components/ServiceCard';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { Chip } from '../../components/common/Chip';
import { Icon } from '../../components/common/Icon';
import { useCategories, useServices } from '../../hooks/useServices';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Category, Service } from '../../types';

type ServicesNavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');
const HORIZONTAL_PADDING = spacing.xl;
const CARD_GAP = spacing.md;
const CARD_WIDTH = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export function ServicesScreen() {
  const navigation = useNavigation<ServicesNavProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: servicesData, isLoading: servicesLoading } = useServices(
    selectedCategory ?? undefined,
  );

  const categories: Category[] = (categoriesData as ApiResponse<Category[]> | undefined)
    ?.data ?? [];

  const services = useMemo(() => {
    const fetchedServices: Service[] = (servicesData as ApiResponse<Service[]> | undefined)
      ?.data ?? [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return fetchedServices.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return fetchedServices;
  }, [searchQuery, servicesData]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader title="Services" subtitle="Find the right help for your home" />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search services…"
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          <Chip
            label="All"
            active={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
          />
          {categoriesLoading ? (
            <View style={styles.loadingChips}>
              <Text style={styles.loadingChipsText}>Loading…</Text>
            </View>
          ) : (
            categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                active={selectedCategory === category.id}
                onPress={() =>
                  setSelectedCategory(selectedCategory === category.id ? null : category.id)
                }
              />
            ))
          )}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.servicesScroll}
        contentContainerStyle={styles.servicesContent}
        showsVerticalScrollIndicator={false}
      >
        {!servicesLoading && (
          <Text style={styles.resultCount}>
            {services.length} {services.length === 1 ? 'service' : 'services'} available
          </Text>
        )}

        {servicesLoading ? (
          <View style={styles.servicesGrid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={[styles.skeletonCard, { width: CARD_WIDTH }]}>
                <View style={styles.skeletonImage} />
                <View style={styles.skeletonContent}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
                  <View style={styles.skeletonLinePrice} />
                </View>
              </View>
            ))}
          </View>
        ) : services.length > 0 ? (
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={(id: string) =>
                  navigation.navigate('ServiceDetail', { serviceId: id })
                }
                style={styles.cardOverride}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Icon
                name={searchQuery ? 'search' : 'sparkles'}
                size={30}
                color={colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No services found' : 'No services available'}
            </Text>
            <Text style={styles.emptyMessage}>
              {searchQuery
                ? 'Try adjusting your search or pick another category.'
                : 'Check back later for new services.'}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
                activeOpacity={0.8}
              >
                <Text style={styles.clearSearchText}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  categoriesRow: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  loadingChips: {
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  loadingChipsText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  servicesScroll: {
    flex: 1,
  },
  servicesContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  resultCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardOverride: {
    width: CARD_WIDTH,
    marginRight: 0,
    marginBottom: 0,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  skeletonImage: {
    height: 118,
    backgroundColor: colors.surfaceAlt,
  },
  skeletonContent: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconWrap: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  clearSearchButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  clearSearchText: {
    ...typography.button,
    color: colors.textWhite,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});
