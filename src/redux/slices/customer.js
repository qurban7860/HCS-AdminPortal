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
    
    // RESET CUSTOMER
    resetCustomer(state){
      state.customer = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;

    },
    
    updateCustomerSuccess(){


    },

    
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET CustomerS
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
      const response = await axios.get(`${CONFIG.SERVER_URL}customers`);
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
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/${id}`);
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
      // dispatch(slice.actions.resetCustomer());
      dispatch(slice.actions.startLoading());
      try {
        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('tradingName', params.tradingName);
        if(params.mainSite){
          formData.append('mainSite', params.mainSite);
        }
        if(params.sites.length > 0){
          formData.append('sites', params.sites);
        }
        if(params.contacts.length > 0){
          formData.append('contacts', params.contacts);
        }
        if(params.accountManager){
          formData.append('accountManager', params.accountManager);
        }
        if(params.projectManager){
          formData.append('projectManager', params.projectManager);
        }
        if(params.supportManager){
          formData.append('supportManager', params.supportManager);
        }

        const response = await axios.post(`${CONFIG.SERVER_URL}customers`,
          formData,
        );

        console.log('response', response.data.customer);
        dispatch(slice.actions.getCustomerSuccess(response.data.customer));
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

      formData.append('id', params.id);
      formData.append('name', params.name);
      formData.append('tradingName', params.tradingName);
      if(params.mainSite){
        formData.append('mainSite', params.mainSite);
      }
        // if(params.sites.length > 0){
        //   formData.append('sites', params.sites);
        // }
        // if(params.contacts.length > 0){
        //   formData.append('contacts', params.contacts);
        // }
      if(params.accountManager){
        formData.append('accountManager', params.accountManager);
      }
      if(params.projectManager){
        formData.append('projectManager', params.projectManager);
      }
      if(params.supportManager){
        formData.append('supportManager', params.supportManager);
      }
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}customers/${params.id}`,
        formData
      );
      this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}