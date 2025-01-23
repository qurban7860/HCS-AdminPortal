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
  file: {},
  files: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'ticketFiles',
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

    // GET  Files
    getFilesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.files = action.payload;
      state.initial = true;
      // state.responseMessage = 'Files loaded successfully';
    },

    // ADD  Files
    addFilesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.files = action.payload;
      state.initial = true;
      state.responseMessage = 'File saved successfully';
    },

    // GET File
    getFileSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.file = action.payload;
      state.initial = true;
    },

    // DELETE File
    deleteFileSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.files = action.payload;
      state.initial = true;
      state.responseMessage = 'File deleted successfully';
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET File
    resetFile(state) {
      state.file = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Files
    resetFiles(state) {
      state.files = [];
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
  resetFile,
  resetFiles,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getFiles({id}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/${id}/files`);
      dispatch(slice.actions.getFilesSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addFiles({id, params}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { ...params};
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/${id}/files/`, data);
      dispatch(slice.actions.addFilesSuccess(response.data?.filesList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getFile(id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `${CONFIG.SERVER_URL}tickets/${id}/files/${fileId}`
      );
      dispatch(slice.actions.getFileSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteFile(id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(
        `${CONFIG.SERVER_URL}tickets/${id}/files/${fileId}`);
      dispatch(slice.actions.deleteFileSuccess(response.data?.filesList));
      // dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
