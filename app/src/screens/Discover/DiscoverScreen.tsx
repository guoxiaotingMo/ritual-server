import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '../../theme';
import { recommendApi } from '../../api/recommend';
import { RECOMMEND_CATEGORIES } from '../../constants';
import { useToast } from '../../components/Toast';
import { getErrorMessage } from '../../utils/validation';

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState('gifts');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const categoryApiMap: Record<string, () => any> = {
    gifts: recommendApi.getGifts,
    blessings: recommendApi.getBlessings,
    moments: recommendApi.getMoments,
    cakes: recommendApi.getCakes,
    flowers: recommendApi.getFlowers,
    dinners: recommendApi.getDinners,
  };

  const loadItems = async (categoryKey: string) => {
    setLoading(true);
    try {
      const api = categoryApiMap[categoryKey];
      if (api) {
        const res: any = await api();
        if (res.code === 200) setItems(res.data);
        else toast.error(res.message || '加载失败');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    setLoading(false);
  };

  useEffect(() => { loadItems(activeCategory); }, [activeCategory]);

  const handleCopy = (content: string) => {
    try {
      require('react-native').Clipboard.setString(content);
      toast.success('已复制到剪贴板');
    } catch {
      toast.error('复制失败，请手动复制');
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCopy(item.content || item.title)}
      activeOpacity={0.7}
    >
      <View style={styles.cardIndexBadge}>
        <Text style={styles.cardIndexText}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.content ? <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text> : null}
      <View style={styles.cardFooter}>
        <Text style={styles.cardAction}>TAP TO COPY</Text>
        <View style={styles.cardDot} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DISCOVER</Text>
        <Text style={styles.headerSubtitle}>探索灵感推荐</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {RECOMMEND_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, activeCategory === cat.key && styles.tabActive]}
            onPress={() => setActiveCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeCategory === cat.key && styles.tabTextActive]}>
              {cat.label}
            </Text>
            {activeCategory === cat.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => loadItems(activeCategory)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: Theme.fontSize.hero,
    fontWeight: '900',
    color: Theme.colors.text,
    letterSpacing: 4,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.xs,
    letterSpacing: 2,
  },
  tabBar: {
    maxHeight: 56,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Theme.colors.border,
  },
  tabBarContent: {
    paddingHorizontal: Theme.spacing.sm,
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  tab: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.radius.sm,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.12)',
  },
  tabText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: Theme.colors.primary,
    marginTop: 4,
  },
  list: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.08)',
    ...Theme.shadow.card,
  },
  cardIndexBadge: {
    position: 'absolute',
    top: Theme.spacing.md,
    right: Theme.spacing.md,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  cardIndexText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
    paddingRight: 40,
  },
  cardContent: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: Theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Theme.colors.border,
  },
  cardAction: {
    fontSize: 10,
    color: Theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  cardDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.accent,
  },
});
