import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  documentNameFormVisibility: false,
  documentNameEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  documentNames: [],
  documentName: null,
};

const slice = createSlice({
  name: 'documentName',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setDocumentNameFormVisibility(state, action){
      state.documentNameFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentNameEditFormVisibility(state, action){
      state.documentNameEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentNamesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentNames = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentNameSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentName = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetDocumentName(state){
      state.documentName = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT NAME
    resetDocumentNames(state){
      state.documentNames = [];
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
  setDocumentNameFormVisibility,
  setDocumentNameEditFormVisibility,
  resetDocumentName,
  resetDocumentNames,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Document Name------------------------------------------

export function addDocumentName(params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
                name: params.name,
                description: params.description,
                isActive: params.isActive,
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}filemanager/documentNames/`, data);
      dispatch(slice.actions.setResponseMessage('Document Name saved successfully'));
      dispatch(getDocumentNames());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Document Name-------------------------------------

export function updateDocumentName(machineId,settingId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        techParam: params.techParam,
        techParamValue: params.techParamValue,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('Document Name updated successfully'));
      dispatch(setDocumentNameEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Document Names-----------------------------------

export function getDocumentNames() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/documentNames/` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getDocumentNamesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Name loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Document Name---------------------------------------

export function getDocumentName(machineId,settingId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getDocumentNameSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Name Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Document Name-------------------------------------

export function deleteDocumentName(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${id}` , 
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


