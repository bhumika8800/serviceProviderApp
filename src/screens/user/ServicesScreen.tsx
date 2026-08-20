import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { ServiceCard } from '../../components/ServiceCard';
import { useCategories, useServices } from '../../hooks/useServices';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Category, Service } from '../../types';

type ServicesNavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');
const HORIZONTAL_PADDING = spacing.xl;
const CARD_GAP = spacing.sm;
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Services</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === null && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === null && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categoriesLoading ? (
              <View style={styles.loadingChips}>
                <Text style={styles.categoryChipText}>Loading…</Text>
              </View>
            ) : (
              categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.id && styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id,
                    )
                  }
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category.id && styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.servicesScroll}
          contentContainerStyle={styles.servicesContent}
          showsVerticalScrollIndicator={false}
        >
          {servicesLoading ? (
            <View style={styles.loadingGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.skeletonCard, { width: CARD_WIDTH }]}>
                  <View style={styles.skeletonImage} />
                  <View style={styles.skeletonContent}>
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
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
              <Text style={styles.emptyIcon}>
                {searchQuery ? '🔍' : '📋'}
              </Text>
              <Text style={styles.emptyTitle}>
                {searchQuery
                  ? 'No services found'
                  : 'No services available'}
              </Text>
              <Text style={styles.emptyMessage}>
                {searchQuery
                  ? 'Try adjusting your search or filter'
                  : 'Check back later for new services'}
              </Text>
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.bottomSpace} />
        </ScrollView>
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
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  cardOverride: {
    width: CARD_WIDTH,
    marginRight: 0,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textTertiary,
    paddingLeft: spacing.xs,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  loadingChips: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  skeletonCard: {
    height: 210,
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
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.textWhite,
  },
  servicesScroll: {
    flex: 1,
  },
  servicesContent: {
    padding: spacing.xl,
    paddingBottom: 0,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
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
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  clearSearchText: {
    ...typography.button,
    color: colors.primary,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
