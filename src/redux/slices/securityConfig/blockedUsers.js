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
  blockedUsers: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'blockedUser',
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
    setBlockedUserFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // GET  Blocked Customers 
    getBlockedUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.blockedUsers = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    
    // RESET BlockedUsers
    resetBlockedUsers(state){
      state.blockedUsers = [];
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
  resetBlockedUsers,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addBlockedUsers(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}security/configs/blockedUsers/`, data);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export function getBlockedUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs/blockedUsers`,
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getBlockedUsersSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteBlockedUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/configs/blockedUsers/${id}`,
      {
        isArchived: true, 
      }
      )
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetBlockedUsers());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}