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
        
        const formData = new FormData();

        formData.append('firstName', action.payload.firstName);
        formData.append('lastName', action.payload.lastName);
        formData.append('email', action.payload.email);
        formData.append('password', action.payload.password);
        formData.append('address', action.payload.address);
        formData.append('phoneNumber', action.payload.phoneNumber);
        formData.append('country', action.payload.country);
        formData.append('state', action.payload.state);
        formData.append('city', action.payload.city);
        formData.append('zip', action.payload.zipCode);
        formData.append('addedBy', action.payload.addedBy);
        formData.append('isVerified', action.payload.isVerified);
        formData.append('role', action.payload.role);

        
        formData.append('image', action.payload.avatarUrl);

        console.log('formdata', formData);

        const response = await axios.post(`${CONFIG.SERVER_URL}users`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateUser(state, action) {
      try {

        const formData = new FormData();
        formData.append('id', action.payload.id);
        formData.append('firstName', action.payload.firstName);
        formData.append('lastName', action.payload.lastName);
        formData.append('email', action.payload.email);
        formData.append('password', action.payload.password);
        formData.append('address', action.payload.address);
        formData.append('phoneNumber', action.payload.phoneNumber);
        formData.append('country', action.payload.country);
        formData.append('state', action.payload.state);
        formData.append('city', action.payload.city);
        formData.append('zip', action.payload.zipCode);
        formData.append('addedBy', action.payload.email);
        formData.append('isVerified', action.payload.isVerified);
        formData.append('role', action.payload.role);
        if(action.payload.avatarUrl){
          formData.append('image', action.payload.avatarUrl);
        }

        const response = await axios.patch(`${CONFIG.SERVER_URL}users/${action.payload.id}`,
          formData
        );

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
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}