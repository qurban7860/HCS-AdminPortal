import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

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
  siteDialog: false,
  activeSites: [],
  site: null,
  lat: '',
  long: '',
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
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
    setSiteFormVisibility(state, action){
      state.siteAddFormVisibility = action.payload;
    },

    // SET TOGGLE
    setSiteEditFormVisibility(state, action){
      state.siteEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setSiteDialog(state, action){
      state.siteDialog = action.payload;
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

    // GET Active Sites
    getActiveSitesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSites = action.payload;
      state.initial = true;
    },

    // GET Site
    getSiteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.site = action.payload;
      state.initial = true;
    },

    // RESET SITE
    resetSite(state){
      state.site = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SITES
    resetSites(state){
      state.sites = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active SITES
    resetActiveSites(state){
      state.activeSites = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    setLatLongCoordinates(state, action) {
      state.lat = action.payload.lat;
      state.long = action.payload.lng;
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
  setLatLongCoordinates,
  setSiteFormVisibility,
  setSiteEditFormVisibility,
  setResponseMessage,
  resetSite,
  resetSites,
  resetActiveSites,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setSiteDialog,
} = slice.actions;

// ----------------------------------------------------------------------

export function addSite(params) {
  return async (dispatch) => {
    dispatch(slice.actions.setSiteFormVisibility(false));
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
          lat: params.lat,
          long: params.long,
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
        if(params.country ){
          data.address.country = params.country;        
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
        // await dispatch(getSites(params.customer))
        await dispatch(slice.actions.setSiteFormVisibility(false));

      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
  };
}

// ----------------------------------------------------------------------

export function updateSite(params,customerId,Id) {
  
  return async (dispatch) => {
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
          lat: params.lat,
          long: params.long,
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
        if(params.country){
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
        console.log("Site Slice data : ",data)
        await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/sites/${Id}`
         , data);
        dispatch(slice.actions.setSiteEditFormVisibility(false));

      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }

  };
}

// ----------------------------------------------------------------------

export function getSites(customerID) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      if(customerID){
        response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites` , 
        {
          params: {
            isArchived: false,
            orderBy : {
              createdAt:-1
            }
          }
        }
        );
        dispatch(slice.actions.getSitesSuccess(response.data));
        dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));
      }
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getActiveSites(customerID) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      if(customerID){
        response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites` , 
        {
          params: {
            isActive: true,
            isArchived: false
          }
        }
        );
        dispatch(slice.actions.getActiveSitesSuccess(response.data));
        dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));
      }
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function searchSites() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      response = await axios.get(`${CONFIG.SERVER_URL}crm/sites/search` , 
      {
        params: {
          isArchived: false,
          lat: { $exists: true },
          long: { $exists: true }
        }
      }
      );
      dispatch(slice.actions.getSitesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));
      // else{
      //   response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/sites/search`);
      // }

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getSite(customerID, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites/${id}`);
      dispatch(slice.actions.getSiteSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Sites Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


