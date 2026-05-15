import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP } from '../../constants';
import { Theme, getCategoryColor } from '../../theme';
import { useToast } from '../../components/Toast';
import { getErrorMessage } from '../../utils/validation';

export default function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const loadEvents = async (showError = false) => {
    try {
      const res: any = await eventsApi.list();
      if (res.code === 200) {
        const now = new Date();
        const upcoming = res.data
          .filter((e: any) => new Date(e.eventDate) >= now || e.repeatType === 1)
          .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
          .slice(0, 10);
        setEvents(upcoming);
      } else if (showError) {
        toast.error(res.message || '加载失败');
      }
    } catch (error) {
      if (showError) toast.error(getErrorMessage(error));
    }
  };

  useFocusEffect(useCallback(() => { loadEvents(true); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents(true);
    setRefreshing(false);
  };

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const thisYear = now.getFullYear();
    let next = new Date(thisYear, eventDate.getMonth(), eventDate.getDate());
    if (next < now) next = new Date(thisYear + 1, eventDate.getMonth(), eventDate.getDate());
    return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderItem = ({ item }: { item: any }) => {
    const catColor = getCategoryColor(item.category);
    const days = getDaysUntil(item.eventDate);

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
          <View style={styles.eventFooter}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventDate}>{item.eventDate}</Text>
              {item.relatedPerson ? (
                <Text style={styles.eventPerson}>{item.relatedPerson}</Text>
              ) : null}
            </View>
            <View style={styles.countdownContainer}>
              <Text style={[styles.countdownNumber, { textShadowColor: catColor }]}>{days}</Text>
              <Text style={styles.countdownLabel}>天后</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>✦</Text>
      <Text style={styles.emptyTitle}>暂无纪念日</Text>
      <Text style={styles.emptySubtitle}>点击右下角添加你的第一个纪念日</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerDecor} />
        <Text style={styles.headerTitle}>即将到来</Text>
        <Text style={styles.headerSubtitle}>你的重要纪念日</Text>
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
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: Theme.spacing.md,
  },
  headerDecor: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 100,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.65)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
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
    marginBottom: Theme.spacing.sm + 2,
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
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  eventInfo: {
    flex: 1,
  },
  eventDate: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  eventPerson: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  countdownContainer: {
    alignItems: 'center',
    paddingLeft: Theme.spacing.sm,
  },
  countdownNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: Theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    lineHeight: 48,
  },
  countdownLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.accent,
    fontWeight: '600',
    marginTop: -4,
    letterSpacing: 1,
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
