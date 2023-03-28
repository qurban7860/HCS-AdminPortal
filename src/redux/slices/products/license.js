import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  licenseEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  licenses: [],
  license: {},
  licenseParams: {

  }
};

const slice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setLicenseEditFormVisibility(state, action){
      state.licenseEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetLicense(state){
      state.machine = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;

    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Customers
    getLicensesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.licenses = action.payload;
      state.initial = true;
    },

    // GET Customer
    getLicenseSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.license = action.payload;
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
  setLicenseEditFormVisibility,
  resetLicense,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createLicenses (machineId, supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses`,supplyData);
      // dispatch(slice.actions)
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getLicenses (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses`);

      dispatch(slice.actions.getLicensesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Licenses loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}

// ----------------------------------------------------------------------

export function getLicense(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${id}`);
      dispatch(slice.actions.getLicensesSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteLicense(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${id}`);
     
      dispatch(slice.actions.setResponseMessage(response.data));
      // get again suppliers 
      
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
