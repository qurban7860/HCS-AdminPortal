import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  userInvite: {},
  userInvites: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'invite',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  UserInvite
    getUserInvitesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.userInvites = action.payload;
      state.initial = true;
    },

    // GET UserInvite
    getUserInviteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.userInvite = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET LICENSE
    resetUserInvite(state){
      state.userInvite = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetUserInvites(state){
      state.userInvites = [];
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
  resetUserInvite,
  resetUserInvites,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

export function getUserInvites (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/invites/`);
      dispatch(slice.actions.getUserInvitesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('User Invites loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function postSecurityUserInvitation(param) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        customer: param.customer?._id,
        contact: param.contact?._id,
        name: param.name,
        phone:  param.phone,
        email: param.email,
        login: param.email,
        password: param.password,
        roles: param.roles.map(role => role?._id ),
        dataAccessibilityLevel: param?.dataAccessibilityLevel?.toUpperCase() ,
        regions: param.regions?.map(region => region?._id ),
        customers: param.customers?.map(customer => customer?._id),
        machines: param.machines?.map(machines => machines?._id),
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/invites/postUserInvite`, data);
      dispatch(slice.actions.stopLoading());
      return response;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getUserInvite(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/invites/${Id}`);
      dispatch(slice.actions.getUserInviteSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('User Invite loaded successfully'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function cancelUserInvite(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/invites/${Id}`, {status: 'CANCELLED'});
      dispatch(slice.actions.stopLoading());
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------------------------------------------------

export function resendUserInvite(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}security/invites/resendUserInvite/${Id}`);
      dispatch(slice.actions.stopLoading());
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
