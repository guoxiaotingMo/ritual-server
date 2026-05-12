import { apiClient } from './client';

export const relationApi = {
  generateInvite: () => apiClient.post('/relations/invite'),
  acceptInvite: (inviteCode: string) => apiClient.post('/relations/accept', { inviteCode }),
  unbind: (id: number) => apiClient.delete(`/relations/${id}`),
  getPartner: () => apiClient.get('/relations/partner'),
};
