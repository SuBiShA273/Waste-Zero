import api from './api';

export const impactService = {
  getMyImpact: async () => {
    const response = await api.get('/api/impact/my');
    return response.data;
  },
};
