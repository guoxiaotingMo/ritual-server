export const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';

export const CATEGORY_MAP: Record<number, string> = {
  1: '生日',
  2: '纪念日',
  3: '节日',
  4: '自定义',
};

export const RECOMMEND_CATEGORIES = [
  { key: 'gifts', label: '礼物', value: 1 },
  { key: 'blessings', label: '祝福语', value: 2 },
  { key: 'moments', label: '朋友圈', value: 3 },
  { key: 'cakes', label: '蛋糕', value: 4 },
  { key: 'flowers', label: '鲜花', value: 5 },
  { key: 'dinners', label: '美食', value: 6 },
] as const;

export const ADVANCE_DAYS_OPTIONS = [0, 1, 3, 7, 14, 30];
