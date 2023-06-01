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
  customerDocumentEdit: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customerDocuments: [],
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
    // SET TOGGLE
    setCustomerDocumentFormVisibility(state, action){
      state.customerDocumentFormVisibility = action.payload;
    },

    // SET TOGGLE
    setCustomerDocumentEditFormVisibility(state, action){
      state.customerDocumentEditFormVisibility = action.payload;
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
          if(params?.isActive){
            formData.append('isActive', params?.isActive);
          }
// console.log("formData : ",params?.image);
      const response = await axios.post(`${CONFIG.SERVER_URL}filemanager/files`, formData,{
        headers: {
          'Content-Type':"multupart/form-data"
        }
      });
      // if(RegExp.test(response.status)){
        dispatch(getCustomerDocuments(customerId))
        dispatch(setCustomerDocumentFormVisibility(false));
      // }

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Customer Document-------------------------------------

export function updateCustomerDocument(customerDocumentId,params,customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const data = { 
      //             displayName: params?.displayName,
      //             name: params?.displayName,
      //             customerAccess: params.customerAccess,
      //             // isActive: params.isActive,
      //             documentType:params.documentType,
      //             docType:params.documentType,
      //             documentCategory:params.documentCategory,
      //             docCategory:params.documentCategory,
      //             description: params.description,
      //             };
      const formData = new FormData();
      formData.append('customer', customerId);
      // if(params?.customerAccess){
        formData.append('customerAccess', params.customerAccess);
        // }
      if(params.newVersion){
        formData.append('newVersion', params.newVersion);
      }
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
      if(params?.isActive){
        formData.append('isActive', params?.isActive);
      }
console.log("formData : ",params?.image);
          // console.log("Payload : ",params);
      const response = await axios.patch(`${CONFIG.SERVER_URL}filemanager/files/${customerDocumentId}`, formData);
      // if(regEx.test(response.status)){
        dispatch(setCustomerDocumentEditFormVisibility(false));
        dispatch(setCustomerDocumentFormVisibility(false));
        dispatch(getCustomerDocuments(customerId))
        console.log("update response : ",response)
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Customer Document-----------------------------------

export function getCustomerDocuments(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/files` , 
      {
        params: {
          isArchived: false,
          customer:customerId,
          machine: null,
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
    }
  };
}

// -------------------------------get Customer Document---------------------------------------

export function getCustomerDocument(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/files/${customerDocumentId}`);
      console.log("customerDocumentId response :", response)
      dispatch(slice.actions.getCustomerDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customer Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Customer Document -------------------------------------

export function deleteCustomerDocument(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}filemanager/files/${customerDocumentId}` , 
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


