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
  machinesByCountry:[],
  machinesByModel:[],
  machinesByYear:[],
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

    // GET Machine by Countries Success
    getMachinesByCountrySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByCountry = action.payload;
      state.initial = true;
    },

    // GET Machine by Models Success
    getMachinesByModelSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByModel = action.payload;
      state.initial = true;
    },

    // GET Machine by Years Success
    getMachinesByYearSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByYear = action.payload;
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
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByCountry(year, model) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineCountries?year=${year}&model=${model}`);
      dispatch(slice.actions.getMachinesByCountrySuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByModel(year, country) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineModel?year=${year}&country=${country}`);
      dispatch(slice.actions.getMachinesByModelSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByYear(model, country) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineYear?model=${model}&country=${country}`);
      dispatch(slice.actions.getMachinesByYearSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

