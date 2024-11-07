import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: [],
  reducers: {
    addJob: (state, action) => {
      state.push(action.payload);
    },
    editJob: (state, action) => {
      const index = state.findIndex(job => job.id === action.payload.id);
      state[index] = action.payload;
    },
    deleteJob: (state, action) => {
      return state.filter(job => job.id !== action.payload);
    },
  },
});

export const { addJob, editJob, deleteJob } = jobSlice.actions;
export default jobSlice.reducer;
