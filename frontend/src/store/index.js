import { configureStore } from '@reduxjs/toolkit';
import pickupReducer from './pickupSlice';
import collectorReducer from './collectorSlice';
import complaintReducer from './complaintSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    pickups: pickupReducer,
    collector: collectorReducer,
    complaints: complaintReducer,
    admin: adminReducer,
  },
});

