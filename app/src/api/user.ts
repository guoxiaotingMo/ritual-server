import { apiClient } from './client';

export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data: { nickName?: string; gender?: number; birthday?: string }) =>
    apiClient.put('/user/profile', data),
  uploadAvatar: (avatarUrl: string) =>
    apiClient.post('/user/avatar', null, { params: { avatarUrl } }),
};
