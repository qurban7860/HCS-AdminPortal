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
  dbBackupLogs: [],
  dbBackupLog: {},
  page: 0,
  rowsPerPage: 100,
  filterBy: ''
};

const slice = createSlice({
  name: 'dbBackupLogs',
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

    // GET PM 2 LOGS
    getDbBackupLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.dbBackupLogs = action.payload;
      state.initial = true;
    },

    // GET PM 2 LOG
    getDbBackupLogSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.dbBackupLog = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LOGS
    resetDbBackupLog(state){
      state.dbBackupLog = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET PM 2 LOGS
    resetDbBackupLogs(state){
      state.dbBackupLogs = [];
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
  resetDbBackupLogs,
  resetDbBackupLog,
  setResponseMessage,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
} = slice.actions;

// ----------------------------------------------------------------------

export function getDbBackupLogs(page, pageSize, cancelToken ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading(page, pageSize));
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dbbackups/backups/`,
      {
        params: {
          pagination:{
            page,
            pageSize
          }
        },
        cancelToken: cancelToken?.token
      });
      dispatch(slice.actions.getDbBackupLogsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ GET PM2 LOG ----------------------------------------

export function getDbBackupLog(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dbbackups/backups/${id}`);
      dispatch(slice.actions.getDbBackupLogSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
