import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  formVisibility: false,
  editFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  configs: [],
  config: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'userConfig',
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
    setConfigFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET VISIBILITY
    setConfigEditFormVisibility(state, action){
      state.editFormVisibility = action.payload;
    },

    // GET  Config
    getConfigsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.configs = action.payload;
      state.initial = true;
    },

    // GET Config
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

    // RESET Config
    resetConfig(state){
      state.config = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET ConfigS
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
  setFormVisibility,
  setEditFormVisibility,
  resetConfigs,
  resetConfig,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;
// ----------------------------------------------------------------------

export function addConfig(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {}
        if(params.BlockedUsers){
            data.blockedUsers = params.blockedUsers
        }
        if(params.BlockedCustomers){
            data.blockedCustomers = params.blockedCustomers
        }
        if(params.whiteListIPs){
            data.whiteListIPs = params.whiteListIPs
        }if(params.blackListIPs){
            data.blackListIPs = params.blackListIPs
        }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/configs/`, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function updateConfig(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        blockedUsers: params.BlockedUsers,
        blockedCustomers: params.BlockedCustomers,
        whiteListIPs: params.whiteListIPs,
        blackListIPs: params.blackListIPs,
      }
      await axios.patch(`${CONFIG.SERVER_URL}security/configs/${id}`, data);
    } catch (error) {
      console.log(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function getConfigs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs`,
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getConfigsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs/${id}`);
      dispatch(slice.actions.getConfigSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/configs/${id}`,
      {
        isArchived: true, 
      }
      )
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetConfig());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}