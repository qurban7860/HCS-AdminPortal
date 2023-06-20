import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  documentFormVisibility: false,
  documentEditFormVisibility: false,
  documentEdit: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  document: {},
  documents: [],
  activeDocuments: [],
  documentHistory: [],
};

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
        },
    // SET TOGGLE
    setDocumentFormVisibility(state, action){
      state.documentFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentEditFormVisibility(state, action){
      state.documentEditFormVisibility = action.payload;
    },
    setDocumentEdit(state, action){
      state.documentEdit = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Documents
    getDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documents = action.payload;
      state.initial = true;
    },

    // GET ACTIVE Documents
    getActiveDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDocuments = action.payload;
      state.initial = true;
    },

    // GET Document
    getDocumentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.document = action.payload;
      state.initial = true;
    },

    // GET Document
    getDocumentHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentHistory = action.payload;
      state.initial = true;
    },

    
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET Document
    resetDocument(state){
      state.document = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Documents
    resetDocuments(state){
      state.documents = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET Active Documents
    resetActiveDocuments(state){
      state.activeDocuments = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setDocumentFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentEdit,
  resetDocument,
  resetDocuments,
  resetActiveDocuments,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Document------------------------------------------

export function addDocument(customerId , machineId , params) {
    return async (dispatch) => { 
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
          if(customerId){
            formData.append('customer', customerId);
          }
            if(machineId){
              formData.append('machine', machineId);
            }
            formData.append('customerAccess', params.customerAccess);
            formData.append('isActive', params.isActive);
          if(params.machineModel){
            formData.append('machineModel', params?.machineModel);
          }
          if(params.contact){
            formData.append('contact', params.contact);
          }
          if(params.site){
            formData.append('site', params.site);
          }
          if(params?.displayName){
            formData.append('displayName', params?.displayName);
            formData.append('name', params?.displayName);
          }
          // if(params?.name){
          //   formData.append('name', params?.name);
          // }
          if(params?.description){
            formData.append('description', params?.description);
          }
          if(params?.documentCategory){
            formData.append('documentCategory', params?.documentCategory);
          }
          if(params?.documentType){
            formData.append('documentType', params?.documentType);
            formData.append('doctype', params?.documentType);
          }
          if(params?.images){
            formData.append('images', params?.images);
          }
          // console.log("formData", formData);
      const response = await axios.post(`${CONFIG.SERVER_URL}documents/document/`, formData );
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getDocuments());
      dispatch(setDocumentFormVisibility(false));
      dispatch(setDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Document-------------------------------------

export function updateDocument(documentId , params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      formData.append('isActive', params?.isActive);
      // if(params?.customerAccess){
        formData.append('customerAccess', params.customerAccess);
        // }

      if(params.newVersion){
        formData.append('newVersion', params.newVersion);
      }
      // if(params?.displayName){
        formData.append('displayName', params?.displayName);
        formData.append('name', params?.name);
      // }
      if(params?.description){
        formData.append('description', params?.description);
      }
      if(params?.documentCategory){
        formData.append('documentCategory', params?.documentCategory);
      }
      if(params?.documentType){
        formData.append('documentType', params?.documentType);
        formData.append('doctype', params?.documentType);
      }
      if(params?.images){
        formData.append('images', params?.images);
      }

      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}`, formData);

      dispatch(getDocuments())
      dispatch(slice.actions.setResponseMessage(' Document updated successfully'));
      dispatch(setDocumentFormVisibility(false));
      dispatch(setDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Documents-----------------------------------

export function getDocuments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isArchived: false,
        }
      }
      );
      dispatch(slice.actions.getDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------- GET CUSTOMER DOCUMENTS------------------------------------

export function getCustomerDocuments(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          customer:customerId,
          machine: null,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------- GET machineModel DOCUMENTS------------------------------------

export function getMachineModelDocuments(machineModelId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          machineModel:machineModelId,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------- GET CUSTOMER Site DOCUMENTS------------------------------------


export function getCustomerSiteDocuments(customerSite) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          customer:customerSite,
          machine: null,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDocuments(machineId, machineModelId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          machine: machineId,
          machineModel: machineModelId
        }
      }
      );
      console.log(response);
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Active Documents-----------------------------------

export function getActiveDocuments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
} 

// -------------------------------get Document---------------------------------------

export function getDocument(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}`);
      dispatch(slice.actions.getDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Document---------------------------------------

export function getDocumentHistory(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}`,{
        params: {
          historical : true
        }
      });
      dispatch(slice.actions.getDocumentHistorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document History Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


// ---------------------------------archive Document -------------------------------------

export function deleteDocument(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}` , 
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


