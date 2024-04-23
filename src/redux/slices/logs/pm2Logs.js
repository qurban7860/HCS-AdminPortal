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
  pm2Logs: [],
  pm2Log: {},
  pm2Environments: [],
  pm2Environment: '',
  page: 0,
  rowsPerPage: 100,
  filterBy: ''
};

const slice = createSlice({
  name: 'pm2Logs',
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
    getPm2LogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.pm2Logs = action.payload;
      state.initial = true;
    },

    // GET PM 2 LOG
    getPm2LogSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.pm2Log = action.payload;
      state.initial = true;
    },
    getPm2EnvironmentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.pm2Environments = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LOGS
    resetPm2Log(state){
      state.pm2Log = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET PM 2 LOGS
    resetPm2Logs(state){
      state.pm2Logs = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },    // RESET PM 2 LOGS
    resetPm2Environments(state){
      state.pm2Environments = [];
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

    // Set pm2 Environment
    setPm2Environment(state, action) {
      state.pm2Environment = action.payload;
    },
    
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetPm2Log,
  resetPm2Logs,
  resetPm2Environments,
  setResponseMessage,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setPm2Environment,
} = slice.actions;

// ----------------------------------------------------------------------

export function getPm2Logs(page, pageSize, app, cancelToken ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/pm2/`,
      {
        params: {
          out_log: true,
          err_log: true,
          app,
          pageNumber: page,
          pageSize
        },
        cancelToken: cancelToken?.token
      });
      dispatch(slice.actions.getPm2LogsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ GET PM2 LOG ----------------------------------------

export function getPm2Log(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/pm2/${id}`);
      dispatch(slice.actions.getPm2LogSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getPm2Environments(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/pm2/pm2list/`);
      dispatch(slice.actions.getPm2EnvironmentsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

