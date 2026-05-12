import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP } from '../../constants';

const categories = [
  { value: null, label: '全部' },
  { value: 1, label: '生日' },
  { value: 2, label: '纪念日' },
  { value: 3, label: '节日' },
  { value: 4, label: '自定义' },
];

export default function EventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const res: any = await eventsApi.list(activeCategory ?? undefined);
      if (res.code === 200) setEvents(res.data);
    } catch (error) {
      console.error('加载纪念日失败', error);
    }
  };

  useFocusEffect(useCallback(() => { loadEvents(); }, [activeCategory]));

  const onRefresh = async () => { setRefreshing(true); await loadEvents(); setRefreshing(false); };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('EventEdit', { eventId: item.id, mode: 'edit', event: item })}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventCategory}>{CATEGORY_MAP[item.category] || '其他'}</Text>
      </View>
      <Text style={styles.eventDate}>{item.eventDate}</Text>
      {item.relatedPerson ? <Text style={styles.eventPerson}>关联人: {item.relatedPerson}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.label} style={[styles.tab, activeCategory === cat.value && styles.tabActive]} onPress={() => setActiveCategory(cat.value)}>
            <Text style={[styles.tabText, activeCategory === cat.value && styles.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E91E63']} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>暂无纪念日</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('EventEdit', { mode: 'create' })}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#E91E63' },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#E91E63', fontWeight: '600' },
  list: { padding: 16, paddingBottom: 80 },
  eventCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  eventCategory: { fontSize: 12, color: '#E91E63', backgroundColor: '#FCE4EC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  eventDate: { fontSize: 14, color: '#666' },
  eventPerson: { fontSize: 12, color: '#999', marginTop: 4 },
  empty: { textAlign: 'center', color: '#999', marginTop: 60 },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#E91E63', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  fabText: { fontSize: 30, color: '#fff', fontWeight: '300', marginTop: -2 },
});
