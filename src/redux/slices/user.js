import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  formVisibility: false,
  editFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  users: [],
  user: null,
  values: {
    firstName: 0,
    lastName: 0,
    email: 0,
    password: null,
    address: 0,
    country: null,
    state: null,
    city: null,
    zip: 0,
    about: 0,
    addedBy: null,
    image: null,
  }
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
    setFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET VISIBILITY
    setEditFormVisibility(state, action){
      state.editFormVisibility = action.payload;
    },

    // RESET USERS
    resetUsers(state){
      state.users = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET USER
    resetUser(state){
      state.user = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // GET users
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.users = action.payload;
      state.initial = true;
    },


    // GET user
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.user = action.payload;
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
  setFormVisibility,
  setEditFormVisibility,
  resetUsers,
  resetUser,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions;
// ----------------------------------------------------------------------

export function saveUser(param) {
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

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function updateUser(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        customer: param.customer,
        contact: param.contact,
        name: param.name,
        email: param.email,
        phone:  param.phone,
        roles: param.roles,
        login: param.email,
        isActive: param.isActive
        }
        if(param.password === ""){
            data.password = param.password 
        }
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`, data);
      dispatch(slice.actions.setResponseMessage('User updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
// ----------------------------------------------------------------------

export function getUsers() {
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
      dispatch(slice.actions.getUsersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Users loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function getUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
      dispatch(slice.actions.getUserSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('User Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}security/users/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}