import { configureStore } from '@reduxjs/toolkit';
import pickupReducer from './pickupSlice';

export const store = configureStore({
  reducer: {
    pickups: pickupReducer,
  },
});
