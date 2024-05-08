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
  pm2LogType: '',
  pm2Lines: 100,
  pM2FullScreenDialog:false
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
      // state.isLoading = false;
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
    
    // Set pm2 Environment
    setPm2Environment(state, action) {
      state.pm2Environment = action.payload;
    },

    // Set pm2 LOG TYPES
    setPm2LogType(state, action) {
      state.pm2LogType = action.payload;
    },
    
    // setPm2LinesPerPage
    setPm2LinesPerPage(state, action) {
      state.pm2Lines = action.payload;
    },

    setPM2FullScreenDialog(state, action){
      state.pM2FullScreenDialog = action.payload;  
    }
    
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
  setPm2Environment,
  setPm2LogType,
  setPm2LinesPerPage,
  setPM2FullScreenDialog
} = slice.actions;

// ----------------------------------------------------------------------

export function getPm2Logs(lines, type, app, cancelToken ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/pm2/`,
      {
        params: {
          out_log: type?.toLowerCase() === 'logs' || false,
          err_log: type?.toLowerCase() === 'error' || false,
          app,
          pageSize: lines
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
    // dispatch(slice.actions.startLoading());
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

