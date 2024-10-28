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
  apiLog: {},
  page: 0,
  rowsPerPage: 100,
  filterBy: ''
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
} = slice.actions;

// ---------------------------------- GET API LOGS ------------------------------------

export function getApiLogs(machineId, page, pageSize, cancelToken ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading(page, pageSize));
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/logs/`,
      {
        params: {
          machineId,
          pagination:{
            page,
            pageSize
          }
        },
        cancelToken: cancelToken?.token
      });
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
