import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP, ADVANCE_DAYS_OPTIONS } from '../../constants';

const categories = [
  { value: 1, label: '生日' },
  { value: 2, label: '纪念日' },
  { value: 3, label: '节日' },
  { value: 4, label: '自定义' },
];

export default function EventEditScreen({ navigation, route }: any) {
  const { mode, event } = route.params || {};
  const isEdit = mode === 'edit';

  const [title, setTitle] = useState(isEdit ? event.title : '');
  const [eventDate, setEventDate] = useState(isEdit ? new Date(event.eventDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(isEdit ? event.category : 4);
  const [relatedPerson, setRelatedPerson] = useState(isEdit ? event.relatedPerson || '' : '');
  const [needGift, setNeedGift] = useState(false);
  const [needBlessing, setNeedBlessing] = useState(false);
  const [needMoment, setNeedMoment] = useState(false);
  const [needCake, setNeedCake] = useState(false);
  const [needFlower, setNeedFlower] = useState(false);
  const [needDinner, setNeedDinner] = useState(false);
  const [advanceDays, setAdvanceDays] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title) { Alert.alert('提示', '请填写标题'); return; }
    setLoading(true);
    try {
      const params = { title, eventDate: eventDate.toISOString().split('T')[0], category, relatedPerson: relatedPerson || undefined };
      let eventId: number;
      if (isEdit) {
        await eventsApi.update(event.id, params);
        eventId = event.id;
      } else {
        const res: any = await eventsApi.create(params);
        eventId = res.data.id;
      }
      await eventsApi.updateRitualConfig(eventId, {
        needGift: needGift ? 1 : 0, needBlessing: needBlessing ? 1 : 0,
        needMoment: needMoment ? 1 : 0, needCake: needCake ? 1 : 0,
        needFlower: needFlower ? 1 : 0, needDinner: needDinner ? 1 : 0,
      });
      await eventsApi.updateReminderSetting(eventId, { advanceDays, reminderTime: '09:00:00', pushEnabled: 1 });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('保存失败', error.response?.data?.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>基本信息</Text>
      <TextInput style={styles.input} placeholder="标题（如：领证日、老婆生日）" value={title} onChangeText={setTitle} />
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{eventDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={eventDate} mode="date" onChange={(_, date) => { setShowDatePicker(false); if (date) setEventDate(date); }} />
      )}
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat.value} style={[styles.categoryBtn, category === cat.value && styles.categoryBtnActive]} onPress={() => setCategory(cat.value)}>
            <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="关联人（如：老婆、妈妈）" value={relatedPerson} onChangeText={setRelatedPerson} />

      <Text style={styles.sectionTitle}>仪式感定制</Text>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>🎁 需要准备礼物</Text><Switch value={needGift} onValueChange={setNeedGift} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needGift ? '#E91E63' : '#fff'} /></View>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>💌 需要发送祝福语</Text><Switch value={needBlessing} onValueChange={setNeedBlessing} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needBlessing ? '#E91E63' : '#fff'} /></View>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>📸 需要发朋友圈</Text><Switch value={needMoment} onValueChange={setNeedMoment} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needMoment ? '#E91E63' : '#fff'} /></View>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>🎂 需要订蛋糕</Text><Switch value={needCake} onValueChange={setNeedCake} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needCake ? '#E91E63' : '#fff'} /></View>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>💐 需要送花</Text><Switch value={needFlower} onValueChange={setNeedFlower} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needFlower ? '#E91E63' : '#fff'} /></View>
      <View style={styles.switchRow}><Text style={styles.switchLabel}>🍽️ 需要订餐</Text><Switch value={needDinner} onValueChange={setNeedDinner} trackColor={{ false: '#ddd', true: '#FCE4EC' }} thumbColor={needDinner ? '#E91E63' : '#fff'} /></View>

      <Text style={styles.sectionTitle}>提醒设置</Text>
      <View style={styles.advanceContainer}>
        {ADVANCE_DAYS_OPTIONS.map((d) => (
          <TouchableOpacity key={d} style={[styles.advanceBtn, advanceDays === d && styles.advanceBtnActive]} onPress={() => setAdvanceDays(d)}>
            <Text style={[styles.advanceText, advanceDays === d && styles.advanceTextActive]}>{d === 0 ? '当天' : `提前${d}天`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.saveBtn, loading && styles.saveBtnDisabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? '保存中...' : '保存'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  sectionTitle: { fontSize: 16, color: '#333', marginBottom: 12, marginTop: 20, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 16, backgroundColor: '#fafafa', marginBottom: 12 },
  dateText: { fontSize: 16, color: '#333' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 8, marginBottom: 8 },
  categoryBtnActive: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  categoryText: { color: '#666', fontSize: 14 },
  categoryTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  switchLabel: { fontSize: 16, color: '#333' },
  advanceContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  advanceBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 8, marginBottom: 8 },
  advanceBtnActive: { backgroundColor: '#E91E63', borderColor: '#E91E63' },
  advanceText: { color: '#666', fontSize: 14 },
  advanceTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#E91E63', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
