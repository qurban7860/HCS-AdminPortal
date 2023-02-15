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
  customerEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customers: [],
  customer: {},
  customerParams: {

  }
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setCustomerEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.customerEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetCustomer(state){
      state.customer = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;

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

    // GET Customer
    getCustomerSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.customer = action.payload;
      state.initial = true;
      console.log('customersuccessslice', state.customer);
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
  setCustomerEditFormVisibility,
  resetCustomer,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/customers`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getCustomersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Customers loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCustomer(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/customers/${id}`);
      dispatch(slice.actions.getCustomerSuccess(response.data));
      console.log('requested customer', response.data);
      // dispatch(slice.actions.setResponseMessage('Customers Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteCustomer(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}customers/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------

export function saveCustomer(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetCustomer());
      dispatch(slice.actions.startLoading());
      try {
        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('tradingName', params.tradingName);

        /* eslint-disable */
        let data = {
          name: params.name,
          tradingName: params.tradingName
        };
        /* eslint-enable */

        if(params.mainSite){
          data.mainSite = params.mainSite;
        }
        if(params.sites.length > 0){
          data.sites = params.sites;
        }
        if(params.contacts.length > 0){
          formData.append('contacts', params.contacts);
        }
        if(params.accountManager){
          data.accountManager = params.accountManager;        
        }
        if(params.projectManager){
          data.projectManager = params.projectManager;        
        }
        if(params.supportManager){
          data.supportManager = params.supportManager;        
        }
        if(params.primaryBillingContact){
          data.primaryBillingContact = params.primaryBillingContact;        
        }
        if(params.primaryTechnicalContact){
          data.primaryTechnicalContact = params.primaryTechnicalContact;        
        }


        const response = await axios.post(`${CONFIG.SERVER_URL}customers/customers`, data);

        console.log('response', response.data.Customer);
        dispatch(slice.actions.getCustomerSuccess(response.data.Customer));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateCustomer(params) {
  console.log('update, working')
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        tradingName: params.tradingName
      };
     /* eslint-enable */

      if(params.mainSite){
        data.mainSite = params.mainSite;
      }
      if(params.accountManager){
        data.accountManager = params.accountManager;
      }
      if(params.projectManager){
        data.projectManager = params.projectManager;
      }
      if(params.supportManager){
        data.supportManager = params.supportManager;
      }
      if(params.primaryBillingContact){
        data.primaryBillingContact = params.primaryBillingContact;        
      }
      if(params.primaryTechnicalContact){
        data.primaryTechnicalContact = params.primaryTechnicalContact;        
      }
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}customers/customers/${params.id}`,
        data
      );

      dispatch(getCustomer(params.id));
      dispatch(slice.actions.setCustomerEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}