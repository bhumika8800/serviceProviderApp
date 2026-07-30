import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onPress: (serviceId: string) => void;
  variant?: 'default' | 'featured';
}

export function ServiceCard({ service, onPress, variant = 'default' }: ServiceCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, variant === 'featured' && styles.featuredCard]}
      onPress={() => onPress(service.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.imagePlaceholder, variant === 'featured' && styles.featuredImage]}>
        <Text style={styles.imageIcon}>
          {service.name === 'Home Cleaning' ? '🧹' :
           service.name === 'Plumbing' ? '🔧' :
           service.name === 'Electrical' ? '⚡' :
           service.name === 'Beauty & Wellness' ? '💅' :
           service.name === 'Appliance Repair' ? '🔨' :
           service.name === 'Painting' ? '🎨' : '⭐'}
        </Text>
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
  imagePlaceholder: {
    height: 110,
    backgroundColor: colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImage: {
    height: 110,
    width: 110,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
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