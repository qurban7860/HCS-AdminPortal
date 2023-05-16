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

export function addMachineDocument(machineId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/`, data);
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getMachineDocuments(machineId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Machine Document-------------------------------------

export function updateMachineDocument(machineId,MachineDocumentId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
      }
    //   const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('Machine Document updated successfully'));
      dispatch(setMachineDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDocuments(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/techparamvalues` , 
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

export function getMachineDocument(machineId,settingId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getMachineDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Machine Document -------------------------------------

export function deleteMachineDocument(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${id}` , 
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


