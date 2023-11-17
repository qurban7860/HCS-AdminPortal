import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  formVisibility: false,
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  blacklistIPs: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'blacklistIP',
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
    setBlacklistIPFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // GET  Blocked Customers 
    getBlacklistIPsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.blacklistIPs = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    
    // RESET BlacklistIPs
    resetBlacklistIPs(state){
      state.blacklistIPs = [];
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
  resetBlacklistIPs,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addBlacklistIPs(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}security/configs/Blacklistips/`, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export function getBlacklistIPs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs/Blacklistips`,
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getBlacklistIPsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteBlacklistIP(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/configs/Blacklistips/${id}`,
      {
        isArchived: true, 
      }
      )
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetBlacklistIPs());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}