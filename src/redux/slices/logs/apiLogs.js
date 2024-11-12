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
  page: 0,
  rowsPerPage: 100,
  filterBy: '',
  reportHiddenColumns: {
    "createdAt": false,
    "requestMethod": false,
    "requestURL": false,
    "responseStatusCode": false,
    "responseTime": false,
    "machine.serialNo": false,
    "customer.name": true,
    "additionalContextualInformation": true,
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

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LOGS
    resetApiLog(state){
      state.apiLog = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET API LOGS
    resetApiLogs(state){
      state.apiLogs = [];
      state.apiLogsCount = 0;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
    
    setReportHiddenColumns(state, action){
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
  setResponseMessage,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setReportHiddenColumns
} = slice.actions;

// ---------------------------------- GET API LOGS ------------------------------------

export function getApiLogs({machineId, fields = '', orderBy = '', query = {}, page, pageSize, searchKey, searchColumn}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy,
        ...query,
        machine: machineId,
        pagination: { page, pageSize },
      };
      if (searchKey?.length > 0) {
        params.searchKey = searchKey;
        params.searchColumn = searchColumn;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/logs/`, { params });
      dispatch(slice.actions.getApiLogsSuccess(response.data));
    } catch (error) {
      console.log(error);
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
