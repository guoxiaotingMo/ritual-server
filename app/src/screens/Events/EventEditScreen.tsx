import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eventsApi } from '../../api/events';
import { CATEGORY_MAP, ADVANCE_DAYS_OPTIONS } from '../../constants';
import { Theme } from '../../theme';
import { useToast } from '../../components/Toast';
import { validateTitle, getErrorMessage } from '../../utils/validation';

const categories = [
  { value: 1, label: '生日' },
  { value: 2, label: '纪念日' },
  { value: 3, label: '节日' },
  { value: 4, label: '自定义' },
];

const ritualItems = [
  { key: 'needGift', label: '礼物', icon: 'GIFT' },
  { key: 'needBlessing', label: '祝福语', icon: 'NOTE' },
  { key: 'needMoment', label: '朋友圈', icon: 'SHARE' },
  { key: 'needCake', label: '蛋糕', icon: 'CAKE' },
  { key: 'needFlower', label: '鲜花', icon: 'FLOWER' },
  { key: 'needDinner', label: '订餐', icon: 'DINE' },
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
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const toast = useToast();

  const ritualStateMap: Record<string, [boolean, (v: boolean) => void]> = {
    needGift: [needGift, setNeedGift],
    needBlessing: [needBlessing, setNeedBlessing],
    needMoment: [needMoment, setNeedMoment],
    needCake: [needCake, setNeedCake],
    needFlower: [needFlower, setNeedFlower],
    needDinner: [needDinner, setNeedDinner],
  };

  const handleSave = async () => {
    const titleErr = validateTitle(title);
    setTitleError(titleErr || '');

    if (titleErr) {
      toast.warning(titleErr);
      return;
    }

    setLoading(true);
    try {
      const params = { title: title.trim(), eventDate: eventDate.toISOString().split('T')[0], category, relatedPerson: relatedPerson || undefined };
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
      await eventsApi.updateReminderSetting(eventId, { advanceDays, reminderTime: `${String(reminderTime.getHours()).padStart(2, '0')}:${String(reminderTime.getMinutes()).padStart(2, '0')}:00`, pushEnabled: 1 });
      toast.success(isEdit ? '修改成功' : '添加成功');
      setTimeout(() => navigation.goBack(), 600);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.glassCard}>
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="标题（如：领证日、老婆生日）"
              placeholderTextColor={Theme.colors.textMuted}
              value={title}
              onChangeText={(text) => { setTitle(text); if (titleError) setTitleError(validateTitle(text) || ''); }}
              onBlur={() => { if (title) setTitleError(validateTitle(title) || ''); }}
            />
            {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
          </View>
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateIcon}>DATE</Text>
            <Text style={styles.dateText}>{eventDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              themeVariant="dark"
              onChange={(_, date) => { setShowDatePicker(false); if (date) setEventDate(date); }}
            />
          )}
        </View>

        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.categoryBtn, category === cat.value && styles.categoryBtnActive]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.glassCard}>
          <TextInput
            style={styles.input}
            placeholder="关联人（如：老婆、妈妈）"
            placeholderTextColor={Theme.colors.textMuted}
            value={relatedPerson}
            onChangeText={setRelatedPerson}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>仪式感定制</Text>
        <View style={styles.glassCard}>
          {ritualItems.map((item, index) => {
            const [value, setter] = ritualStateMap[item.key];
            return (
              <View key={item.key} style={[styles.switchRow, index < ritualItems.length - 1 && styles.switchRowBorder]}>
                <View style={styles.switchLabelWrap}>
                  <View style={styles.switchIconWrap}>
                    <Text style={styles.switchIconText}>{item.icon}</Text>
                  </View>
                  <Text style={styles.switchLabel}>{item.label}</Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={setter}
                  trackColor={{ false: Theme.colors.surfaceHover, true: Theme.colors.primary }}
                  thumbColor={value ? Theme.colors.gold : Theme.colors.textMuted}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>提醒设置</Text>
        <View style={styles.glassCard}>
          <TouchableOpacity style={styles.timeRow} onPress={() => setShowTimePicker(true)}>
            <View style={styles.timeIconWrap}>
              <Text style={styles.timeIconText}>TIME</Text>
            </View>
            <Text style={styles.timeLabel}>提醒时间</Text>
            <Text style={styles.timeValue}>
              {String(reminderTime.getHours()).padStart(2, '0')}:{String(reminderTime.getMinutes()).padStart(2, '0')}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour
              onChange={(_, date) => { setShowTimePicker(false); if (date) setReminderTime(date); }}
            />
          )}
          <View style={styles.advanceContainer}>
            {ADVANCE_DAYS_OPTIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.advanceBtn, advanceDays === d && styles.advanceBtnActive]}
                onPress={() => setAdvanceDays(d)}
              >
                <Text style={[styles.advanceText, advanceDays === d && styles.advanceTextActive]}>
                  {d === 0 ? '当天' : `提前${d}天`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>{loading ? '保存中...' : '保存'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
    letterSpacing: 1,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.06)',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.card,
  },
  inputWrap: {
    marginBottom: 2,
  },
  input: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
  },
  inputError: {
    color: Theme.colors.error,
  },
  errorText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.error,
    marginTop: 2,
    marginLeft: 4,
    fontWeight: '500',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.sm,
  },
  dateIcon: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginRight: Theme.spacing.sm,
    letterSpacing: 1,
  },
  dateText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.md,
  },
  categoryBtn: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
  },
  categoryBtnActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    ...Theme.shadow.float,
  },
  categoryText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  switchRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  switchLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  switchIconText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '900',
    color: Theme.colors.accent,
    letterSpacing: 0.5,
  },
  switchLabel: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  advanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.sm,
  },
  advanceBtn: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
  },
  advanceBtnActive: {
    backgroundColor: Theme.colors.gold,
    borderColor: Theme.colors.gold,
  },
  advanceText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
  },
  advanceTextActive: {
    color: Theme.colors.background,
    fontWeight: '800',
  },
  saveBtn: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.xxl,
    paddingVertical: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadow.float,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: Theme.fontSize.lg,
    fontWeight: '800',
    letterSpacing: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  timeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Theme.radius.sm,
    backgroundColor: Theme.colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  timeIconText: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '900',
    color: Theme.colors.primary,
    letterSpacing: 0.5,
  },
  timeLabel: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  timeValue: {
    fontSize: Theme.fontSize.lg,
    color: Theme.colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
