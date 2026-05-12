import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { notificationApi } from '../../api/notification';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const res: any = await notificationApi.list();
      if (res.code === 200) setNotifications(res.data);
    } catch (error) {
      console.error('加载通知失败', error);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const onRefresh = async () => { setRefreshing(true); await loadNotifications(); setRefreshing(false); };

  const handleMarkRead = async (id: number) => {
    try { await notificationApi.markAsRead(id); loadNotifications(); } catch (error) {}
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, item.isRead === 0 && styles.cardUnread]} onPress={() => handleMarkRead(item.id)}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E91E63']} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>暂无通知</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: '#E91E63' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E63' },
  cardContent: { fontSize: 14, color: '#666', lineHeight: 20 },
  cardTime: { fontSize: 12, color: '#999', marginTop: 8 },
  empty: { textAlign: 'center', color: '#999', marginTop: 60 },
});
