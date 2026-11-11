import { TouchableOpacity, View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { Icon } from './common/Icon';
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
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, variant === 'featured' && styles.featuredImage]}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="sparkles" size={40} color={colors.primary} />
          </View>
        )}
        {service.avgRating > 0 && (
          <View style={styles.ratingPill}>
            <Icon name="star" size={11} color={colors.accentDark} strokeWidth={1.5} />
            <Text style={styles.ratingPillText}>{service.avgRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{service.price}</Text>
          {service.durationMins > 0 && (
            <View style={styles.durationRow}>
              <Icon name="clock" size={12} color={colors.textTertiary} strokeWidth={2} />
              <Text style={styles.duration}>{service.durationMins} min</Text>
            </View>
          )}
        </View>
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
    height: 118,
    backgroundColor: colors.primaryBg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredImage: {
    height: 118,
    width: 118,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingPill: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  ratingPillText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
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
    marginTop: 2,
    minHeight: 32,
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
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  duration: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
