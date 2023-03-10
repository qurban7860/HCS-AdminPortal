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
    dispatch(slice.actions.setFormVisibility(false));

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
        if(params.country !== "null" && params.country !== null){
          data.address.country = params.country;        
        }else{
          data.address.country = null;
        }
        if(params.primaryBillingContact  !== "null" && params.primaryBillingContact !== null){
          data.primaryBillingContact = params.primaryBillingContact;        
        }else{
          data.primaryBillingContact = null;
        }
        if(params.primaryTechnicalContact !== "null" && params.primaryTechnicalContact !== null){
          data.primaryTechnicalContact = params.primaryTechnicalContact;        
        }else{
          data.primaryTechnicalContact = null;
        }
        
        await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/sites`, data);
        dispatch(slice.actions.setResponseMessage('Site saved successfully'));
        dispatch(slice.actions.setFormVisibility(false));

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
        if(params.country !== "null" && params.country !== null){
          data.address.country = params.country;        
        }
        if(params.primaryBillingContact !== "null" && params.primaryBillingContact !== null ){
          data.primaryBillingContact = params.primaryBillingContact;        
        }else{
          data.primaryBillingContact = null;        
        }
        if(params.primaryTechnicalContact !== "null" && params.primaryTechnicalContact !== null){
          data.primaryTechnicalContact = params.primaryTechnicalContact;        
        }else{
          data.primaryTechnicalContact = null;        
        }

        const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/sites/${params.id}`
         , data);



      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }

  };
}

// ----------------------------------------------------------------------

export function getSites(customerID = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      if(customerID){
        response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites` , 
        {
          params: {
            isArchived: false
          }
        }
        );
      }else{
        response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/sites`);
      }
      
      // console.log(response);
      // console.log(response.data);
      dispatch(slice.actions.getSitesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getSite(customerID, id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites/${id}`);
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

export function deleteSite(customerID, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        isArchived: true,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites/${id}`,
        data
      );
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


