import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  regionAddFormVisibility: false,
  regionEditFormVisibility: false,
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  name: null,
  description: null,
  countries: [],
  region: {},
  regions: []
};

const slice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // SET VISIBILITY
    setRegionAddFormVisibility(state, action){
      state.regionAddFormVisibility = action.payload;
    },

    // SET VISIBILITY
    setRegionEditFormVisibility(state, action){
      state.regionEditFormVisibility = action.payload;
    },

    // GET regions
    getRegionsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.regions = action.payload;
      state.initial = true;
    },

    // GET regions
    getCountriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.countries = action.payload;
      state.initial = true;
    },

    getRegionSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.region = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET SECURITY USER
    resetRegion(state){
      state.region = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SECURITY USERS
    resetRegions(state){
      state.regions = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setRegionAddFormVisibility,
  setRegionEditFormVisibility,
  getRegionsSuccess,
  getRegionSuccess,
  resetRegion,
  resetRegions,
} = slice.actions;
// ----------------------------------------------------------------------

export function addRegion(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(resetRegion());
    try{
      const data = {
      name: param.name,
      description: param.description,
      countries: param.countries,
      isActive: param.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}regions/regions`, data);
      if(regEx.test(response.status)){
        dispatch(setRegionAddFormVisibility(false))
        dispatch(getRegions());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateRegion(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        name: param.name,
        description: param.description,
        countries: param.countries,
        isActive: param.isActive,
        }
      const response = await axios.patch(`${CONFIG.SERVER_URL}regions/regions/${id}`, data);
      dispatch(resetRegion());
      // if(regEx.test(response.status)){
      //   dispatch(getSecurityUsers());
      // }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getRegions() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}regions/regions`,
      {
        params: {
          isArchived: false
        }
      }
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.getRegionsSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getRegion(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}regions/regions/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getRegionSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteRegion(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}regions/regions/${id}`,
      {
        isArchived: true, 
      }
      );
      // state.responseMessage = response.data;
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetRegion())
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getCountries() {
  console.log('path working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}regions/countries`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getCountriesSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}