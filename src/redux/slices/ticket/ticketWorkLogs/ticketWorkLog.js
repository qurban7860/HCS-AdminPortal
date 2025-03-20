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
  workLog: {},
  workLogs: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'ticketWorkLogs',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    updateWorkLogsFromSSE(state, action) {
      state.workLogs = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
      state.initial = true;
    },

    // GET  workLogs
    getWorkLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.workLogs = action.payload;
      state.initial = true;
       // state.responseMessage = 'WorkLogs loaded successfully';
    },

    // ADD  WorkLogs
    addWorkLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.workLogs = action.payload;
      state.initial = true;
      state.responseMessage = 'WorkLog saved successfully';
    },

    // UPDATE  workLogs
    updateWorkLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.workLogs = action.payload;
      state.initial = true;
      state.responseMessage = 'WorkLog updated successfully';
    },

    // GET workLog
    getWorkLogSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.workLog = action.payload;
      state.initial = true;
    },

    // DELETE workLog
    deleteWorkLogSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.workLogs = action.payload;
      state.initial = true;
      state.responseMessage = 'WorkLog deleted successfully';
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LICENSE
    resetWorkLog(state) {
      state.workLog = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetWorkLogs(state) {
      state.workLogs = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
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
  updateWorkLogsFromSSE,
  resetWorkLog,
  resetWorkLogs,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getWorkLogs({id}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/${id}/workLogs`);
      dispatch(slice.actions.getWorkLogsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addWorkLog( id, timeSpent, workDate, notes ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { timeSpent, workDate, notes };  
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/${id}/workLogs/`, data);
      dispatch(slice.actions.addWorkLogsSuccess([response.data.workLogsList]));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateWorkLog(id, workLogId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        timeSpent: params.timeSpent,
        workDate: params.workDate,
        notes: params.notes,
      };
      const response = await axios.patch(
        `${CONFIG.SERVER_URL}tickets/${id}/workLogs/${workLogId}`,
        data
      );
      dispatch(slice.actions.updateWorkLogsSuccess(response.data?.workLogsList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getWorkLog(id, workLogId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `${CONFIG.SERVER_URL}tickets/${id}/workLogs/${workLogId}`
      );
      dispatch(slice.actions.getWorkLogSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteWorkLog(id, workLogId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(
        `${CONFIG.SERVER_URL}tickets/${id}/workLogs/${workLogId}`);
      dispatch(slice.actions.deleteWorkLogSuccess(response.data?.workLogsList));
      // dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
