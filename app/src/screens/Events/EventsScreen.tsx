import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Platform, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP } from '../../constants';
import { Theme, getCategoryColor } from '../../theme';
import { useToast } from '../../components/Toast';
import { getErrorMessage } from '../../utils/validation';

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
  const toast = useToast();

  const loadEvents = async (showError = false) => {
    try {
      const res: any = await eventsApi.list(activeCategory ?? undefined);
      if (res.code === 200) setEvents(res.data);
      else if (showError) toast.error(res.message || '加载失败');
    } catch (error) {
      if (showError) toast.error(getErrorMessage(error));
    }
  };

  useFocusEffect(useCallback(() => { loadEvents(true); }, [activeCategory]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const catColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventEdit', { eventId: item.id, mode: 'edit', event: item })}
        activeOpacity={0.7}
      >
        <View style={[styles.accentLine, { backgroundColor: catColor }]} />
        <View style={styles.cardBody}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: catColor + '18', borderColor: catColor + '40' }]}>
              <Text style={[styles.categoryText, { color: catColor }]}>
                {CATEGORY_MAP[item.category] || '其他'}
              </Text>
            </View>
          </View>
          <View style={styles.eventMeta}>
            <Text style={styles.eventDate}>{item.eventDate}</Text>
            {item.relatedPerson ? (
              <Text style={styles.eventPerson}>{item.relatedPerson}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✦</Text>
      <Text style={styles.emptyTitle}>暂无纪念日</Text>
      <Text style={styles.emptySubtitle}>试试切换分类或添加新的纪念日</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            const catColor = cat.value ? getCategoryColor(cat.value) : Theme.colors.primary;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[
                  styles.tab,
                  isActive && { backgroundColor: catColor + '20', borderColor: catColor + '60' },
                ]}
                onPress={() => setActiveCategory(cat.value)}
                activeOpacity={0.7}
              >
                {isActive && <View style={[styles.tabGlow, { backgroundColor: catColor }]} />}
                <Text style={[styles.tabText, isActive && { color: catColor }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={events}
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
        ListEmptyComponent={renderEmpty}
      />
      <View style={styles.fabContainer}>
        <View style={styles.fabGlow1} />
        <View style={styles.fabGlow2} />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('EventEdit', { mode: 'create' })}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.06)',
    paddingTop: Platform.OS === 'ios' ? 52 : 40,
    paddingBottom: Theme.spacing.sm,
  },
  tabScrollContent: {
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    position: 'relative',
    overflow: 'hidden',
  },
  tabGlow: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
    opacity: 0.8,
  },
  tabText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.textMuted,
  },
  list: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    paddingBottom: 100,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.06)',
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadow.card,
  },
  accentLine: {
    width: 3,
    borderTopLeftRadius: Theme.radius.lg,
    borderBottomLeftRadius: Theme.radius.lg,
  },
  cardBody: {
    flex: 1,
    padding: Theme.spacing.md,
    paddingLeft: Theme.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: Theme.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.text,
    marginRight: Theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  eventPerson: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginLeft: Theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    color: Theme.colors.gold,
    marginBottom: Theme.spacing.md,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textMuted,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabGlow1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    opacity: 0.08,
  },
  fabGlow2: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Theme.colors.accent,
    opacity: 0.06,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadow.float,
  },
  fabIcon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
