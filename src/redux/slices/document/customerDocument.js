import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  customerDocumentFormVisibility: false,
  customerDocumentEditFormVisibility: false,
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
      state.cumentNameEditFormVisibility = action.payload;
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
            const data = {
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}filemanager/files`, data);
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getCustomerDocuments(customerId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Customer Document-------------------------------------

export function updateCustomerDocument(customerId,CustomerDocumentId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
      }
    //   const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${customerId}/techparamvalues/${documentId}`, data, );
      dispatch(slice.actions.setResponseMessage('Customer Document updated successfully'));
      dispatch(setCustomerDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Customer Document-----------------------------------

export function getCustomerDocuments(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/files` , 
      {
        params: {
          isArchived: false
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

export function getCustomerDocument(customerId,settingId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${customerId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getCustomerDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customer Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Customer Document -------------------------------------

export function deleteCustomerDocument(customerId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${customerId}/techparamvalues/${id}` , 
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


