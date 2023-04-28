import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  securityUserFormVisibility: false,
  securityUserEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  securityUsers: [],
  securityUser: null,
};

const slice = createSlice({
  name: 'user',
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
    setSecurityUserFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET VISIBILITY
    setSecurityUserEditFormVisibility(state, action){
      state.editFormVisibility = action.payload;
    },

    // RESET USERS
    resetSecurityUsers(state){
      state.users = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET USER
    resetSecurityUser(state){
      state.securityUser = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // GET users
    getSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.securityUsers = action.payload;
      state.initial = true;
    },


    // GET user
    getSecurityUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.securityUser = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setSecurityUserFormVisibility,
  setSecurityUserEditFormVisibility,
  resetUsers,
  resetUser,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions;
// ----------------------------------------------------------------------

export function addSecurityUser(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
      customer: param.customer,
      contact: param.contact,
      name: param.name,
      email: param.email,
      password: param.password,
      phone:  param.phone,
      roles: param.roles,
      login: param.email,
      isActive: param.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/users`, data);
      dispatch(slice.actions.setResponseMessage('User Saved successfully'));
      dispatch(setSecurityUserFormVisibility(false))
      dispatch(getSecurityUsers());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function updateSecurityUser(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        customer: param.customer,
        contact: param.contact,
        name: param.name,
        email: param.email,
        phone:  param.phone,
        login: param.loginEmail,
        roles: param.roles,
        isActive: param.isActive
        }
        if(param.password !== ""){
            data.password = param.password 
        }
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`, data);
      dispatch(slice.actions.setResponseMessage('User updated successfully'));
      dispatch(getSecurityUsers());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function getSecurityUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getSecurityUsersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Users loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function getSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
      dispatch(slice.actions.getSecurityUserSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('User Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`,
      {
        isArchived: true, 
      }
      );
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}