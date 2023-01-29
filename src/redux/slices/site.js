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
  sites: [],
  site: null,
  siteParams: {

  }
};

const slice = createSlice({
  name: 'site',
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

    // GET SiteS
    getSitesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.sites = action.payload;
      state.initial = true;
    },

    // GET Site
    getSiteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.site = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    async saveSite(state, action) {
      try {
        const formData = new FormData();
        console.log(action.payload.department);

        formData.append('name', action.payload.name);
        formData.append('customer', action.payload.customer);
        formData.append('phone', action.payload.phone);
        formData.append('email', action.payload.email);
        formData.append('fax', action.payload.fax);
        formData.append('website', action.payload.website);
        formData.append('street', action.payload.street);
        formData.append('suburb', action.payload.suburb);
        formData.append('city', action.payload.city);
        formData.append('region', action.payload.region);
        formData.append('country', action.payload.country);
  


        const response = await axios.post(`${CONFIG.SERVER_URL}sites`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateSite(state, action) {
      try {

        const formData = new FormData();

        formData.append('id', action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('customer', action.payload.customer);
        formData.append('phone', action.payload.phone);
        formData.append('email', action.payload.email);
        formData.append('fax', action.payload.fax);
        formData.append('website', action.payload.website);
        formData.append('street', action.payload.street);
        formData.append('suburb', action.payload.suburb);
        formData.append('city', action.payload.city);
        formData.append('region', action.payload.region);
        formData.append('country', action.payload.country);

        const response = await axios.patch(`${CONFIG.SERVER_URL}sites/${action.payload.id}`,
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
  saveSite,
  updateSite,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getSites() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}sites`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getSitesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getSite(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}sites/${id}`);
      dispatch(slice.actions.getSiteSuccess(response.data));
      console.log('requested site', response.data);
      // dispatch(slice.actions.setResponseMessage('Sites Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteSite(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}sites/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


