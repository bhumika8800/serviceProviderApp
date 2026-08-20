import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';
import { useAdminStats } from '../../hooks/useAdmin';
import { formatCurrency } from '../../utils/formatters';
import type { AdminStats } from '../../types';

export function AdminDashboardScreen() {
  const { data, isLoading } = useAdminStats();
  const stats = (data as unknown as { data?: AdminStats } | undefined)?.data;

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const bookings = stats?.bookingsByStatus ?? {};
  const bookingEntries = Object.entries(bookings);

  if (isLoading && !stats) {
    return <Loader fullScreen message="Loading dashboard…" />;
  }

  const summaryCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', color: colors.primaryBg },
    { label: 'Active Users', value: stats?.activeUsers ?? 0, icon: '🟢', color: colors.successBg },
    { label: 'Services', value: stats?.totalServices ?? 0, icon: '🛠️', color: colors.accentBg },
    {
      label: 'Revenue',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: '💰',
      color: colors.primaryBg,
    },
    {
      label: 'Open Complaints',
      value: stats?.openComplaints ?? 0,
      icon: '⚠️',
      color: colors.errorBg,
    },
    { label: 'Open Queries', value: stats?.openQueries ?? 0, icon: '💬', color: colors.accentBg },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Overview of your platform</Text>
        </View>

        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <View key={card.label} style={[styles.card, { backgroundColor: card.color }]}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={styles.cardLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookings by Status</Text>
          <View style={styles.statusCard}>
            {bookingEntries.length > 0 ? (
              bookingEntries.map(([status, count]) => (
                <View key={status} style={styles.statusRow}>
                  <Text style={styles.statusLabel}>{statusLabels[status] ?? status}</Text>
                  <View style={styles.statusBarTrack}>
                    <View
                      style={[
                        styles.statusBarFill,
                        {
                          width: `${Math.min((count / (stats?.totalUsers || 1)) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statusCount}>{count}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No bookings yet</Text>
            )}
          </View>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    width: '47%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardValue: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  statusCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
    ...shadows.sm,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    width: 80,
  },
  statusBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  statusBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  statusCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '700',
    width: 30,
    textAlign: 'right',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
});