import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, shadows } from '../../utils/constants';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Icon } from '../../components/common/Icon';
import type { IconName } from '../../components/common/Icon';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotifications';
import { formatDate } from '../../utils/formatters';
import type { NotificationsPayload } from '../../services/notificationService';
import type { Notification } from '../../types';

const typeIcons: Record<Notification['type'], IconName> = {
  booking: 'calendar',
  payment: 'card',
  complaint: 'alert',
  promotion: 'sparkles',
  system: 'bell',
};

export function NotificationsScreen() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const payload = (data as unknown as { data?: NotificationsPayload } | undefined)?.data;
  const notifications: Notification[] = payload?.notifications ?? [];
  const unreadCount = payload?.unreadCount ?? 0;

  const handlePress = (notification: Notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
        right={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={() => markAllRead.mutate()} activeOpacity={0.7}>
              <Text style={styles.markAll}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {isLoading ? (
        <Loader fullScreen />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications yet"
          message="You'll see booking updates, payment confirmations, and offers here."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const unread = !item.isRead;
            return (
              <TouchableOpacity
                style={[styles.card, unread && styles.cardUnread]}
                onPress={() => handlePress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, unread && styles.iconContainerUnread]}>
                  <Icon
                    name={typeIcons[item.type] ?? 'bell'}
                    size={20}
                    color={unread ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, unread && styles.titleUnread]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {unread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.message} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
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
  markAll: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardUnread: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primaryBg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  iconContainerUnread: {
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
  },
  titleUnread: {
    color: colors.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  message: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  date: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
