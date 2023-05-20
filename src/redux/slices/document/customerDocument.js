import { createSlice } from '@reduxjs/toolkit';
// utils
import FormData from 'form-data';
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

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

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
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
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

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
          if(params?.name){
            formData.append('name', params?.name);
          }
          if(params?.description){
            formData.append('description', params?.description);
          }
          if(params?.category){
            formData.append('category', params?.category);
          }
          if(params?.documentName){
            formData.append('documentName', params?.documentName);
          }
          if(params?.image){
            formData.append('image', params?.image);
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

      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getCustomerDocuments(customerId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Customer Document-------------------------------------

export function updateCustomerDocument(customerDocumentId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { 
                    name: params?.name,
                    customerAccess: params.customerAccess,
                    isActive: params.isActive,
                    description: params.description,
                  };

          // if(params?.name){
          //   formData.append('name', params?.name);
          // }
          // if(params?.description){
          //   formData.append('description', params?.description);
          // }
          if(params?.category){
            data.category = params?.category
          }
          if(params?.documentName){
            data.documentName = params?.documentName
          }
          // if(params?.image){
          //   formData.append('image', params?.image);
          // }
          // if(params?.isActive){
          //   formData.append('isActive', params?.isActive);
          // }

      const response = await axios.patch(`${CONFIG.SERVER_URL}filemanager/files/${customerDocumentId}`, data);
      // dispatch(getCustomerDocuments())
      dispatch(slice.actions.setResponseMessage('Customer Document updated successfully'));
      dispatch(setCustomerDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
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
          customer:customerId
        }
      }
      );
      dispatch(slice.actions.getCustomerDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customer Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Customer Document---------------------------------------

export function getCustomerDocument(customerDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/files/${customerDocumentId}`);
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


