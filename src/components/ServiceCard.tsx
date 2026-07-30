import { TouchableOpacity, View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onPress: (serviceId: string) => void;
  variant?: 'default' | 'featured';
  style?: ViewStyle;
}

export function ServiceCard({ service, onPress, variant = 'default', style }: ServiceCardProps) {
  const imageUrl = service.images.length > 0 ? service.images[0] : null;

  return (
    <TouchableOpacity
      style={[styles.card, variant === 'featured' && styles.featuredCard, style]}
      onPress={() => onPress(service.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, variant === 'featured' && styles.featuredImage]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageIcon}>📷</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{service.price}</Text>
          {service.durationMins > 0 && (
            <Text style={styles.duration}>{service.durationMins} min</Text>
          )}
        </View>
        {service.avgRating > 0 && (
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{service.avgRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({service.reviewCount})</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    width: 180,
    marginRight: spacing.sm,
  },
  featuredCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: spacing.md,
    flexDirection: 'row',
  },
  imageContainer: {
    height: 110,
    backgroundColor: colors.primaryBg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredImage: {
    height: 110,
    width: 110,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 36,
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '700',
  },
  duration: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
  },
  star: {
    color: colors.accent,
    fontSize: 14,
    marginRight: 2,
  },
  rating: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  reviewCount: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 2,
  },
});