import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id, active) => {
    const response = await api.patch(`/api/admin/users/${id}/status`, { active });
    return response.data;
  },

  getCollectors: async () => {
    const response = await api.get('/api/admin/collectors');
    return response.data;
  },

  getAllPickups: async (params = {}) => {
    const response = await api.get('/api/admin/pickups', { params });
    return response.data;
  },

  getPickupById: async (id) => {
    const response = await api.get(`/api/admin/pickups/${id}`);
    return response.data;
  },

  recyclePickup: async (id, data) => {
    const response = await api.patch(`/api/admin/pickups/${id}/recycle`, data || {});
    return response.data;
  },

  getAllComplaints: async (params = {}) => {
    const response = await api.get('/api/admin/complaints', { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await api.get(`/api/admin/complaints/${id}`);
    return response.data;
  },

  updateComplaint: async (id, data) => {
    const response = await api.patch(`/api/admin/complaints/${id}`, data);
    return response.data;
  },
};
