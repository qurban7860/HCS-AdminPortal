import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  documentTypeFormVisibility: false,
  documentTypeEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  documentTypes: [],
  activeDocumentTypes: [],
  documentType: null,
};

const slice = createSlice({
  name: 'documentType',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setDocumentTypeFormVisibility(state, action){
      state.documentTypeFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentTypeEditFormVisibility(state, action){
      state.documentTypeEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentTypes = action.payload;
      state.initial = true;
    },

    // GET Active Setting
    getActiveDocumentTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDocumentTypes = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentType = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetDocumentType(state){
      state.documentType = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT NAME
    resetDocumentTypes(state){
      state.documentTypes = [];
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
  setDocumentTypeFormVisibility,
  setDocumentTypeEditFormVisibility,
  resetDocumentType,
  resetDocumentTypes,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Document Type------------------------------------------

export function addDocumentType(params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
                name: params.name,
                description: params.description,
                customerAccess:params.customerAccess,
                isActive: params.isActive,
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}documents/documentType/`, data);
      dispatch(slice.actions.setResponseMessage('Document Type saved successfully'));
      dispatch(getDocumentTypes());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Document Type-------------------------------------

export function updateDocumentType(Id,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name: params.name,
        description: params.description,
        customerAccess:params.customerAccess,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/documentType/${Id}`, data, );
      dispatch(slice.actions.setResponseMessage('Document Type updated successfully'));
      dispatch(setDocumentTypeEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Document Types-----------------------------------

export function getDocumentTypes() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/documentType/` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getDocumentTypesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Types loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


// -----------------------------------Get Active Document Types-----------------------------------

export function getActiveDocumentTypes() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/documentType/` , 
      {
        params: {
          isArchived: false,
          isActive: true,
        }
      }
      );
      console.log("document type response: " , response)
      dispatch(slice.actions.getActiveDocumentTypesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Types loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Document Type---------------------------------------

export function getDocumentType(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/documentType/${Id}`);
      dispatch(slice.actions.getDocumentTypeSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Type Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Document Type-------------------------------------

export function deleteDocumentType(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/documentType/${Id}` , 
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


