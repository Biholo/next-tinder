import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { SwipeAction } from '@/types';

interface SwipeState {
  isLoading: boolean;
  error: string | null;
}

const initialState: SwipeState = {
  isLoading: false,
  error: null,
};

export const createSwipe = createAsyncThunk(
  'swipe/createSwipe',
  async (swipeData: SwipeAction) => {
    const response = await api.createSwipe(swipeData);
    return response;
  }
);

const swipeSlice = createSlice({
  name: 'swipe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSwipe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSwipe.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createSwipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export default swipeSlice.reducer; 