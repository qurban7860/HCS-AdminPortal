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
  spContacts: [],
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
      state.error = null;

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

    // GET SP Contacts
    getSPContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.spContacts = action.payload;
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
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function saveContact(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      if(params.customer){
        formData.append('customerId', params.customer);
      }
      formData.append('firstName', params.firstName);
      formData.append('lastName', params.lastName);
      formData.append('title', params.title);
      formData.append('contactTypes', params.contactTypes);
      formData.append('phone', params.phone);
      formData.append('email', params.email);
      formData.append('isPrimary', params.isPrimary);



      const response = await axios.post(`${CONFIG.SERVER_URL}contacts`,
        formData,
      );
      dispatch(slice.actions.setResponseMessage('Contacts saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateContact(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      formData.append('id', params.id);
      if(params.customer){
        formData.append('customerId', params.customer);
      }
      formData.append('firstName', params.firstName);
      formData.append('lastName', params.lastName);
      formData.append('title', params.title);
      formData.append('contactTypes', params.contactTypes);
      formData.append('phone', params.phone);
      formData.append('email', params.email);

      const response = await axios.patch(`${CONFIG.SERVER_URL}contacts/${params.id}`,
        formData
      );
      dispatch(slice.actions.setResponseMessage('Contact updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getSPContacts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/contacts/sp/data`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getContacts(customerId = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const customerFilter  =  
      {params: {
          customer: customerId
      }};
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/contacts`, customerFilter);
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


