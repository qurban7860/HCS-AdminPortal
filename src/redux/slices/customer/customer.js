import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

const _ = require('lodash');

// ---------------------------------------------------------------------
const initialState = {
  intial: false,
  customerEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customers: [],
  activeCustomers: [],
  allCustomers: [],
  spCustomers: [],
  customer: {},
  customerDialog: false,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },

    // SET TOGGLE
    setCustomerEditFormVisibility(state, action){
      state.customerEditFormFlag = action.payload;
    },

    // SET TOGGLE
    setCustomerDialog(state, action){
      state.customerDialog = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Customers
    getCustomersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customers = action.payload;
      state.initial = true;
    },

    // GET Active Customers
    getActiveCustomersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeCustomers = action.payload;
      state.initial = true;
    },

    // GET Active Customers
    getAllCustomersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.allCustomers = action.payload;
      state.initial = true;
    },

    // GET Active Customers
    getActiveSPCustomersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.spCustomers = action.payload;
      state.initial = true;
    },

    // GET Customer
    getCustomerSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customer = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET CUSTOMER
    resetCustomer(state){
      state.customer = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CUSTOMERS
    resetCustomers(state){
      state.customers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET Active CUSTOMERS
    resetActiveCustomers(state){
      state.activeCustomers = [];
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
  setCustomerEditFormVisibility,
  resetCustomer,
  resetCustomers,
  resetActiveCustomers,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setCustomerDialog,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
      {
        params: {
          isArchived: false,
          orderBy : {
            createdAt:-1
          }
        }
      });
      dispatch(slice.actions.getCustomersSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Customers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- get Active Customers------------------------------------------

export function getActiveCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
      {
        params: {
          isActive: true,
          isArchived: false
        }
      });
      dispatch(slice.actions.getActiveCustomersSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Customers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ---------------------------- get Active Customers------------------------------------------

export function getAllCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
      {
        params: {
          unfiltered: true,
          isActive: true,
          isArchived: false
        }
      });
      dispatch(slice.actions.getAllCustomersSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Customers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- get Active Customers------------------------------------------

export function getCustomersAgainstCountries(countries) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/getCustomersAgainstCountries`,
      {
        params: {
          isActive: true,
          isArchived:false,
          type: 'SP',
          countries
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ---------------------------- get Active SP Customers------------------------------------------

export function getActiveSPCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
      {
        params: {
          isActive: true,
          isArchived: false,
          type: 'SP'
        }
      });
      dispatch(slice.actions.getActiveSPCustomersSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Customers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getCustomer(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}` ,
      {
        params: {
          flag: 'basic',
        }
      }
      );
      dispatch(slice.actions.getCustomerSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteCustomer(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${id}`,
      {
        isArchived: true,
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addCustomer(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetCustomer());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          tradingName: params.tradingName,
          isActive: params.isActive,
          mainSite: {
            name: params.name,
            address: {},
          },
          type: params.type
        };

        let billingContact = {};
        let technicalContact = {};
        /* eslint-enable */
        // params.accountManager ? data.accountManager = params.accountManager : '';

        if(params.accountManager !== "null" && params.accountManager !== "undefined") {
          data.accountManager = params.accountManager;
        }

        // params.projectManager ? data.projectManager = params.projectManager : '';
        if(params.projectManager !== "null" && params.projectManager !== "undefined"){
          data.projectManager = params.projectManager;
        }

        // params.supportManager ? data.supportManager = params.supportManager : '';
        if(params.supportManager !== "null" && params.supportManager !== "undefined"){
          data.supportManager = params.supportManager;
        }

        // params.phone ? data.phone = params.supportManager : '';
        if(params.phone){
          data.mainSite.phone = params.phone;
        }

        // params.email ? data.email = params.email : '';
        if(params.email){
          data.mainSite.email = params.email;
        }

        if(params.fax){
          data.mainSite.fax = params.fax;
        }

        if(params.website){
          data.mainSite.website = params.website;
        }

        if(params.street){
          data.mainSite.address.street = params.street;
        }

        if(params.suburb){
          data.mainSite.address.suburb = params.suburb;
        }

        if(params.city){
          data.mainSite.address.city = params.city;
        }

        if(params.postcode){
          data.mainSite.address.postcode = params.postcode;
        }

        if(params.region){
          data.mainSite.address.region = params.region;
        }

        if(params.country){
          data.mainSite.address.country = params.country;
        }

        // Billing Contact Information Start
        if(params.billingFirstName){
          billingContact.firstName = params.billingFirstName;
        }

        if(params.billingLastName){
          billingContact.lastName = params.billingLastName;
        }

        if(params.billingTitle){
          billingContact.title = params.billingTitle;
        }

        if(params.billingContactPhone){
          billingContact.phone = params.billingContactPhone;
        }
        if(params.billingContactEmail){
          billingContact.email = params.billingContactEmail;
        }
        // Billing Contact Information End

        // Technical Contact Information Start
        if(params.technicalFirstName){
          technicalContact.firstName = params.technicalFirstName;
        }

        if(params.technicalLastName){
          technicalContact.lastName = params.technicalLastName;
        }

        if(params.technicalTitle){
          technicalContact.title = params.technicalTitle;
        }

        if(params.technicalContactPhone){
          technicalContact.phone = params.technicalContactPhone;
        }
        if(params.technicalContactEmail){
          technicalContact.email = params.technicalContactEmail;
        }
        // Technical Contact Information End

        if(!_.isEmpty(billingContact)){
          data.billingContact = billingContact;
          if(params.sameContactFlag){
            data.technicalContact = billingContact;
          }
        }

        if(!params.sameContactFlag && !_.isEmpty(technicalContact)){
          data.technicalContact = technicalContact;
        }

        const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers`, data);
        return response
        // dispatch(slice.actions.getCustomerSuccess(response.data.Customer));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}
// ------------------------ Customer Verification ----------------------------------------

export function setCustomerVerification(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}`,{
        isVerified: true,
      });
      dispatch(getCustomer(customerId));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

// --------------------------------------------------------------------------

export function updateCustomer(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        tradingName: params.tradingName,
        isActive: params.isActive,
      };
     /* eslint-enable */
      if(params.mainSite !== "null" && params.mainSite !== null){
        data.mainSite = params.mainSite;
      }else{
        data.mainSite = null;
      }
      if(params.accountManager !== "null" && params.accountManager !== null){
        data.accountManager = params.accountManager;
      }else{
        data.accountManager = null;
      }
      if(params.projectManager !== "null" && params.projectManager !== null){
        data.projectManager = params.projectManager;
      }else{
        data.projectManager = null;
      }
      if(params.supportManager !== "null" && params.supportManager !== null){
        data.supportManager = params.supportManager;
      }else{
        data.supportManager = null;
      }
      if(params.primaryBillingContact !== "null" && params.primaryBillingContact !== null){
        data.primaryBillingContact = params.primaryBillingContact;
      }else{
        data.primaryBillingContact = null;
      }
      if(params.primaryTechnicalContact !== "null" && params.primaryTechnicalContact !== null){
        data.primaryTechnicalContact = params.primaryTechnicalContact;
      }else{
        data.primaryTechnicalContact = null;
      }
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${params.id}`,
        data
      );

      dispatch(getCustomer(params.id));
      dispatch(slice.actions.setCustomerEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      dispatch(slice.actions.stopLoading());
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };

}