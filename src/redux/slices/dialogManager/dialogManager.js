import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  success: false,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'dialogManager',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  hasError
} = slice.actions;


