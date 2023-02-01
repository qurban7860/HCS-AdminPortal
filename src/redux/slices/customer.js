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
  customer: null,
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
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    async saveCustomer(state, action) {
      try {
        console.log('sites', action.payload.sites);

        const formData = new FormData();
        console.log(action.payload.department);
        formData.append('name', action.payload.name);
        formData.append('tradingName', action.payload.tradingName);
        if(action.payload.mainSite){
          formData.append('mainSite', action.payload.mainSite);
        }
        if(action.payload.sites){
          formData.append('sites', action.payload.sites);
        }
        if(action.payload.contacts){
          formData.append('contacts', action.payload.contacts);
        }
        if(action.payload.accountManager){
          formData.append('accountManager', action.payload.accountManager);
        }
        if(action.payload.projectManager){
          formData.append('projectManager', action.payload.projectManager);
        }
        if(action.payload.supportManager){
          formData.append('supportManager', action.payload.supportManager);
        }

        const response = await axios.post(`${CONFIG.SERVER_URL}customers`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateCustomer(state, action) {
      try {

        const formData = new FormData();

        formData.append('id', action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('tradingName', action.payload.tradingName);
        if(action.payload.mainSite){
          formData.append('mainSite', action.payload.mainSite);
        }
        if(action.payload.sites){
          formData.append('sites', action.payload.sites);
        }
        if(action.payload.contacts){
          formData.append('contacts', action.payload.contacts);
        }
        if(action.payload.accountManager){
          formData.append('accountManager', action.payload.accountManager);
        }
        if(action.payload.projectManager){
          formData.append('projectManager', action.payload.projectManager);
        }
        if(action.payload.supportManager){
          formData.append('supportManager', action.payload.supportManager);
        }
        
        const response = await axios.patch(`${CONFIG.SERVER_URL}customers/${action.payload.id}`,
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
  saveCustomer,
  updateCustomer,
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


