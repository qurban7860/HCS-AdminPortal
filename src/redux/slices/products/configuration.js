import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const regEx = /^[2][0-9][0-9]$/

const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  configuration: {},
  configurations: [],
  activeConfigurations: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'configuration',
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

    // GET  CONFIGURATION
    getConfigurationSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.configuration = action.payload;
      state.initial = true;
    },
        
    // GET  CONFIGURATIONS
    getConfigurationsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.configurations = action.payload;
      state.initial = true;
    },

    getActivConfigurationsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeConfigurations = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET 
    resetConfiguration(state){
      state.configuration = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetConfigurations(state){
      state.configurations = [];
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
  resetConfiguration,
  resetConfigurations,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addConfiguration(params){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        collectionType: params.collectionType,
        configJSON: params.configJSON,
        isActive: params.isActive,
      };
      await axios.post(`${CONFIG.SERVER_URL}configs/serviceSettings/`,data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getConfiguration(id){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}configs/serviceSettings/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getConfigurationSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getConfigurations(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}configs/serviceSettings`,
      {
        params: {
          isArchived: false,
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getConfigurationsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------- get Active Configurations ---------------------------------------------

export function getActiveConfigurations(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}configs/serviceSettings`,
      {
        params: {
          isActive: true,
          isArchived: false,
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActivConfigurationsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}



// --------------------------------------------------------------------------

export function updateConfiguration(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      /* eslint-disable */
      const data = {
        collectionType: params.collectionType,
        configJSON: params.configJSON,
        isActive: params.isActive,
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}configs/serviceSettings/${Id}`,data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//----------------------------------------------------------------

export function deleteConfiguration(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      await axios.patch(`${CONFIG.SERVER_URL}configs/serviceSettings/${id}`, 
      {
          isArchived: true, 
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
