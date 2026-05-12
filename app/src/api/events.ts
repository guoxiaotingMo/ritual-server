import { apiClient } from './client';

export interface CreateEventParams {
  title: string;
  eventDate: string;
  calendarType?: number;
  repeatType?: number;
  category?: number;
  relatedPerson?: string;
  isShared?: number;
}

export interface UpdateEventParams {
  title?: string;
  eventDate?: string;
  calendarType?: number;
  repeatType?: number;
  category?: number;
  relatedPerson?: string;
  isShared?: number;
}

export const eventsApi = {
  create: (params: CreateEventParams) => apiClient.post('/events', params),
  list: (category?: number) => apiClient.get('/events', { params: { category } }),
  get: (id: number) => apiClient.get(`/events/${id}`),
  update: (id: number, params: UpdateEventParams) => apiClient.put(`/events/${id}`, params),
  delete: (id: number) => apiClient.delete(`/events/${id}`),
  getCalendar: (year: number, month: number) => apiClient.get(`/events/calendar/${year}/${month}`),
  getRitualConfig: (eventId: number) => apiClient.get(`/events/${eventId}/ritual`),
  updateRitualConfig: (eventId: number, data: any) => apiClient.put(`/events/${eventId}/ritual`, data),
  getReminderSetting: (eventId: number) => apiClient.get(`/events/${eventId}/reminder`),
  updateReminderSetting: (eventId: number, data: any) => apiClient.put(`/events/${eventId}/reminder`, data),
};
