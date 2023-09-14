import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  machineDocumentFormVisibility: false,
  machineDocumentEditFormVisibility: false,
  machineDocumentViewFormVisibility: false,
  machineDocumentHistoryViewFormVisibility: false,
  machineDocumentEdit: false,
  machineDocumentIntial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineDocument: {},
  machineDocuments: [],
  activeMachineDocuments: [],
  machineDocumentHistory: [],
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
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },
    // SET TOGGLE
    setMachineDocumentFormVisibility(state, action){
      state.machineDocumentFormVisibility = action.payload;
    },

    // SET TOGGLE
    setMachineDocumentEditFormVisibility(state, action){
      state.machineDocumentEditFormVisibility = action.payload;
    },
     // SET TOGGLE
     setMachineDocumentViewFormVisibility(state, action){
      state.machineDocumentViewFormVisibility = action.payload;
    },
     // SET TOGGLE
     setMachineDocumentHistoryViewFormVisibility(state, action){
      state.machineDocumentHistoeryViewFormVisibility = action.payload;
    },

    setMachineDocumentEdit(state, action){
      state.machineDocumentEdit = action.payload;
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

    // Active GET MachineDocuments
    getActiveMachineDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineDocuments = action.payload;
      state.initial = true;
    },

    // GET Machine Document
    getMachineDocumentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineDocument = action.payload;
      state.initial = true;
    },

    // GET Machine Document
    getMachineDocumentHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineDocumentHistory = action.payload;
      state.initial = true;
    },

    
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET Machine Document
    resetMachineDocument(state){
      state.machineDocument = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Machine Documents
    resetMachineDocuments(state){
      state.machineDocuments = [];
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
  setMachineDocumentFormVisibility,
  setMachineDocumentEditFormVisibility,
  setMachineDocumentViewFormVisibility,
  setMachineDocumentHistoryViewFormVisibility,
  setMachineDocumentEdit,
  resetMachineDocument,
  resetMachineDocuments,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Machine Document------------------------------------------

export function addMachineDocument(customerId , machineId , params) {
    return async (dispatch) => { 
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
          if(customerId){
            formData.append('customer', customerId);
          }
            formData.append('machine', machineId);
            formData.append('customerAccess', params.customerAccess);
            formData.append('isActive', params.isActive);
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
          // console.log("formData", formData);
      await axios.post(`${CONFIG.SERVER_URL}documents/document/`, formData );
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getMachineDocuments(machineId));
      dispatch(setMachineDocumentFormVisibility(false));
      dispatch(setMachineDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Machine Document-------------------------------------

export function updateMachineDocument(machineDocumentId , machineId , params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const data = { 
      //   displayName: params?.displayName,
      //   name: params?.displayName,
      //   customerAccess: params.customerAccess,
      //   // isActive: params.isActive,
      //   documentType:params.documentType,
      //   docType:params.documentType,
      //   documentCategory:params.documentCategory,
      //   docCategory:params.documentCategory,
      //   description: params.description,
      // };


      const formData = new FormData();
      formData.append('isActive', params?.isActive);
      // if(params?.customerAccess){
        formData.append('customerAccess', params.customerAccess);
        // }
        // if(params?.customer){
        // formData.append('customer', params.customer);
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

      await axios.patch(`${CONFIG.SERVER_URL}documents/document/${machineDocumentId}`, formData);
      console.log("machineId : ", machineId)
      dispatch(getMachineDocuments(machineId))
      dispatch(slice.actions.setResponseMessage('Machine Document updated successfully'));
      dispatch(setMachineDocumentFormVisibility(false));
      dispatch(setMachineDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDocuments(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isArchived: false,
          machine: machineId,
          orderBy : {
            createdAt:-1
          }
          // basic: true
        }
      }
      );
      console.log(response);
      dispatch(slice.actions.getMachineDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Active Machine Document-----------------------------------

export function getActiveMachineDocuments(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          machine: machineId
        }
      }
      );
      dispatch(slice.actions.getActiveMachineDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -------------------------------get Machine Document---------------------------------------

export function getMachineDocument(machineDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${machineDocumentId}`);
      // console.log("machine document : ", response)
      dispatch(slice.actions.getMachineDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------get Machine Document---------------------------------------

export function getMachineDocumentHistory(machineDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${machineDocumentId}`,{
        params: {
          historical : true
        }
      });
      // console.log("machine document : ", response)
      dispatch(slice.actions.getMachineDocumentHistorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document History Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ---------------------------------archive Machine Document -------------------------------------

export function deleteMachineDocument(machineDocumentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${machineDocumentId}` , 
      {
          isArchived: true, 
      });
      // console.log("response : ", response)
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


