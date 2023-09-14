import { createSlice } from '@reduxjs/toolkit';
// utils
import FormData from 'form-data';
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  customerDocumentFormVisibility: false,
  customerDocumentEditFormVisibility: false,
  customerDocumentViewFormVisibility: false,
  customerDocumentHistoryViewFormVisibility: false,
  customerDocumentEdit: false,
  customerDocumentIntial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customerDocuments: [],
  activeCustomerDocuments: [],
  customerDocumentHistory: [],
  customerDocument: null,
};

const slice = createSlice({
  name: 'customerDocument',
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
    setCustomerDocumentFormVisibility(state, action){
      state.customerDocumentFormVisibility = action.payload;
    },

    // SET TOGGLE
    setCustomerDocumentEditFormVisibility(state, action){
      state.customerDocumentEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setCustomerDocumentViewFormVisibility(state, action){
      state.customerDocumentViewFormVisibility = action.payload;
    },    
    // SET TOGGLE
    setCustomerDocumentHistoryViewFormVisibility(state, action){
      state.customerDocumentHistoryViewFormVisibility = action.payload;
    },
    setCustomerDocumentEdit(state, action){
      state.customerDocumentEdit = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Customer Documents
    getCustomerDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerDocuments = action.payload;
      state.initial = true;
    },

    // GET Active Customer Documents
    getActiveCustomerDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeCustomerDocuments = action.payload;
      state.initial = true;
    },

    // GET Customer Documents
    getCustomerDocumentHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerDocumentHistory = action.payload;
      state.initial = true;
    },

    // GET Customer Document
    getCustomerDocumentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerDocument = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Customer Document
    resetCustomerDocument(state){
      state.customerDocument = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Customer Documents
    resetCustomerDocuments(state){
      state.customerDocuments = [];
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
  setCustomerDocumentFormVisibility,
  setCustomerDocumentEditFormVisibility,
  setCustomerDocumentViewFormVisibility,
  setCustomerDocumentHistoryViewFormVisibility,
  setCustomerDocumentEdit,
  resetCustomerDocument,
  resetCustomerDocuments,
  setResponseMessage,
} = slice.actions;


// ----------------------------Add Customer Document------------------------------------------

export function addCustomerDocument(customerId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
          formData.append('customer', customerId);
          // if(params?.customerAccess){
            formData.append('customerAccess', params.customerAccess);
            formData.append('isActive', params?.isActive);
          // }
          if(params?.displayName){
            formData.append('displayName', params?.displayName);
            formData.append('name', params?.displayName);
          }
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
      await axios.post(`${CONFIG.SERVER_URL}documents/document/`, formData,{
        headers: {
          'Content-Type':"multupart/form-data"
        }
      });
      // if(RegExp.test(response.status)){
        dispatch(getCustomerDocuments(customerId))
        dispatch(setCustomerDocumentFormVisibility(false));
      // }
      console.log("add customer document try block!")
    } catch (error) {
      console.error(error);
      console.log("add customer document catch block!")
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Customer Document-------------------------------------

export function updateCustomerDocument(customerDocumentId,params,customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      // if(params?.customerAccess){
        formData.append('customerAccess', params.customerAccess);
      // }
      formData.append('customer', customerId);
        formData.append('isActive', params?.isActive);
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
      await axios.patch(`${CONFIG.SERVER_URL}documents/document/${customerDocumentId}`, formData);
      // if(regEx.test(response.status)){
        dispatch(setCustomerDocumentEditFormVisibility(false));
        dispatch(setCustomerDocumentFormVisibility(false));
        dispatch(getCustomerDocuments(customerId))
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Customer Documents-----------------------------------

export function getCustomerDocuments(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isArchived: false,
          customer:customerId,
          machine: null,
          orderBy : {
            createdAt:-1
          }
          // basic: true
        }
      }
      );
      // console.log("response : ", response);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getCustomerDocumentsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Active Customer Documents-----------------------------------

export function getActiveCustomerDocuments(customerId) {
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
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveCustomerDocumentsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Customer Document History-----------------------------------

export function getCustomerDocumentHistory(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${customerDocumentId}`,
      {
        params: {
          historical : true
        }
      }
      );
      dispatch(slice.actions.getCustomerDocumentHistorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customer Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------get Customer Document---------------------------------------

export function getCustomerDocument(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${customerDocumentId}`);
      dispatch(slice.actions.getCustomerDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customer Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Customer Document -------------------------------------

export function deleteCustomerDocument(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${customerDocumentId}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    dispatch(slice.actions.stopLoading());
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}


