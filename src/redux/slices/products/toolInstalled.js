// import sum from 'lodash/sum';
// import uniq from 'lodash/uniq';
// import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';




// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  formVisibility: false,
  toolInstalledEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  toolsInstalled: [],
  toolInstalled: null,
};

const slice = createSlice({
  name: 'ToolInstalled',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;

    },
    // SET TOGGLE
    setToolInstalledFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setToolInstalledEditFormVisibility(state, action){
      state.toolInstalledEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET TOOLS INSTALLED
    getToolsInstalledSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.toolsInstalled = action.payload;
      state.initial = true;
    },

    // GET TOOLS INSTALLED
    getToolInstalledSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.toolInstalled = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET TOOLS INSTALLED
    resetToolInstalled(state){
      state.toolInstalled = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET TOOLS INSTALLED
    resetToolsInstalled(state){
      state.toolsInstalled = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setToolInstalledFormVisibility,
  setToolInstalledEditFormVisibility,
  resetToolInstalled,
  resetToolsInstalled,
  setResponseMessage,
} = slice.actions;

// ----------------------------Save TOOLS INSTALLED ------------------------------------------

export function addToolInstalled(machineId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
                tool: params.tool,
                note: params.note,
                isActive: params.isActive,
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/`, data);
      dispatch(slice.actions.setResponseMessage('Tool Installed successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update TOOLS INSTALLED -------------------------------------

export function updateToolInstalled(machineId,toolInstallledId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        tool: params.tool,
        note: params.note,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${toolInstallledId}`, data, );
      dispatch(slice.actions.setResponseMessage('Tool Installed updated successfully'));
      dispatch(setToolInstalledEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get TOOLS INSTALLED -----------------------------------

export function getToolsInstalled(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getToolsInstalledSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Installed Tools loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get TOOLS INSTALLED ---------------------------------------

export function getToolInstalled(machineId,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${Id}`);
      dispatch(slice.actions.getToolInstalledSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Installed Tool Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive TOOLS INSTALLED -------------------------------------

export function deleteToolInstalled(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


