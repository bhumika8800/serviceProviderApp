import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { useService } from '../../hooks/useServices';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Service } from '../../types';

type DetailRoute = RouteProp<RootStackParamList, 'ServiceDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export function ServiceDetailScreen() {
  const navigation = useNavigation<DetailNavProp>();
  const route = useRoute<DetailRoute>();
  const insets = useSafeAreaInsets();
  const { serviceId } = route.params;

  const { data, isLoading, isError } = useService(serviceId);
  const service = (data as ApiResponse<Service> | undefined)?.data;

  if (isLoading) {
    return <Loader fullScreen message="Loading service details…" />;
  }

  if (isError || !service) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Icon name="alert" size={28} color={colors.error} />
        </View>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  const imageUrl = service.images.length > 0 ? service.images[0] : null;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="sparkles" size={64} color={colors.primary} strokeWidth={1.6} />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{service.name}</Text>
          </View>

          <View style={styles.metaRow}>
            {service.avgRating > 0 && (
              <View style={styles.ratingBadge}>
                <Icon name="star" size={13} color={colors.accentDark} strokeWidth={1.5} />
                <Text style={styles.ratingText}>{service.avgRating.toFixed(1)}</Text>
                {service.reviewCount > 0 && (
                  <Text style={styles.reviewText}>({service.reviewCount})</Text>
                )}
              </View>
            )}
            {service.durationMins > 0 && (
              <View style={styles.metaPill}>
                <Icon name="clock" size={13} color={colors.textSecondary} strokeWidth={2} />
                <Text style={styles.metaText}>{service.durationMins} min</Text>
              </View>
            )}
          </View>

          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.price}>₹{service.price}</Text>
            </View>
            <View style={styles.priceIcon}>
              <Icon name="card" size={22} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>About this service</Text>
          <Text style={styles.description}>{service.description}</Text>

          {service.tags.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>What's included</Text>
              <View style={styles.tagsContainer}>
                {service.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Icon name="check" size={12} color={colors.success} strokeWidth={2.6} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.trustNote}>
            <View style={styles.trustIcon}>
              <Icon name="check" size={16} color={colors.success} strokeWidth={2.6} />
            </View>
            <Text style={styles.trustText}>
              Verified professionals, transparent pricing and a satisfaction guarantee on every
              booking.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, spacing.md) },
        ]}
      >
        <View>
          <Text style={styles.footerLabel}>Total price</Text>
          <Text style={styles.footerPrice}>₹{service.price}</Text>
        </View>
        <View style={styles.footerButton}>
          <Button
            title="Book now"
            onPress={() => navigation.navigate('Booking', { serviceId: service.id })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  imageContainer: {
    height: 260,
    backgroundColor: colors.primaryBg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: spacing.xl,
    marginTop: -spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accentBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  reviewText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  price: {
    ...typography.h2,
    color: colors.primary,
    marginTop: 2,
  },
  priceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tagsContainer: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tagText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  trustNote: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.successBg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  trustIcon: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerPrice: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  footerButton: {
    width: 180,
  },
});
