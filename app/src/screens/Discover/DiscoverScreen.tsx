import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Clipboard, Alert } from 'react-native';
import { recommendApi } from '../../api/recommend';
import { RECOMMEND_CATEGORIES } from '../../constants';

export default function DiscoverScreen() {
  const [activeCategory, setActiveCategory] = useState('gifts');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      }
    } catch (error) {
      console.error('加载推荐失败', error);
    }
    setLoading(false);
  };

  useEffect(() => { loadItems(activeCategory); }, [activeCategory]);

  const handleCopy = (content: string) => {
    Clipboard.setString(content);
    Alert.alert('已复制', '内容已复制到剪贴板');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCopy(item.content || item.title)}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.content ? <Text style={styles.cardContent}>{item.content}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {RECOMMEND_CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.key} style={[styles.tab, activeCategory === cat.key && styles.tabActive]} onPress={() => setActiveCategory(cat.key)}>
            <Text style={[styles.tabText, activeCategory === cat.key && styles.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.list} refreshing={loading} onRefresh={() => loadItems(activeCategory)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#E91E63' },
  tabText: { fontSize: 13, color: '#666' },
  tabTextActive: { color: '#E91E63', fontWeight: '600' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  cardContent: { fontSize: 14, color: '#666', lineHeight: 22 },
});
