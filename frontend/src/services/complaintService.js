import api from './api';

export const complaintService = {
  createComplaint: async (complaintData) => {
    const response = await api.post('/api/complaints', complaintData);
    return response.data;
  },

  getMyComplaints: async () => {
    const response = await api.get('/api/complaints/my');
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await api.get(`/api/complaints/${id}`);
    return response.data;
  },

  adminUpdateComplaint: async (id, updateData) => {
    const response = await api.patch(`/api/admin/complaints/${id}`, updateData);
    return response.data;
  },
};
