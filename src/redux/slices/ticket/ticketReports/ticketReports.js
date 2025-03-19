/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  report: {},
  reports: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'ticketReports',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
      state.initial = true;
    },

    // GET Reports
    getReportsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.reports = action.payload;
      state.initial = true;
      // state.responseMessage = 'Reports loaded successfully';
    },

    // GET Report
    getReportSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.report = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET REPORT
    resetReport(state) {
      state.report = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetReports(state) {
      state.reports = [];
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
  resetReport,
  resetReports,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// GET Single Report (by Id)
export function getReport(id, reportId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `${CONFIG.SERVER_URL}tickets/${id}/report/${reportId}`
      );
      dispatch(slice.actions.getReportSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// GET All Reports
export function getReports(value = null, unit = null) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const params = {
          orderBy: { createdAt: -1 },
          isArchived: false,
        };
        if (value !== null && unit !== null) {
          params.value = value;
          params.unit = unit;
        }
  
        const response = await axios.get(`${CONFIG.SERVER_URL}tickets/count`, { params });
        dispatch(slice.actions.getReportsSuccess(response.data));
        return response;
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        console.error(error);
        throw error;
      }
    };
  }
