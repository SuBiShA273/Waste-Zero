import api from './api';

const collectorService = {
  // Get collector stats
  getStats: async () => {
    const response = await api.get('/api/collector/stats');
    return response.data;
  },

  // Get assigned pickups (optional status filter: ASSIGNED, ACCEPTED, ACTIVE, COMPLETED, ALL)
  getAssignedPickups: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/api/collector/pickups', { params });
    return response.data;
  },

  // Get pickup history
  getPickupHistory: async () => {
    const response = await api.get('/api/collector/pickups/history');
    return response.data;
  },

  // Get pickup details by ID
  getPickupById: async (id) => {
    const response = await api.get(`/api/collector/pickups/${id}`);
    return response.data;
  },

  // Accept assigned pickup
  acceptPickup: async (id) => {
    const response = await api.patch(`/api/collector/pickups/${id}/accept`);
    return response.data;
  },

  // Reject assigned pickup
  rejectPickup: async (id, reason) => {
    const response = await api.patch(`/api/collector/pickups/${id}/reject`, { reason });
    return response.data;
  },

  // Update pickup status progress (ACCEPTED -> ON_THE_WAY -> ARRIVED)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/collector/pickups/${id}/status`, { status });
    return response.data;
  },

  // Finalize collection with weight and notes
  completeCollection: async (id, data) => {
    const response = await api.post(`/api/collector/pickups/${id}/complete`, data);
    return response.data;
  },

  // Upload proof of collection photo
  uploadProof: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/api/collector/pickups/${id}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update collector availability
  updateAvailability: async (availability) => {
    const response = await api.patch('/api/collector/profile/availability', { availability });
    return response.data;
  },
};

export default collectorService;
