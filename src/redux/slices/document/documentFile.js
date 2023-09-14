import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  documentFileFormVisibility: false,
  documentFileEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  documentFiles: [],
  documentFile: null,
};

const slice = createSlice({
  name: 'documentFile',
  initialState,
    reducers: {
      // START LOADING
      startLoading(state) {
        state.isLoading = true;
        state.error = null;
      },
      // SET TOGGLE
      setDocumentFileFormVisibility(state, action){
        state.documentFileFormVisibility = action.payload;
      },
  
      // SET TOGGLE
      setDocumentFileEditFormVisibility(state, action){
        state.documentFileEditFormVisibility = action.payload;
      },
      // HAS ERROR
      hasError(state, action) {
        state.isLoading = false;
        state.error = action.payload;
        state.initial = true;
      },
  
      // GET Setting
      getDocumentFilesSuccess(state, action) {
        state.isLoading = false;
        state.success = true;
        state.documentFiles = action.payload;
        state.initial = true;
      },
  
      // GET Active Setting
      getActiveDocumentFilesSuccess(state, action) {
        state.isLoading = false;
        state.success = true;
        state.activeDocumentFiles = action.payload;
        state.initial = true;
      },
  
      // GET Setting
      getDocumentFileSuccess(state, action) {
        state.isLoading = false;
        state.success = true;
        state.documentFile = action.payload;
        state.initial = true;
      },
  
      setResponseMessage(state, action) {
        state.responseMessage = action.payload;
        state.isLoading = false;
        state.success = true;
        state.initial = true;
      },
  
      // RESET DOCUMENT NAME
      resetDocumentFile(state){
        state.documentFile = {};
        state.responseMessage = null;
        state.success = false;
        state.isLoading = false;
      },
  
      // RESET DOCUMENT NAME
      resetDocumentFiles(state){
        state.documentFiles = [];
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
    setDocumentFileFormVisibility,
    setDocumentFileEditFormVisibility,
    resetDocumentFile,
    resetDocumentFiles,
    setResponseMessage,
  } = slice.actions;

// -----------------------------------Get Document File Downloaded-----------------------------------

export function getDocumentDownload(documentId,versionId,fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/${fileId}/download/` );
    return response;
  };
}


// ----------------------------Add Document File------------------------------------------

export function addDocumentFile(documentId,versionId,params) {
  return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
          const data = {
              name: params.name,
              description: params.description,
              customerAccess:params.customerAccess,
              isActive: params.isActive,
          }
    await axios.post(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/`, data);
    dispatch(slice.actions.setResponseMessage('Document File saved successfully'));
    dispatch(getDocumentFiles());
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error.Message));
    throw error;
  }
};
}

// ---------------------------------Update Document File-------------------------------------

export function updateDocumentFile(Id,documentId,versionId,params) {
return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const data = {
      name: params.name,
      description: params.description,
      customerAccess:params.customerAccess,
      isActive: params.isActive,
    }
    await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/${Id}`, data, );
    dispatch(slice.actions.setResponseMessage('Document File updated successfully'));
    dispatch(setDocumentFileEditFormVisibility (false));
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error.Message));
    throw error;
  }
};
}

// -----------------------------------Get Document Files-----------------------------------

export function getDocumentFiles(documentId,versionId) {
return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/` , 
    {
      params: {
        isArchived: false
      }
    }
    );
    dispatch(slice.actions.getDocumentFilesSuccess(response.data));
    dispatch(slice.actions.setResponseMessage('Document Files loaded successfully'));
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error.Message));
    throw error;
  }
};
}

// -------------------------------get Document File---------------------------------------

export function getDocumentFile(Id,documentId,versionId) {
return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/${Id}`);
    dispatch(slice.actions.getDocumentFileSuccess(response.data));
    dispatch(slice.actions.setResponseMessage('Document File Loaded Successfuly'));
  } catch (error) {
    console.error(error);
    dispatch(slice.actions.hasError(error.Message));
    throw error;
  }
};
}

// ---------------------------------archive Document File-------------------------------------

export function deleteDocumentFile(documentId,versionId, Id, customerId) {
return async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}/versions/${versionId}/files/${Id}` , 
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




