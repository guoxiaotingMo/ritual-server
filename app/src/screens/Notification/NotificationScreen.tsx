import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { notificationApi } from '../../api/notification';
import { Theme } from '../../theme';
import { useToast } from '../../components/Toast';
import { getErrorMessage } from '../../utils/validation';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const loadNotifications = async (showError = false) => {
    try {
      const res: any = await notificationApi.list();
      if (res.code === 200) setNotifications(res.data);
      else if (showError) toast.error(res.message || '加载失败');
    } catch (error) {
      if (showError) toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => { loadNotifications(true); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications(true);
    setRefreshing(false);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      toast.success('已标为已读');
      loadNotifications();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, item.isRead === 0 && styles.cardUnread]}
      onPress={() => handleMarkRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.isRead === 0 && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.cardContent}>{item.content}</Text>
      <Text style={styles.cardTime}>{item.createdAt}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Theme.colors.primary]}
            tintColor={Theme.colors.primary}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>暂无通知</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  list: {
    padding: Theme.spacing.md,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.card,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  cardTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Theme.colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  cardContent: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  cardTime: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.md,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: Theme.colors.textMuted,
    marginTop: 60,
    fontSize: Theme.fontSize.md,
  },
});
