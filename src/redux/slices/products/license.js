import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  formVisibility: false,
  licenseEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  license: {},
  licenses: [],
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
      state.licenseEditFormVisibility = action.payload;
    },
    
    // SET TOGGLE
    setLicenseFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  License
    getLicensesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.licenses = action.payload;
      state.initial = true;
    },

    // GET License
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


    // RESET LICENSE
    resetLicense(state){
      state.license = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetLicenses(state){
      state.licenses = [];
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
  setLicenseEditFormVisibility,
  setLicenseFormVisibility,
  resetLicense,
  resetLicenses,
  setResponseMessage,
} = slice.actions;


// ----------------------------------------------------------------------

export function addLicense (machineId, supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses`,supplyData);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------


export function getLicenses (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses`,
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getLicensesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Licenses loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteLicense(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${id}`, {
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

// --------------------------------------------------------------------------

export function updateLicense(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        serialNo: params.serialNo,
        isDisabled: params.isDisabled,
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${Id}`,
        data
      );
      dispatch(getLicense(Id));
      dispatch(slice.actions.setLicenseEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}