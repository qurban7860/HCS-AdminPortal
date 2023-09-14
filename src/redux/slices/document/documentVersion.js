import { createSlice } from '@reduxjs/toolkit';
// utils
import FormData from 'form-data';
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  documentVersionFormVisibility: false,
  documentVersionEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  documentVersions: [],
  documentVersion: null,
};

const slice = createSlice({
  name: 'documentVersion',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setDocumentVersionFormVisibility(state, action){
      state.documentVersionFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentVersionEditFormVisibility(state, action){
      state.documentVersionEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentVersionsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentVersions = action.payload;
      state.initial = true;
    },

    // GET Active Setting
    getActiveDocumentVersionsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDocumentVersions = action.payload;
      state.initial = true;
    },

    // GET Setting
    getDocumentVersionSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentVersion = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetDocumentVersion(state){
      state.documentVersion = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT NAME
    resetDocumentVersions(state){
      state.documentVersions = [];
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
  setDocumentVersionFormVisibility,
  setDocumentVersionEditFormVisibility,
  resetDocumentVersion,
  resetDocumentVersions,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Document Version------------------------------------------

export function addDocumentVersion(documentId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
          if(params?.customer){
            formData.append('customer', params?.customer?._id);
          }
          if(params?.machine){
            formData.append('machine', params?.machine?._id);
          }
          if(params?.machineModel){
            formData.append('machineModel', params?.machineModel);
          }
          if(params?.site){
            formData.append('site', params?.site);
          }
          if(params?.description){
            formData.append('description', params?.description);
          }
          if (params?.files) {
            params.files.forEach((file, index) => {
              formData.append(`images`, file);
            });
          }

      await axios.post(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/`, formData);
      dispatch(slice.actions.setResponseMessage('Document Version saved successfully'));
      // dispatch(getDocumentVersions(documentId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Document Version-------------------------------------

export function updateDocumentVersion(documentId,versionId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      if (params?.files) {
          params.files.forEach((file, index) => {
          formData.append(`images`, file);
        });
      }
      // if(params?.images){
      //   formData.append('images', params?.images);
      // }
      await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}`, formData, );
      dispatch(slice.actions.setResponseMessage('Document Version updated successfully'));
      dispatch(setDocumentVersionEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Document Versions-----------------------------------

export function getDocumentVersions(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getDocumentVersionsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Versions loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Active Document Versions-----------------------------------

export function getActiveDocumentVersions(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/` , 
      {
        params: {
          isArchived: false,
          isActive: true,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentVersionsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Versions loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------get Document Version---------------------------------------

export function getDocumentVersion(Id,documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${Id}`);
      dispatch(slice.actions.getDocumentVersionSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Version Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Document Version-------------------------------------

export function deleteDocumentVersion(Id,documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${Id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


