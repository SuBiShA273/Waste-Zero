import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../services/adminService';

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await adminService.getUsers(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchAdminUserDetails = createAsyncThunk(
  'admin/fetchAdminUserDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await adminService.getUserById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async ({ id, active }, { rejectWithValue }) => {
    try {
      return await adminService.toggleUserStatus(id, active);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const fetchAdminCollectors = createAsyncThunk(
  'admin/fetchAdminCollectors',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getCollectors();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch collectors');
    }
  }
);

export const fetchAdminPickups = createAsyncThunk(
  'admin/fetchAdminPickups',
  async (params, { rejectWithValue }) => {
    try {
      return await adminService.getAllPickups(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pickups');
    }
  }
);

export const fetchAdminPickupDetails = createAsyncThunk(
  'admin/fetchAdminPickupDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await adminService.getPickupById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pickup details');
    }
  }
);

export const recyclePickup = createAsyncThunk(
  'admin/recyclePickup',
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      return await adminService.recyclePickup(id, { recyclingNotes: notes });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to recycle pickup');
    }
  }
);

export const fetchAdminComplaints = createAsyncThunk(
  'admin/fetchAdminComplaints',
  async (params, { rejectWithValue }) => {
    try {
      return await adminService.getAllComplaints(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch complaints');
    }
  }
);

export const fetchAdminComplaintDetails = createAsyncThunk(
  'admin/fetchAdminComplaintDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await adminService.getComplaintById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch complaint details');
    }
  }
);

export const updateAdminComplaint = createAsyncThunk(
  'admin/updateAdminComplaint',
  async ({ id, status, adminResponse }, { rejectWithValue }) => {
    try {
      return await adminService.updateComplaint(id, { status, adminResponse });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update complaint');
    }
  }
);

const initialState = {
  stats: null,
  statsLoading: false,
  users: [],
  usersLoading: false,
  currentUser: null,
  currentUserLoading: false,
  collectors: [],
  collectorsLoading: false,
  pickups: [],
  pickupsLoading: false,
  currentPickup: null,
  currentPickupLoading: false,
  complaints: [],
  complaintsLoading: false,
  currentComplaint: null,
  currentComplaintLoading: false,
  error: null,
  actionLoading: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearCurrentPickup: (state) => {
      state.currentPickup = null;
    },
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      // User Details
      .addCase(fetchAdminUserDetails.pending, (state) => {
        state.currentUserLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserDetails.fulfilled, (state, action) => {
        state.currentUserLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchAdminUserDetails.rejected, (state, action) => {
        state.currentUserLoading = false;
        state.error = action.payload;
      })
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.users = state.users.map((u) => (u.id === updated.id ? updated : u));
        state.collectors = state.collectors.map((c) => (c.id === updated.id ? updated : c));
        if (state.currentUser && state.currentUser.id === updated.id) {
          state.currentUser = updated;
        }
      })
      // Collectors
      .addCase(fetchAdminCollectors.pending, (state) => {
        state.collectorsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCollectors.fulfilled, (state, action) => {
        state.collectorsLoading = false;
        state.collectors = action.payload;
      })
      .addCase(fetchAdminCollectors.rejected, (state, action) => {
        state.collectorsLoading = false;
        state.error = action.payload;
      })
      // Pickups
      .addCase(fetchAdminPickups.pending, (state) => {
        state.pickupsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminPickups.fulfilled, (state, action) => {
        state.pickupsLoading = false;
        state.pickups = action.payload;
      })
      .addCase(fetchAdminPickups.rejected, (state, action) => {
        state.pickupsLoading = false;
        state.error = action.payload;
      })
      // Pickup Details
      .addCase(fetchAdminPickupDetails.pending, (state) => {
        state.currentPickupLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminPickupDetails.fulfilled, (state, action) => {
        state.currentPickupLoading = false;
        state.currentPickup = action.payload;
      })
      .addCase(fetchAdminPickupDetails.rejected, (state, action) => {
        state.currentPickupLoading = false;
        state.error = action.payload;
      })
      // Recycle Pickup
      .addCase(recyclePickup.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(recyclePickup.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.currentPickup && state.currentPickup.id === updated.id) {
          state.currentPickup = updated;
        }
      })
      .addCase(recyclePickup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Complaints
      .addCase(fetchAdminComplaints.pending, (state) => {
        state.complaintsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminComplaints.fulfilled, (state, action) => {
        state.complaintsLoading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchAdminComplaints.rejected, (state, action) => {
        state.complaintsLoading = false;
        state.error = action.payload;
      })
      // Complaint Details
      .addCase(fetchAdminComplaintDetails.pending, (state) => {
        state.currentComplaintLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminComplaintDetails.fulfilled, (state, action) => {
        state.currentComplaintLoading = false;
        state.currentComplaint = action.payload;
      })
      .addCase(fetchAdminComplaintDetails.rejected, (state, action) => {
        state.currentComplaintLoading = false;
        state.error = action.payload;
      })
      // Update Complaint
      .addCase(updateAdminComplaint.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateAdminComplaint.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.complaints = state.complaints.map((c) => (c.id === updated.id ? updated : c));
        if (state.currentComplaint && state.currentComplaint.id === updated.id) {
          state.currentComplaint = updated;
        }
      })
      .addCase(updateAdminComplaint.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearCurrentUser, clearCurrentPickup, clearCurrentComplaint } = adminSlice.actions;
export default adminSlice.reducer;
