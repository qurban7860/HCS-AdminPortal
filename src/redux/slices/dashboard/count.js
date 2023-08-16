import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  count: {},
};

const slice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // RESET USERS
    resetCount(state){
      state.count = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // GET users
    getCountSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.count = action.payload;
      state.initial = true;
    },
    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetCounts,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCount() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/`);
      dispatch(slice.actions.getCountSuccess(response.data));
    //   dispatch(slice.actions.setResponseMessage('Counts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

