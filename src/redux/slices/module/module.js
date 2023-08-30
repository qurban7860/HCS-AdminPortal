import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
// ----------------------------------------------------------------------
const modEx = /^[^2]*/
const initialState = {
  moduleAddFormVisibility: false,
  moduleEditFormVisibility: false,
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  module: {},
  modules: [],
  activeModules: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    // START LOADING
    deleteModuleSuccess(state, action) {
      // Handle the module deletion success here
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    startLoading(state) {
      state.isLoading = true;
    },

    getModule: (state) => {
     
      },
  
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // SET VISIBILITY
    setModuleAddFormVisibility(state, action){
      state.moduleAddFormVisibility = action.payload;
    },

    // SET VISIBILITY
    setModuleEditFormVisibility(state, action){
      state.moduleEditFormVisibility = action.payload;
    },

    // GET module
    getModuleSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.module = action.payload;
      state.initial = true;
    },

    // GET Active modules
    getActiveModulesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeModules = action.payload;
      state.initial = true;
    },


    getModulesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.modules= action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setModuleMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Module USER
    resetModule(state){
      state.module = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Module USERS
    resetModules(state){
      state.modules = [];
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

export default slice.reducer;

// Actions
export const {
  setModuleAddFormVisibility,
  setModuleEditFormVisibility,
  getModulesSuccess,
  getModuleSuccess,
  deleteModuleSuccess,
  resetModule,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;
// ----------------------------------------------------------------------

export function AddModule(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // dispatch(resetRegion());
    try{
      const data = {
      name: param.name,
      description: param.description,
      isActive: param.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/modules`, data);
      
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateModule(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        name: param.name,
        description: param.description,
        isActive: param.isActive,
        }
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/modules/${id}`,data);
      // dispatch(resetRegion());
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

export function getModules() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/modules`,
      {
        params: {
          isArchived: false
        }
      }
      );
      if(modEx.test(response.status)){
        dispatch(slice.actions.getModulesSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getActiveModules() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/modules`,
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      if(modEx.test(response.status)){
        dispatch(slice.actions.getActiveModulesSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getModule(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/modules/${id}`);
      if(modEx.test(response.status)){
        dispatch(slice.actions.getModuleSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteModule(id) {
  console.log('path working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const response = await axios.patch(`${CONFIG.SERVER_URL}security/modules/${id}`,
      {
        isArchived: true,
       }
      );

      // state.responseMessage = response.data;
      if(modEx.test(response.status)){
      dispatch(slice.actions.deleteModuleSuccess(response.data));
      dispatch(resetModule())
    } 
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getValue() {
  console.log('path working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/modules`);
      if(modEx.test(response.status)){
        dispatch(slice.actions.getValueSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}