import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography } from '../../utils/constants';
import { useService } from '../../hooks/useServices';
import { Loader } from '../../components/common/Loader';
import { Button } from '../../components/common/Button';
import type { RootStackParamList } from '../../navigation/types';
import type { ApiResponse, Service } from '../../types';

type DetailRoute = RouteProp<RootStackParamList, 'ServiceDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export function ServiceDetailScreen() {
  const navigation = useNavigation<DetailNavProp>();
  const route = useRoute<DetailRoute>();
  const { serviceId } = route.params;

  const { data, isLoading, isError } = useService(serviceId);
  const service = (data as ApiResponse<Service> | undefined)?.data;

  if (isLoading) {
    return <Loader fullScreen message="Loading service details…" />;
  }

  if (isError || !service) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  const imageUrl = service.images.length > 0 ? service.images[0] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>📷</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{service.name}</Text>
          {service.avgRating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{service.avgRating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.meta}>
          {service.durationMins} min{service.reviewCount > 0 ? ` · ${service.reviewCount} reviews` : ''}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{service.price}</Text>
        </View>

        <Text style={styles.sectionTitle}>About this service</Text>
        <Text style={styles.description}>{service.description}</Text>

        {service.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {service.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Book Now"
            onPress={() => navigation.navigate('Booking', { serviceId: service.id })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  imageContainer: {
    height: 240,
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
  imageIcon: {
    fontSize: 64,
  },
  body: {
    padding: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.md,
  },
  ratingStar: {
    color: colors.accent,
    marginRight: 2,
  },
  ratingText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  priceRow: {
    marginTop: spacing.md,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: '700',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    marginTop: spacing.xxl,
  },
});