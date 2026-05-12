import { apiClient } from './client';

export const recommendApi = {
  getGifts: () => apiClient.get('/recommend/gifts'),
  getBlessings: () => apiClient.get('/recommend/blessings'),
  getMoments: () => apiClient.get('/recommend/moments'),
  getCakes: () => apiClient.get('/recommend/cakes'),
  getFlowers: () => apiClient.get('/recommend/flowers'),
  getDinners: () => apiClient.get('/recommend/dinners'),
};
