import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  profileFormVisibility: false,
  profileViewFormVisibility: false,
  profileEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  profile: {},
  profiles: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET ADD FORM TOGGLE
    setProfileFormVisibility(state, action){
      state.profileFormVisibility = action.payload;
    },

    // SET EDIT FORM TOGGLE
    setProfileEditFormVisibility(state, action){
      state.profileEditFormVisibility = action.payload;
    },

    // SET VIEW TOGGLE
    setProfileViewFormVisibility(state, action){
      state.profileViewFormVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  Profile
    getProfilesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.profiles = action.payload;
      state.initial = true;
    },

    // GET Profile
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.profile = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET LICENSE
    resetProfile(state){
      state.profile = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetProfiles(state){
      state.profiles = [];
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
export const ProfileTypes = ['MANUFACTURER','CUSTOMER']

// Actions
export const {
  setProfileFormVisibility,
  setProfileEditFormVisibility,
  setProfileViewFormVisibility,
  resetProfile,
  resetProfiles,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addProfile (machineId, data){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles`,data);
      await dispatch(setProfileFormVisibility(false));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------


export function getProfiles (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles`,
      {
        params: {
          isArchived: false
        }
      });

      dispatch(slice.actions.getProfilesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Profiles loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getProfile(machineId, Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`);
      dispatch(slice.actions.getProfileSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteProfile(machineId, Id) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`, {
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

export async function updateProfile(machineId,Id,params) {

  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      // Profile Key
      // const data = {};
      // data.profileKey=params?.profileKey;
      // data.isActive=params?.isActive;
      
      // // Profile Details
      // data.profileDetail={};
      // data.profileDetail.version= params?.version;
      // data.profileDetail.type= params?.type;
      // data.profileDetail.deviceName= params?.deviceName;
      // data.profileDetail.deviceGUID= params?.deviceGUID;
      // data.profileDetail.production= params?.production;
      // data.profileDetail.waste= params?.waste;
      // data.profileDetail.extensionTime= params?.extensionTime;
      // data.profileDetail.requestTime= params?.requestTime;
      
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`,params);
      await dispatch(setProfileEditFormVisibility(false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}