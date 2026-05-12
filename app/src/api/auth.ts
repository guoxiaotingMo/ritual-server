import { apiClient } from './client';

export interface RegisterParams {
  phone: string;
  password: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export const authApi = {
  register: (params: RegisterParams) =>
    apiClient.post('/auth/register', params),
  login: (params: LoginParams) =>
    apiClient.post('/auth/login', params),
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', null, {
      headers: { 'X-Refresh-Token': refreshToken },
    }),
  logout: () =>
    apiClient.delete('/auth/logout'),
};
