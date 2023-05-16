import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  machineDocumentFormVisibility: false,
  machineDocumentEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineDocuments: [],
  machineDocument: null,
};

const slice = createSlice({
  name: 'machineDocument',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setMachineDocumentFormVisibility(state, action){
      state.machineDocumentFormVisibility = action.payload;
    },

    // SET TOGGLE
    setMachineDocumentEditFormVisibility(state, action){
      state.cumentNameEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MachineDocuments
    getMachineDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineDocuments = action.payload;
      state.initial = true;
    },

    // GET Machine Document
    getMachineDocumentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineDocument = action.payload;
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
  setMachineDocumentFormVisibility,
  setMachineDocumentEditFormVisibility,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------Add Machine Document------------------------------------------

export function addMachineDocument(customerId , machineId , params) {
    return async (dispatch) => { 
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
            formData.append('customer', customerId);
            formData.append('machine', machineId);
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
          // console.log("formData", formData);
      const response = await axios.post(`${CONFIG.SERVER_URL}filemanager/files`, formData );
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getMachineDocuments(machineId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Machine Document-------------------------------------

export function updateMachineDocument(machineDocumentId, machineId , customerId , params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
          const formData = new FormData();
          if(params?.customer){
            formData.append('customer', customerId);
          }
          if(params?.customer){
            formData.append('machine', machineId);
          }
          // if(params?.name){
          //   formData.append('name', params?.name);
          // }
          // if(params?.description){
          //   formData.append('description', params?.description);
          // }
          if(params?.category){
            formData.append('category', params?.category);
          }
          // if(params?.documentName){
          //   formData.append('documentName', params?.documentName);
          // }
          if(params?.image){
            formData.append('image', params?.image);
          }

      const response = await axios.patch(`${CONFIG.SERVER_URL}filemanager/files/${machineDocumentId}`, formData );
      dispatch(slice.actions.setResponseMessage('Machine Document updated successfully'));
      dispatch(setMachineDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDocuments() {
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
      dispatch(slice.actions.getMachineDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Machine Document---------------------------------------

export function getMachineDocument(machineDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/files/${machineDocumentId}`);
      dispatch(slice.actions.getMachineDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Machine Document -------------------------------------

export function deleteMachineDocument(machineDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}filemanager/files/${machineDocumentId}` , 
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


