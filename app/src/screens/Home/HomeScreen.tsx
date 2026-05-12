import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP } from '../../constants';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const res: any = await eventsApi.list();
      if (res.code === 200) {
        const now = new Date();
        const upcoming = res.data
          .filter((e: any) => new Date(e.eventDate) >= now || e.repeatType === 1)
          .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
          .slice(0, 10);
        setEvents(upcoming);
      }
    } catch (error) {
      console.error('加载纪念日失败', error);
    }
  };

  useFocusEffect(useCallback(() => { loadEvents(); }, []));

  const onRefresh = async () => { setRefreshing(true); await loadEvents(); setRefreshing(false); };

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const thisYear = now.getFullYear();
    let next = new Date(thisYear, eventDate.getMonth(), eventDate.getDate());
    if (next < now) next = new Date(thisYear + 1, eventDate.getMonth(), eventDate.getDate());
    return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('EventEdit', { eventId: item.id, mode: 'edit', event: item })}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventCategory}>{CATEGORY_MAP[item.category] || '其他'}</Text>
      </View>
      <View style={styles.eventFooter}>
        <Text style={styles.eventDate}>{item.eventDate}</Text>
        <Text style={styles.eventCountdown}>{getDaysUntil(item.eventDate)}天后</Text>
      </View>
      {item.relatedPerson ? <Text style={styles.eventPerson}>关联人: {item.relatedPerson}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E91E63']} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>暂无纪念日，点击右下角添加</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EventEdit', { mode: 'create' })}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16, paddingBottom: 80 },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  eventCategory: { fontSize: 12, color: '#E91E63', backgroundColor: '#FCE4EC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventDate: { fontSize: 14, color: '#666' },
  eventCountdown: { fontSize: 14, color: '#E91E63', fontWeight: '600' },
  eventPerson: { fontSize: 12, color: '#999', marginTop: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#E91E63', shadowOpacity: 0.3, shadowRadius: 8 },
  fabText: { fontSize: 30, color: '#fff', fontWeight: '300', marginTop: -2 },
});
