import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const DASHBOARD_STATS = ['producedLength', 'wasteLength', 'productionRate'];

const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: false,
  dashboardStatistics: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineDashboard',
  initialState,
  reducers: {
    startLoading(state, action) {
      state.isLoading = true;
    },
    // SET INDIVIDUAL STATISTIC
    setStatistic(state, action) {
      const { type, value } = action.payload;
      state.isLoading[type] = false;
      state.success = true;
      state.initial = true;
      state.dashboardStatistics[type] = value;
      state.error[type] = null;
    },
    // SET ALL STATISTICS
    setAllStatistic(state, action) {
      state.isLoading = false;
      state.success = true;
      state.initial = true;
      state.dashboardStatistics = action.payload;
      state.error = null;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.success = true;
      state.initial = true;
    },
    // RESET MACHINE DASHBOARD
    resetMachineDashboard(state) {
      return {
        ...initialState,
        isLoading: false,
        error: false
      };
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
  setStatistic,
  resetMachineDashboard,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage
} = slice.actions;

// ------------------------- GET DASHBOARD STATISTICS ---------------------------------------------

export function getMachineDashboardStatistics(machineId) {
  return async (dispatch) => {
    const fetchStatistic = async (type) => {
      dispatch(slice.actions.startLoading(type));
      try {
        const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/dashboard/${type}`);
        dispatch(slice.actions.setStatistic({ 
          type, 
          value: response?.data || { value: 0, recordCount: 0 }
        }));
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        dispatch(slice.actions.hasError({ type, error: errorMessage }));
      }
    };

    // Fetch all statistics in parallel
    await Promise.all(DASHBOARD_STATS.map(fetchStatistic));

    return {
      success: true,
      message: 'Statistics fetch completed',
    };
  };
}

export function getCompleteMachineDashboardStatistics(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/dashboard/`);
      dispatch(slice.actions.setAllStatistic(response?.data[0]));
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      dispatch(slice.actions.hasError(errorMessage));
    }
    return {
      success: true,
      message: 'Statistics fetch completed',
    };
  };
}