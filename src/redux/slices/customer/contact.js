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
  activeContacts: [],
  spContacts: [],
  activeSpContact:[],
  contactDialog:false,
  contact: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
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
    setContactFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setContactEditFormVisibility(state, action){
      state.contactEditFormVisibility = action.payload;
    },

    // SET TOGGLE
    setContactDialog(state, action){
      state.contactDialog = action.payload;
    },

    // RESET CONTACT
    resetContact(state){
      state.contact = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CONTACTS
    resetContacts(state){
      state.contacts = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET ACTIVE CONTACTS
    resetActiveContacts(state){
      state.activeContacts = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
      
    // GET Contacts
    getContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.contacts = action.payload;
      state.initial = true;
    },

    // GET Contacts
    getActiveContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeContacts = action.payload;
      state.initial = true;
    },

    // GET SP Contacts
    getSPContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.spContacts = action.payload;
      state.initial = true;
    },

    getActiveSPContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSpContacts = action.payload;
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

    resetActiveSPContacts(state){
      state.activeSpContacts = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
  setContactFormVisibility,
  setContactEditFormVisibility,
  resetContact,
  resetContacts,
  resetActiveContacts,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setContactDialog,
} = slice.actions;

// ----------------------------------------------------------------------

export function addContact(params) {
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
        isActive: params.isActive,
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

      await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/contacts`,
        data,
      );

      dispatch(slice.actions.setContactFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Site saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateContact(customerId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.setContactEditFormVisibility(false));

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
        isActive: params.isActive,
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

      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/contacts/${params.id}`,
        data
      );
      dispatch(slice.actions.setResponseMessage('Contact updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getSPContacts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/sp/contacts`,
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      dispatch(slice.actions.getSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
            isArchived: false,
            orderBy : {
              createdAt:-1
            }
          }
        }
        );
      dispatch(slice.actions.getContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ get Active Contacts ----------------------------------------

export function getActiveSPContacts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/sp/contacts`,
        {
          params: {
            isActive: true,
            isArchived: false
          }
        }
        );
      dispatch(slice.actions.getActiveSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ get Active Contacts ----------------------------------------

export function getActiveContacts(customerID ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts` , 
        {
          params: {
            isActive: true,
            isArchived: false
          }
        }
        );
      dispatch(slice.actions.getActiveContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ------------------------------ get Contacts against CustomerArray ----------------------------------------

export function getCustomerArrayActiveContacts(customerArr) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/contacts/search` , 
        {
          params: {
            isActive: true,
            isArchived: false,
            customerArr
          }
        }
        );
      dispatch(slice.actions.getActiveContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


