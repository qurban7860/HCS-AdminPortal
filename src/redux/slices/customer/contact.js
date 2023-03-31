import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  formVisibility: false,
  contactEditFormVisibility: false,
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

    // SET TOGGLE
    setFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setEditFormVisibility(state, action){
      state.contactEditFormVisibility = action.payload;
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
  setFormVisibility,
  setEditFormVisibility,
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
      /* eslint-disable */
      let data = {
        customer: params.customer,
        firstName: params.firstName,
        lastName: params.lastName,
        customer: params.customer,
        title: params.title,
        contactTypes: params.contactTypes,
        phone: params.phone,
        email: params.email,
        address: {}

      };

      /* eslint-enable */
      if(params.street){
        data.address.street = params.street;        
      }
      if(params.suburb){
        data.address.suburb = params.suburb;        
      }
      if(params.city){
        data.address.city = params.city;        
      }
      if(params.region){
        data.address.region = params.region;        
      }
      if(params.postcode){
        data.address.postcode = params.postcode;        
      }
      if(params.country !== "null" && params.country !== null){
        data.address.country = params.country;        
      }

      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/contacts`,
        data,
      );

      dispatch(slice.actions.setFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Site saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateContact(customerId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.setEditFormVisibility(false));

    try {
      /* eslint-disable */
      let data = {
        customer: customerId,
        firstName: params.firstName,
        lastName: params.lastName,
        customer: params.customer,
        title: params.title,
        contactTypes: params.contactTypes,
        phone: params.phone,
        email: params.email,
        address: {}
      };

      /* eslint-enable */

      if(params.street){
        data.address.street = params.street;        
      }
      if(params.suburb){
        data.address.suburb = params.suburb;        
      }
      if(params.city){
        data.address.city = params.city;        
      }
      if(params.region){
        data.address.region = params.region;        
      }
      if(params.postcode){
        data.address.postcode = params.postcode;        
      }
      if(params.country !== "null" && params.country !== null){
        data.address.country = params.country;        
      }

      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/contacts/${params.id}`,
        data
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
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/sp/contacts`)
      dispatch(slice.actions.getSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getContacts(customerID ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts` , 
        {
          params: {
            isArchived: false
          }
        }
        );
      dispatch(slice.actions.getContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getContact(customerID, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`);
      dispatch(slice.actions.getContactSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Contacts Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteContact(customerID, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        isArchived: true,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`,
        data
      );
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


