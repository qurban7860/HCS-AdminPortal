import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  apiLogs: [],
  apiLogsCount: 0,
  apiLog: {},
  apiLogSummary: {},
  filterBy: '',
  reportHiddenColumns: {
    "createdAt": false,
    "apiType": false,
    "requestMethod": false,
    "requestURL": true,
    "responseStatusCode": false,
    "responseTime": false,
    "machine.serialNo": false,
    "customer.name": true,
    "responseMessage": false,
    "noOfRecordsUpdated": false
  },
};
const slice = createSlice({
  name: 'apiLogs',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET API LOGS
    getApiLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.apiLogs = action.payload;
      state.apiLogsCount = action?.payload?.totalCount;
      state.initial = true;
    },

    // GET API LOG
    getApiLogSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.apiLog = action.payload;
      state.initial = true;
    },

    // GET API LOG SUMMARY
    getApiLogSummarySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.apiLogSummary = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LOGS
    resetApiLog(state) {
      state.apiLog = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET API LOGS
    resetApiLogs(state) {
      state.apiLogs = [];
      state.apiLogsCount = 0;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET API LOG SUMMARY
    resetApiLogSummary(state) {
      state.apiLogSummary = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
    },

    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetApiLogs,
  resetApiLog,
  resetApiLogSummary,
  setResponseMessage,
  setFilterBy,
  setReportHiddenColumns
} = slice.actions;

// ---------------------------------- GET API LOGS ------------------------------------

export function getApiLogs({ machineId, fields = '', orderBy = { createdAt: -1 }, query = {}, limit = 1000 }) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy,
        limit,
        ...query,
        machine: machineId,
      };
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/logs/`, { params });
      dispatch(slice.actions.getApiLogsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ GET API LOG SUMMARY ----------------------------------------

export function getApiLogSummary(query) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/logs/summary`, { params: query });
      dispatch(slice.actions.getApiLogSummarySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ GET API LOG ----------------------------------------

export function getApiLog(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/logs/${id}`);
      dispatch(slice.actions.getApiLogSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
