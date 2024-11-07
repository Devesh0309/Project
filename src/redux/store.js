import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './slices/jobslice';
import candidateReducer from './slices/candidateslice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    candidates: candidateReducer,
  },
});
