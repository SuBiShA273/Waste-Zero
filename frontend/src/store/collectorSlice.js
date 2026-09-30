import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import collectorService from '../services/collectorService';

export const fetchCollectorStats = createAsyncThunk(
  'collector/fetchCollectorStats',
  async (_, { rejectWithValue }) => {
    try {
      return await collectorService.getStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load collector statistics'
      );
    }
  }
);

export const fetchAssignedPickups = createAsyncThunk(
  'collector/fetchAssignedPickups',
  async (status, { rejectWithValue }) => {
    try {
      return await collectorService.getAssignedPickups(status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load assigned pickups'
      );
    }
  }
);

export const fetchPickupHistory = createAsyncThunk(
  'collector/fetchPickupHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await collectorService.getPickupHistory();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load pickup history'
      );
    }
  }
);

export const fetchCollectorPickupById = createAsyncThunk(
  'collector/fetchCollectorPickupById',
  async (id, { rejectWithValue }) => {
    try {
      return await collectorService.getPickupById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load pickup details'
      );
    }
  }
);

export const acceptPickupThunk = createAsyncThunk(
  'collector/acceptPickup',
  async (id, { rejectWithValue }) => {
    try {
      return await collectorService.acceptPickup(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to accept pickup'
      );
    }
  }
);

export const rejectPickupThunk = createAsyncThunk(
  'collector/rejectPickup',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await collectorService.rejectPickup(id, reason);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject pickup'
      );
    }
  }
);

export const updatePickupStatusThunk = createAsyncThunk(
  'collector/updatePickupStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await collectorService.updateStatus(id, status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update pickup status'
      );
    }
  }
);

export const completeCollectionThunk = createAsyncThunk(
  'collector/completeCollection',
  async ({ id, actualWeight, collectionNotes }, { rejectWithValue }) => {
    try {
      return await collectorService.completeCollection(id, { actualWeight, collectionNotes });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to complete collection'
      );
    }
  }
);

export const uploadProofThunk = createAsyncThunk(
  'collector/uploadProof',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      return await collectorService.uploadProof(id, file);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload proof photo'
      );
    }
  }
);

export const updateAvailabilityThunk = createAsyncThunk(
  'collector/updateAvailability',
  async (availability, { rejectWithValue }) => {
    try {
      return await collectorService.updateAvailability(availability);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update availability'
      );
    }
  }
);

const initialState = {
  stats: {
    assignedPickups: 0,
    acceptedPickups: 0,
    completedPickups: 0,
    availability: 'AVAILABLE',
  },
  pickups: [],
  history: [],
  activePickup: null,
  currentPickup: null,
  loading: false,
  updating: false,
  uploading: false,
  error: null,
  actionSuccess: false,
  actionMessage: null,
};

const collectorSlice = createSlice({
  name: 'collector',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActionMessage: (state) => {
      state.actionSuccess = false;
      state.actionMessage = null;
    },
    clearCurrentPickup: (state) => {
      state.currentPickup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCollectorStats
      .addCase(fetchCollectorStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // fetchAssignedPickups
      .addCase(fetchAssignedPickups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
        // Derive active pickup (first in ACCEPTED, ON_THE_WAY, ARRIVED)
        const active = action.payload.find((p) =>
          ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(p.status)
        );
        state.activePickup = active || null;
      })
      .addCase(fetchAssignedPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchPickupHistory
      .addCase(fetchPickupHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchPickupHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchCollectorPickupById
      .addCase(fetchCollectorPickupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectorPickupById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPickup = action.payload;
      })
      .addCase(fetchCollectorPickupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // acceptPickupThunk
      .addCase(acceptPickupThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(acceptPickupThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.actionSuccess = true;
        state.actionMessage = 'Pickup request accepted successfully';
        const updated = action.payload;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.currentPickup?.id === updated.id) state.currentPickup = updated;
        state.activePickup = updated;
      })
      .addCase(acceptPickupThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // rejectPickupThunk
      .addCase(rejectPickupThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(rejectPickupThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.actionSuccess = true;
        state.actionMessage = 'Pickup request rejected';
        const updated = action.payload;
        state.pickups = state.pickups.filter((p) => p.id !== updated.id);
        if (state.currentPickup?.id === updated.id) state.currentPickup = updated;
        if (state.activePickup?.id === updated.id) state.activePickup = null;
      })
      .addCase(rejectPickupThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // updatePickupStatusThunk
      .addCase(updatePickupStatusThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePickupStatusThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.actionSuccess = true;
        state.actionMessage = `Pickup status updated to ${action.payload.status}`;
        const updated = action.payload;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.currentPickup?.id === updated.id) state.currentPickup = updated;
        if (['ACCEPTED', 'ON_THE_WAY', 'ARRIVED'].includes(updated.status)) {
          state.activePickup = updated;
        } else if (state.activePickup?.id === updated.id) {
          state.activePickup = null;
        }
      })
      .addCase(updatePickupStatusThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // completeCollectionThunk
      .addCase(completeCollectionThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(completeCollectionThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.actionSuccess = true;
        state.actionMessage = 'Collection completed successfully';
        const updated = action.payload;
        state.pickups = state.pickups.filter((p) => p.id !== updated.id);
        state.history.unshift(updated);
        if (state.currentPickup?.id === updated.id) state.currentPickup = updated;
        if (state.activePickup?.id === updated.id) state.activePickup = null;
      })
      .addCase(completeCollectionThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // uploadProofThunk
      .addCase(uploadProofThunk.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProofThunk.fulfilled, (state, action) => {
        state.uploading = false;
        state.actionSuccess = true;
        state.actionMessage = 'Collection proof image uploaded';
        const updated = action.payload;
        if (state.currentPickup?.id === updated.id) state.currentPickup = updated;
        state.pickups = state.pickups.map((p) => (p.id === updated.id ? updated : p));
        if (state.activePickup?.id === updated.id) state.activePickup = updated;
      })
      .addCase(uploadProofThunk.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // updateAvailabilityThunk
      .addCase(updateAvailabilityThunk.fulfilled, (state, action) => {
        state.stats.availability = action.payload.availability;
        state.actionSuccess = true;
        state.actionMessage = `Availability updated to ${action.payload.availability}`;
      });
  },
});

export const { clearError, clearActionMessage, clearCurrentPickup } = collectorSlice.actions;
export default collectorSlice.reducer;
