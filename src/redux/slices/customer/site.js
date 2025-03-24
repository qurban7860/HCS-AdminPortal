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
  activeCardIndex: '',
  sitesListView: false,
  isExpanded: false,
  success: false,
  isLoading: false,
  error: null,
  sites: [],
  allSites: [],
  siteDialog: false,
  activeSites: [],
  site: null,
  lat: '',
  long: '',
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    "customer.name": false,
    "name": false,
    "address.country": false,
    "phoneNumbers": true,
    "email": true,
    "primaryTechnicalContact.firstName": false,
    "primaryBillingContact.firstName": false,
    "isActive": false,
    "createdAt": false
  },
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
    setSiteFormVisibility(state, action) {
      state.siteAddFormVisibility = action.payload;
    },

    // SET TOGGLE
    setSiteEditFormVisibility(state, action) {
      state.siteEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setSiteDialog(state, action) {
      state.siteDialog = action.payload;
    },

    // ACTIVE CARD INDEX
    setCardActiveIndex(state, action) {
      state.activeCardIndex = action.payload;
    },

    // CARD IS EXPENDED
    setIsExpanded(state, action) {
      state.isExpanded = action.payload;
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

    // GET All Sites
    getAllSitesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.allSites = action.payload;
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

    setSitesView(state, action) {
      state.sitesListView = action.payload;
    },

    // RESET SITE
    resetSite(state) {
      state.site = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SITES
    resetSites(state) {
      state.sites = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active SITES
    resetActiveSites(state) {
      state.activeSites = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET ALL SITES
    resetAllSites(state) {
      state.allSites = [];
    },

    resetSiteFormsVisiblity(state) {
      state.siteAddFormVisibility = false;
      state.siteEditFormVisibility = false;
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
    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
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
  setIsExpanded,
  setCardActiveIndex,
  setSitesView,
  resetSite,
  resetSites,
  resetAllSites,
  resetActiveSites,
  resetSiteFormsVisiblity,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setSiteDialog,
  setReportHiddenColumns,
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
        email: params.email,
        website: params.website,
        lat: params.lat,
        long: params.long,
        phoneNumbers: params?.phoneNumbers?.filter(pN => pN?.contactNumber !== '' || pN?.contactNumber !== undefined) || [],
        primaryBillingContact: params?.primaryBillingContact?._id || null,
        updateAddressPrimaryBillingContact: params?.updateAddressPrimaryBillingContact,
        primaryTechnicalContact: params?.primaryTechnicalContact?._id || null,
        updateAddressPrimaryTechnicalContact: params?.updateAddressPrimaryTechnicalContact,
        isActive: params.isActive,
        address: {}
      };

      /* eslint-enable */
      if (params.street) {
        data.address.street = params.street;
      }
      if (params.suburb) {
        data.address.suburb = params.suburb;
      }
      if (params.city) {
        data.address.city = params.city;
      }
      if (params.region) {
        data.address.region = params.region;
      }
      if (params.postcode) {
        data.address.postcode = params.postcode;
      }
      if (params.country) {
        data.address.country = params?.country?.label;
      }

      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/sites`, data);
      return response;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateSite(params, customerId, Id) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name: params.name,
        customer: params.customer,
        email: params.email,
        website: params.website,
        lat: params.lat,
        long: params.long,
        isActive: params.isActive,
        phoneNumbers: params?.phoneNumbers?.filter(pN => pN?.contactNumber !== '' || pN?.contactNumber !== undefined) || [],
        primaryBillingContact: params.primaryBillingContact?._id || null,
        updateAddressPrimaryBillingContact: params?.updateAddressPrimaryBillingContact,
        primaryTechnicalContact: params.primaryTechnicalContact?._id || null,
        updateAddressPrimaryTechnicalContact: params?.updateAddressPrimaryTechnicalContact,
        address: {}
      };

      if (params.street) {
        data.address.street = params.street;
      }
      if (params.suburb) {
        data.address.suburb = params.suburb;
      }
      if (params.city) {
        data.address.city = params.city;
      }
      if (params.region) {
        data.address.region = params.region;
      }
      if (params.postcode) {
        data.address.postcode = params.postcode;
      }
      if (params.country) {
        data.address.country = params.country.label;
      }

      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/sites/${Id}`, data);
      dispatch(slice.actions.setSiteEditFormVisibility(false));

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }

  };
}

// ----------------------------------------------------------------------

export function createCustomerStiesCSV(customerID) {
  return async (dispatch) => {
    try {
      if (customerID) {
        const response = axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites/export`,
          {
            params: {
              isArchived: false,
              orderBy: {
                createdAt: -1
              }
            }
          });

        response.then((res) => {
          const fileName = "CustomerSites.csv";
          const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          dispatch(slice.actions.setResponseMessage('Customer Sites CSV generated successfully'));
        }).catch((error) => {
          console.error(error);
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getSites(customerID, isCustomerArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: {
          createdAt: -1
        }
      }

      if (isCustomerArchived) {
        params.archivedByCustomer = true;
        params.isArchived = true;
      } else {
        params.isArchived = false;
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites`, { params });
      dispatch(slice.actions.getSitesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Sites loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getAllSites() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: {
          createdAt: -1
        },
        isArchived: false
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/sites/all`, { params });
      dispatch(slice.actions.getAllSitesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
// ----------------------------------------------------------------------

export function getActiveSites(customerID, cancelToken) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response = null;
      if (customerID) {
        response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/sites`,
          {
            params: {
              isActive: true,
              isArchived: false
            },
            cancelToken: cancelToken?.token,
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
      response = await axios.get(`${CONFIG.SERVER_URL}crm/sites/search`,
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


