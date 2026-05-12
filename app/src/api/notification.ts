import { apiClient } from './client';

export const notificationApi = {
  list: () => apiClient.get('/notifications'),
  markAsRead: (id: number) => apiClient.put(`/notifications/${id}/read`),
  delete: (id: number) => apiClient.delete(`/notifications/${id}`),
};
