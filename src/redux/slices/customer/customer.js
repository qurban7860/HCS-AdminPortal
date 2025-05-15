import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

const initialState = {
  intial: false,
  customerTab: 'info',
  customerEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customers: [],
  activeCustomers: [],
  financialCompanies: [],
  allActiveCustomers: [],
  spCustomers: [],
  customer: {},
  customerDialog: false,
  newMachineCustomer: null,
  filterBy: '',
  verified: 'all',
  excludeReporting: 'included',
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    "name": false,
    "clientCode": false,
    "tradingName": false,
    "groupCustomer.name": true,
    "mainSite.address.country": false,
    "isActive": false,
    "createdAt": false
  },
  allowedModules: [
    'machineSettings',
    'machineProfiles',
    'machineConfig',
    'machineNotes',
    'assemblyDrawings',
    'machineDocuments',
    'machineLogs',
    'supportService',
    'machineGraphs',
    'machineServiceReports'
  ],
  isFullScreen: false,
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

    // SET NEW MACHINE CUSTOMER
    setNewMachineCustomer(state, action) {
      state.newMachineCustomer = action.payload;
    },

    // SET CUSTOMER TAB
    setCustomerTab(state, action) {
      state.customerTab = action.payload;
    },

    // SET TOGGLE
    setCustomerEditFormVisibility(state, action) {
      state.customerEditFormFlag = action.payload;
    },

    // SET TOGGLE
    setCustomerDialog(state, action) {
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
    getFinancialCompaniesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.financialCompanies = action.payload;
      state.initial = true;
    },

    // GET ALL Customers
    getAllActiveCustomersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.allActiveCustomers = action.payload;
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
    resetCustomer(state) {
      state.customer = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CUSTOMERS
    resetCustomers(state) {
      state.customers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET Active CUSTOMERS
    resetActiveCustomers(state) {
      state.activeCustomers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET ALL CUSTOMERS
    resetAllActiveCustomers(state) {
      state.allActiveCustomers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET FINANCING COMPANIES
    resetFinancingCompanies(state) {
      state.financialCompanies = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    // Set FilterBy
    setVerified(state, action) {
      state.verified = action.payload;
    },

    // Set Excluded
    setExcludeReporting(state, action) {
      state.excludeReporting = action.payload;
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

    // Open Full Screen Dialog
    openFullScreen(state) {
      state.isFullScreen = true;
    },

    // Close Full Screen Dialog
    closeFullScreen(state) {
      state.isFullScreen = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setNewMachineCustomer,
  setCustomerTab,
  setCustomerEditFormVisibility,
  resetCustomer,
  resetCustomers,
  resetActiveCustomers,
  resetAllActiveCustomers,
  resetFinancingCompanies,
  setResponseMessage,
  setFilterBy,
  setVerified,
  setExcludeReporting,
  ChangeRowsPerPage,
  ChangePage,
  setCustomerDialog,
  setReportHiddenColumns,
  openFullScreen,
  closeFullScreen,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCustomers(page, pageSize, isArchived, cancelToken) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        isArchived: isArchived || false,
        pagination: {
          page,
          pageSize
        }
      }
      if (isArchived) {
        params.orderBy = { updatedBy: -1 }
      } else {
        params.orderBy = { createdAt: -1 }
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
        {
          params,
          cancelToken: cancelToken?.token
        });
      dispatch(slice.actions.getCustomersSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- get Active Customers------------------------------------------

export function getActiveCustomers(cancelToken) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
        {
          params: {
            isActive: true,
            isArchived: false,
          },
          cancelToken: cancelToken?.token,
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

export function getFinancialCompanies(cancelToken) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers`,
        {
          params: {
            isActive: true,
            isArchived: false,
            isFinancialCompany: true
          },
          cancelToken: cancelToken?.token,
        });
      dispatch(slice.actions.getFinancialCompaniesSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ---------------------------- get Active Customers------------------------------------------

export function getAllActiveCustomers() {
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
      dispatch(slice.actions.getAllActiveCustomersSuccess(response.data));
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
            isArchived: false,
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
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}`,
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
      const response = await axios.delete(`${CONFIG.SERVER_URL}crm/customers/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
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
      const data = {
        name: params?.name,
        clientCode: params?.code,
        tradingName: params?.tradingName,
        ref: params?.ref,
        groupCustomer: params?.groupCustomer?._id,
        accountManager: params?.accountManager?.map((account) => account?._id),
        projectManager: params?.projectManager?.map((project) => project?._id),
        supportManager: params?.supportManager?.map((support) => support?._id),
        mainSite: {
          name: params?.name,
          phoneNumbers: params?.phoneNumbers?.filter(pN => pN?.contactNumber) || [],
          email: params?.email,
          website: params?.website,
          address: {
            street: params?.street,
            suburb: params?.suburb,
            city: params?.city,
            postcode: params?.postcode,
            country: params?.country?.label,
            region: params?.region,
          },
        },
        isTechnicalContactSameAsBillingContact: params.isTechnicalContactSameAsBillingContact,
        type: params?.type,
        modules: params?.modules,
        isActive: params.isActive,
        supportSubscription: params?.supportSubscription,
        isFinancialCompany: params?.isFinancialCompany,
        excludeReports: params?.excludeReports,
      };

      const billingContact = {}
      const technicalContact = {}

      if (params?.billingContactLastName) {
        billingContact.lastName = params?.billingContactLastName
      }
      if (params?.billingContactTitle) {
        billingContact.title = params?.billingContactTitle
      }
      if (params?.billingContactPhone?.contactNumber && params?.billingContactFirstName) {
        billingContact.phoneNumbers = [params?.billingContactPhone]
      }
      if (params?.billingContactEmail) {
        billingContact.email = params?.billingContactEmail
      }
      if (params?.billingContactFirstName) {
        billingContact.firstName = params?.billingContactFirstName
        data.billingContact = billingContact
      }

      if (params?.technicalContactTitle) {
        technicalContact.title = params?.technicalContactTitle
      }
      if (params?.technicalContactPhone?.contactNumber) {
        technicalContact.phoneNumbers = [params?.technicalContactPhone]
      }
      if (params?.technicalContactEmail) {
        technicalContact.email = params?.technicalContactEmail
      }
      if (params?.technicalContactLastName) {
        technicalContact.lastName = params?.technicalContactLastName
      }
      if (params?.technicalContactFirstName) {
        technicalContact.firstName = params?.technicalContactFirstName
        data.technicalContact = technicalContact
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
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}`, {
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

export function updateCustomerModules(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${params.id}`, {
        modules: params?.modules,
      });
      dispatch(getCustomer(params.id));
    } catch (error) {
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
      const data = {
        id: params?.id,
        name: params?.name,
        tradingName: params?.tradingName || [],
        ref: params?.ref || '',
        groupCustomer: params?.groupCustomer?._id,
        clientCode: params?.code,
        primaryBillingContact: params?.primaryBillingContact?._id || null,
        primaryTechnicalContact: params?.primaryTechnicalContact?._id || null,
        mainSite: params?.mainSite?._id || null,
        accountManager: params?.accountManager?.map(am => am._id) || null,
        projectManager: params?.projectManager?.map(pm => pm._id) || null,
        supportManager: params?.supportManager?.map(sm => sm._id) || null,
        supportSubscription: params?.supportSubscription,
        isFinancialCompany: params?.isFinancialCompany,
        excludeReports: params?.excludeReports,
        updateProductManagers: params?.updateProductManagers,
        modules: params?.modules,
        isActive: params?.isActive,
        isArchived: params?.isArchived,
      };
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${params.id}`, data);
      dispatch(getCustomer(params.id));
      dispatch(slice.actions.setCustomerEditFormVisibility(false));
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      console.error(error);
      throw error;
    }
  };

}