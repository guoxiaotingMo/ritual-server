export interface User {
  id: number;
  phone: string;
  nickName: string;
  avatar: string;
  gender: number;
  birthday: string;
}

export interface AnniversaryEvent {
  id: number;
  userId: number;
  title: string;
  eventDate: string;
  calendarType: number;
  repeatType: number;
  category: number;
  relatedPerson: string;
  relatedPersonId: number;
  isShared: number;
  createdAt: string;
  updatedAt: string;
}

export interface RitualConfig {
  id: number;
  eventId: number;
  needGift: number;
  needBlessing: number;
  needMoment: number;
  needCake: number;
  needFlower: number;
  needDinner: number;
}

export interface ReminderSetting {
  id: number;
  eventId: number;
  advanceDays: number;
  reminderTime: string;
  pushEnabled: number;
}

export interface RecommendContent {
  id: number;
  category: number;
  title: string;
  content: string;
  tags: string;
}

export interface NotificationRecord {
  id: number;
  userId: number;
  eventId: number;
  title: string;
  content: string;
  type: number;
  isRead: number;
  createdAt: string;
}

export interface UserRelation {
  id: number;
  userId: number;
  partnerId: number;
  relationType: number;
  status: number;
  inviteCode: string;
}

export interface PartnerVO {
  id: number;
  relationId: number;
  phone: string;
  nickName: string;
  avatar: string;
  gender: number;
  birthday: string;
}
