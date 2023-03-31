import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
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

    async saveUser(state, action){
      try {
        
        const data = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          password: action.payload.password,
          address: action.payload.address,
          phoneNumber: action.payload.phoneNumber,
          country: action.payload.country,
          state: action.payload.state,
          city: action.payload.city,
          zip: action.payload.zipCode,
          addedBy: action.payload.email,
          isVerified: action.payload.isVerified,
          role: action.payload.role,
        };
        if(action.payload.avatarUrl){
          data.image = action.payload.avatarUrl
        }

        const response = await axios.post(`${CONFIG.SERVER_URL}users`, data);

      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }
    },

    async updateUser(state, action) {
      try {
        const data = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          password: action.payload.password,
          address: action.payload.address,
          phoneNumber: action.payload.phoneNumber,
          country: action.payload.country,
          state: action.payload.state,
          city: action.payload.city,
          zip: action.payload.zipCode,
          addedBy: action.payload.email,
          isVerified: action.payload.isVerified,
          role: action.payload.role,
        };

        if(action.payload.avatarUrl){
          data.image= action.payload.avatarUrl
        }

        const response = await axios.patch(`${CONFIG.SERVER_URL}users/${action.payload.id}`, data);

      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

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
  saveUser,
  updateUser,
  resetUsers,
  resetUser,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}users`);
      dispatch(slice.actions.getUsersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Users loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}users/${id}`);
      dispatch(slice.actions.getUserSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('User Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}users/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}