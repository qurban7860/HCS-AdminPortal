import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
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
  loggedInUser: null
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
    // GET users
    getSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.securityUsers = action.payload;
      state.initial = true;
    },

    getLoggedInSecurityUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.loggedInUser = action.payload;
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

    // RESET SECURITY USER
    resetSecurityUser(state){
      state.securityUser = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SECURITY USERS
    resetSecurityUsers(state){
      state.securityUsers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setSecurityUserFormVisibility,
  setSecurityUserEditFormVisibility,
  resetSecurityUsers,
  resetSecurityUser,
 
} = slice.actions;
// ----------------------------------------------------------------------

export function addSecurityUser(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(resetSecurityUser());
    try{
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
      if(regEx.test(response.status)){
        dispatch(setSecurityUserFormVisibility(false))
        dispatch(getSecurityUsers());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateSecurityUser(param,id) {
  return async (dispatch) => {
    dispatch(resetSecurityUser());
    dispatch(slice.actions.startLoading());
    try{
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
      if(regEx.test(response.status)){
        dispatch(getSecurityUsers());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getSecurityUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,
      {
        params: {
          isArchived: false
        }
      }
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.getSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
      // console.log("response: " ,response);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getSecurityUserSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getLoggedInSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{  
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
        // console.log("response: " ,response);
        if(regEx.test(response.status)){
          dispatch(slice.actions.getLoggedInSecurityUserSuccess(response.data));
        }
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
  };
}

// ----------------------------------------------------------------------

export function deleteSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`,
      {
        isArchived: true, 
      }
      );
      // state.responseMessage = response.data;
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetSecurityUser())
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
//------------------------------------------------------------------------------

export function SecurityUserPasswordUpdate(data, Id, isAdmin) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      if(isAdmin){
        data.isAdmin = true
      };

      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/updatePassword/${Id}`,
        data
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
      }
      return response; // eslint-disable-line
    } catch (error) {
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}
