import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
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
    },

    // GET users
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.users = action.payload;
    },

    // GET user
    getUsersuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.user = action.payload;
    },

    async saveUser(state, action){
      try {
        // console.log('id', action.payload.model);
        
        const formData = new FormData();

        formData.append('id',action.payload.id);
        formData.append('name', action.payload.displayName);
        formData.append('email', action.payload.email);
        formData.append('password', action.payload.password);
        formData.append('address', action.payload.address);
        formData.append('country', action.payload.country);
        formData.append('state', action.payload.state);
        formData.append('city', action.payload.city);
        formData.append('about', action.payload.email);
        formData.append('addedBy', action.payload.email);
        formData.append('image', action.payload.photoURL);

        console.log('formdata', formData);

        if(action.payload.editUser){
          if(action.payload.replaceImage){
            formData.append('replaceImage', action.payload.replaceImage);
            formData.append('image', action.payload.image);
          }
          const response = await axios.patch('http://localhost:5000/api/1.0.0/users',
          action.payload.id 
          );
        }
        
        else{
          formData.append('image', action.payload.image);
          const response = await axios.post('http://localhost:5000/api/1.0.0/users', 
          formData,
          );
        }
        
      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }
      
    },
    async deleteUser(state, action){
      try{
        const userID = action.payload;
        console.log(action.payload)
        const response = await axios.delete('http://localhost:5000/api/1.0.0/users', {
          userID
        });
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
  deleteUser,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:5000/api/1.0.0/users');
      console.log(response.data);
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUser(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:5000/api/users/user', {
        params: { name },
      });
      dispatch(slice.actions.getUsersuccess(response.data.user));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
