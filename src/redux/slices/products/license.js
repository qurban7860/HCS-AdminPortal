import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  licenseFormVisibility: false,
  licenseViewFormVisibility: false,
  licenseEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  license: {},
  licenses: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'license',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET ADD FORM TOGGLE
    setLicenseFormVisibility(state, action){
      state.licenseFormVisibility = action.payload;
    },

    // SET EDIT FORM TOGGLE
    setLicenseEditFormVisibility(state, action){
      state.licenseEditFormVisibility = action.payload;
    },

    // SET VIEW TOGGLE
    setLicenseViewFormVisibility(state, action){
      state.licenseViewFormVisibility = action.payload;
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
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setLicenseFormVisibility,
  setLicenseEditFormVisibility,
  setLicenseViewFormVisibility,
  resetLicense,
  resetLicenses,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

export const LicenseTypes = [ 'Type 1','Type 2','Type 3','Type 4']

// ----------------------------------------------------------------------

export function addLicense (machineId, params){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      // License Key and Machine ID
      const data = {};
      // data.machine=`${machineId}`;
      data.licenseKey=params?.licenseKey;
      data.isActive=params?.isActive;

      // License Details
      data.licenseDetail={};
      data.licenseDetail.version= params?.version;
      data.licenseDetail.type= params?.type;
      data.licenseDetail.deviceName= params?.deviceName;
      data.licenseDetail.deviceGUID= params?.deviceGUID;
      data.licenseDetail.production= params?.production;
      data.licenseDetail.waste= params?.waste;
      data.licenseDetail.extensionTime= params?.extensionTime;
      data.licenseDetail.requestTime= params?.requestTime;
      
      await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses`,data);
      await dispatch(setLicenseFormVisibility(false));
    } catch (error) {
      console.log(error);
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

export function getLicense(machineId, Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${Id}`);
      dispatch(slice.actions.getLicenseSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteLicense(machineId, Id) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${Id}`, {
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

export async function updateLicense(machineId,Id,params) {

  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      // License Key
      const data = {};
      data.licenseKey=params?.licenseKey;
      data.isActive=params?.isActive;
      
      // License Details
      data.licenseDetail={};
      data.licenseDetail.version= params?.version;
      data.licenseDetail.type= params?.type;
      data.licenseDetail.deviceName= params?.deviceName;
      data.licenseDetail.deviceGUID= params?.deviceGUID;
      data.licenseDetail.production= params?.production;
      data.licenseDetail.waste= params?.waste;
      data.licenseDetail.extensionTime= params?.extensionTime;
      data.licenseDetail.requestTime= params?.requestTime;
      
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/licenses/${Id}`,data);
      await dispatch(setLicenseEditFormVisibility(false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}