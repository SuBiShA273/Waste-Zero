import api from './api';

export const pickupService = {
  createPickup: async (pickupData) => {
    const response = await api.post('/api/pickups', pickupData);
    return response.data;
  },

  getMyPickups: async () => {
    const response = await api.get('/api/pickups/my');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/api/pickups/stats');
    return response.data;
  },

  getPickupById: async (id) => {
    const response = await api.get(`/api/pickups/${id}`);
    return response.data;
  },

  cancelPickup: async (id) => {
    const response = await api.patch(`/api/pickups/${id}/cancel`);
    return response.data;
  },

  recyclePickup: async (id, data) => {
    const response = await api.patch(`/api/admin/pickups/${id}/recycle`, data || {});
    return response.data;
  },

  getAllAdminPickups: async () => {
    const response = await api.get('/api/admin/pickups');
    return response.data;
  },
};
