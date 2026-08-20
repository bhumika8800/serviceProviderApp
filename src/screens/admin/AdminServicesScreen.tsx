import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { listServices, updateService } from '../../services/servicesCatalog';
import { formatCurrency } from '../../utils/formatters';
import type { RootStackParamList } from '../../navigation/types';
import type { PaginatedResponse, Service } from '../../types';

type AdminNavProp = NativeStackNavigationProp<RootStackParamList>;

export function AdminServicesScreen() {
  const navigation = useNavigation<AdminNavProp>();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'services', page],
    queryFn: () => listServices({ page, limit: 20 }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateService(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'services'] }),
  });

  const response = data as PaginatedResponse<Service> | undefined;
  const services: Service[] = response?.data ?? [];
  const totalPages = response?.pagination?.totalPages ?? 1;

  const handleToggle = (service: Service) => {
    const action = service.isActive ? 'deactivate' : 'activate';
    Alert.alert(
      `${action === 'deactivate' ? 'Deactivate' : 'Activate'} "${service.name}"?`,
      action === 'deactivate'
        ? 'Deactivated services are hidden from customers.'
        : 'The service will be visible to customers again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'deactivate' ? 'Deactivate' : 'Activate',
          style: action === 'deactivate' ? 'destructive' : 'default',
          onPress: () => toggleActive.mutate({ id: service.id, isActive: !service.isActive }),
        },
      ],
    );
  };

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <View style={styles.serviceInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.name}
          </Text>
          {!item.isActive && <View style={styles.inactiveBadge}><Text style={styles.inactiveBadgeText}>Inactive</Text></View>}
        </View>
        <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
        <Text style={styles.serviceMeta}>
          {item.durationMins} min{item.durationMins === 1 ? '' : 's'} · {item.reviewCount} review{item.reviewCount === 1 ? '' : 's'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.toggleButton, !item.isActive && styles.toggleButtonActive]}
        onPress={() => handleToggle(item)}
      >
        <Text style={[styles.toggleButtonText, !item.isActive && styles.toggleButtonTextActive]}>
          {item.isActive ? 'Deactivate' : 'Activate'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>

      {isLoading && services.length === 0 ? (
        <Loader fullScreen />
      ) : services.length === 0 ? (
        <EmptyState title="No services found" message="Services added by the team will appear here." />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderService}
          onEndReached={() => {
            if (page < totalPages) setPage((p) => p + 1);
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  serviceName: {
    ...typography.h4,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  inactiveBadge: {
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
    fontSize: 10,
  },
  servicePrice: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  serviceMeta: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
  },
  toggleButton: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorBg,
  },
  toggleButtonActive: {
    backgroundColor: colors.successBg,
  },
  toggleButtonText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '700',
  },
  toggleButtonTextActive: {
    color: colors.success,
  },
});