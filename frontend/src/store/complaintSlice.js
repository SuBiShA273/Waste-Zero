import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { complaintService } from '../services/complaintService';

export const fetchMyComplaints = createAsyncThunk(
  'complaints/fetchMyComplaints',
  async (_, { rejectWithValue }) => {
    try {
      return await complaintService.getMyComplaints();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load complaints list'
      );
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaints/createComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      return await complaintService.createComplaint(complaintData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit complaint'
      );
    }
  }
);

const initialState = {
  complaints: [],
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearComplaintError: (state) => {
      state.error = null;
    },
    clearComplaintSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyComplaints
      .addCase(fetchMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createComplaint
      .addCase(createComplaint.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.submitting = false;
        state.complaints.unshift(action.payload);
        state.successMessage = 'Your complaint has been submitted successfully.';
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearComplaintError, clearComplaintSuccess } = complaintSlice.actions;
export default complaintSlice.reducer;
