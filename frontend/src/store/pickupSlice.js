import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pickupService } from '../services/pickupService';

export const fetchMyPickups = createAsyncThunk(
  'pickups/fetchMyPickups',
  async (_, { rejectWithValue }) => {
    try {
      return await pickupService.getMyPickups();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load pickup history'
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'pickups/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await pickupService.getDashboardStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load dashboard statistics'
      );
    }
  }
);

export const fetchPickupById = createAsyncThunk(
  'pickups/fetchPickupById',
  async (id, { rejectWithValue }) => {
    try {
      return await pickupService.getPickupById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load pickup details'
      );
    }
  }
);

export const createPickup = createAsyncThunk(
  'pickups/createPickup',
  async (pickupData, { rejectWithValue }) => {
    try {
      return await pickupService.createPickup(pickupData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create pickup request'
      );
    }
  }
);

export const cancelPickup = createAsyncThunk(
  'pickups/cancelPickup',
  async (id, { rejectWithValue }) => {
    try {
      return await pickupService.cancelPickup(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel pickup request'
      );
    }
  }
);

export const recyclePickup = createAsyncThunk(
  'pickups/recyclePickup',
  async ({ id, recyclingNotes }, { rejectWithValue }) => {
    try {
      return await pickupService.recyclePickup(id, { recyclingNotes });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark pickup as recycled'
      );
    }
  }
);

const initialState = {
  pickups: [],
  stats: {
    totalPickups: 0,
    completedPickups: 0,
    pendingPickups: 0,
    cancelledPickups: 0,
  },
  activePickup: null,
  currentPickup: null,
  loading: false,
  creating: false,
  cancelling: false,
  recycling: false,
  error: null,
  createSuccess: false,
};

const pickupSlice = createSlice({
  name: 'pickups',
  initialState,
  reducers: {
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPickup: (state) => {
      state.currentPickup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyPickups
      .addCase(fetchMyPickups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
        // Derive active pickup (first pickup that is not RECYCLED, COLLECTED, REJECTED, CANCELLED, FAILED, EXPIRED)
        const active = action.payload.find((p) =>
          ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(p.status)
        );
        state.activePickup = active || null;
      })
      .addCase(fetchMyPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchDashboardStats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // fetchPickupById
      .addCase(fetchPickupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPickup = action.payload;
      })
      .addCase(fetchPickupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createPickup
      .addCase(createPickup.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createPickup.fulfilled, (state, action) => {
        state.creating = false;
        state.createSuccess = true;
        state.pickups.unshift(action.payload);
        if (!state.activePickup) {
          state.activePickup = action.payload;
        }
      })
      .addCase(createPickup.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // cancelPickup
      .addCase(cancelPickup.pending, (state) => {
        state.cancelling = true;
        state.error = null;
      })
      .addCase(cancelPickup.fulfilled, (state, action) => {
        state.cancelling = false;
        const updated = action.payload;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.currentPickup?.id === updated.id) {
          state.currentPickup = updated;
        }
        if (state.activePickup?.id === updated.id) {
          // find next active
          const nextActive = state.pickups.find((p) =>
            p.id !== updated.id &&
            ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(p.status)
          );
          state.activePickup = nextActive || null;
        }
      })
      .addCase(cancelPickup.rejected, (state, action) => {
        state.cancelling = false;
        state.error = action.payload;
      })

      // recyclePickup
      .addCase(recyclePickup.pending, (state) => {
        state.recycling = true;
        state.error = null;
      })
      .addCase(recyclePickup.fulfilled, (state, action) => {
        state.recycling = false;
        const updated = action.payload;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.currentPickup?.id === updated.id) {
          state.currentPickup = updated;
        }
      })
      .addCase(recyclePickup.rejected, (state, action) => {
        state.recycling = false;
        state.error = action.payload;
      });
  },
});

export const { clearCreateSuccess, clearError, clearCurrentPickup } = pickupSlice.actions;
export default pickupSlice.reducer;
