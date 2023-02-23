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
  siteAddFormVisibility: false,
  siteEditFormVisibility: false,
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
      state.error = null;
      state.isLoading = true;
    },

    // SET TOGGLE
    setFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.siteAddFormVisibility = action.payload;
    },

    // SET TOGGLE
    setEditFormVisibility(state, action){
      console.log('setEditFormVisibility', action.payload);
      state.siteEditFormVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Sites
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
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function saveSite(params) {
  return async (dispatch) => {
    console.log('siteparams', params); 
    dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          customer: params.customer,
          phone: params.phone,
          email: params.email,
          fax: params.fax,
          website: params.website,
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
        if(params.country){
          data.address.country = params.country;        
        }
        if(params.primaryBillingContact){
          data.primaryBillingContact = params.primaryBillingContact;        
        }
        if(params.primaryTechnicalContact){
          data.primaryTechnicalContact = params.primaryTechnicalContact;        
        }
        
        await axios.post(`${CONFIG.SERVER_URL}customers/sites`, data);

        dispatch(slice.actions.setFormVisibility(false));
        dispatch(slice.actions.setResponseMessage('Site saved successfully'));


      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }

  };
}

// ----------------------------------------------------------------------

export function updateSite(params) {
  
  return async (dispatch) => {
    dispatch(slice.actions.setEditFormVisibility(false));

    dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          customer: params.customer,
          phone: params.phone,
          email: params.email,
          fax: params.fax,
          website: params.website,
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
        if(params.country){
          data.address.country = params.country;        
        }
        if(params.primaryBillingContact){
          data.primaryBillingContact = params.primaryBillingContact;        
        }
        if(params.primaryTechnicalContact){
          data.primaryTechnicalContact = params.primaryTechnicalContact;        
        }

        const response = await axios.patch(`${CONFIG.SERVER_URL}customers/sites/${params.id}`
         , data);



      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }

  };
}

// ----------------------------------------------------------------------

export function getSites(params = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      if(params){
        response = await axios.get(`${CONFIG.SERVER_URL}customers/sites` , 
        {
          params: {
            customer: params
          }
        }
        );
      }else{
        response = await axios.get(`${CONFIG.SERVER_URL}customers/sites`);
      }
      
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
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/sites/${id}`);
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
      const response = await axios.delete(`${CONFIG.SERVER_URL}customers/sites/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


