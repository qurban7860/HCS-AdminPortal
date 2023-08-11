import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  configAddFormVisibility: false,
  configEditFormVisibility: false,
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  name: null,
  description: null,
  countries: [],
  config: {},
  configs: [],
  activeConfigs: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'config',
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
    setConfigAddFormVisibility(state, action){
      state.configAddFormVisibility = action.payload;
    },

    // SET VISIBILITY
    setConfigEditFormVisibility(state, action){
      state.configEditFormVisibility = action.payload;
    },

    // GET configs
    getConfigsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.configs = action.payload;
      state.initial = true;
    },

    // GET Active configs
    getActiveConfigsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeConfigs = action.payload;
      state.initial = true;
    },

    // GET configs
    getCountriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.countries = action.payload;
      state.initial = true;
    },

    getConfigSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.config = action.payload;
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
    resetConfig(state){
      state.config = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SECURITY USERS
    resetConfigs(state){
      state.configs = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
  setConfigAddFormVisibility,
  setConfigEditFormVisibility,
  getConfigsSuccess,
  getConfigSuccess,
  resetConfig,
  resetConfigs,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;
// ----------------------------------------------------------------------

export function addConfig(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(resetConfig());
    try{
      const data = {
        name: param.name,
        value: param.value,
        isActive: param.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}configs`, data);
      if(regEx.test(response.status)){
        dispatch(setConfigAddFormVisibility(false))
        dispatch(getConfigs());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateConfig(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        name: param.name,
        value: param.value,
        isActive: param.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}configs/${id}`, data);
      dispatch(resetConfig());
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

export function getConfigs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}configs`,
      {
        params: {
          isArchived: false
        }
      }
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.getConfigsSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getActiveConfigs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}configs`,
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveConfigsSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}configs/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getConfigSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}configs/${id}`,
      {
        isArchived: true, 
      }
      );
      // state.responseMessage = response.data;
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetConfig())
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
