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
  dashboardStatistics: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineDashboard',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET DASHBOARD STATISTICS
    setDashboardStatistics(state, action){
      state.isLoading = false;
      state.success = true;
      state.initial = true;
      state.dashboardStatistics = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
      state.dashboardStatistics  = {};
    },
    // RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    // RESET MACHINE DASHBOARD
    resetMachineDashboard(state){
      state.dashboardStatistics = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setDashboardStatistics,
  resetMachineDashboard,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage
} = slice.actions;

// ------------------------- GET DASHBOARD STATISTICS ---------------------------------------------

export function getMachineDashboardStatistics(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/dashboard`);
      dispatch(slice.actions.setDashboardStatistics({...response?.data, machineId} || ''));
      return {
        success: true,
        message: 'Successfully fetched',
      };
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      dispatch(slice.actions.hasError(errorMessage));
      return {
        success: false,
        message: errorMessage,
      };
    }
  };
}


