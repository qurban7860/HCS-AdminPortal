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
  contacts: [],
  contact: null,
  contactParams: {

  }
};

const slice = createSlice({
  name: 'contact',
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

    // GET Contacts
    getContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.contacts = action.payload;
      state.initial = true;
    },

    // GET Contact
    getContactSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.contact = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    async saveContact(state, action) {
      try {
        const formData = new FormData();
        if(action.payload.customer){
          formData.append('customerId', action.payload.customer);
        }
        formData.append('firstName', action.payload.firstName);
        formData.append('lastName', action.payload.lastName);
        formData.append('title', action.payload.title);
        formData.append('contactTypes', action.payload.contactTypes);
        formData.append('phone', action.payload.phone);
        formData.append('email', action.payload.email);
        formData.append('isPrimary', action.payload.isPrimary);
  


        const response = await axios.post(`${CONFIG.SERVER_URL}contacts`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateContact(state, action) {
      try {

        const formData = new FormData();

        formData.append('id', action.payload.id);
        if(action.payload.customer){
          formData.append('customerId', action.payload.customer);
        }
        formData.append('customerId', action.payload.customer);
        formData.append('firstName', action.payload.firstName);
        formData.append('lastName', action.payload.lastName);
        formData.append('title', action.payload.title);
        formData.append('contactTypes', action.payload.contactTypes);
        formData.append('phone', action.payload.phone);
        formData.append('email', action.payload.email);

        const response = await axios.patch(`${CONFIG.SERVER_URL}contacts/${action.payload.id}`,
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
  saveContact,
  updateContact,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getContacts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}contacts`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getContact(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}contacts/${id}`);
      dispatch(slice.actions.getContactSuccess(response.data));
      console.log('requested contact', response.data);
      // dispatch(slice.actions.setResponseMessage('Contacts Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteContact(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}contacts/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


